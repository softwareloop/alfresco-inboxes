/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    'dijit/_TemplatedMixin',
    'dijit/_AttachMixin',
    'dijit/_WidgetBase',
    'alfresco/core/Core',
    'dojo/_base/declare',
    'dojo/text!./templates/Inbox.html',
    "dojo/request/xhr",
    "dojo/dom-class",
    "dijit/registry",
    "dojo/hash",
    "dojo/_base/lang",
    "dojo/topic",
    "softwareloop/util/browser",
    "softwareloop/cmis/cmis",
    "softwareloop/cmis/Entry",
    "dojo/_base/array"
], function (TemplatedMixin, AttachMixin, WidgetBase, Core, declare, template, xhr, domClass, registry, hash, lang, topic, browser, cmis, Entry, array) {
    return declare([WidgetBase, TemplatedMixin, Core, AttachMixin], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/messages.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Inbox.css"},
            {cssFile: "./css/Item.css"}, // This is required because Alfresco won't detect css requirements of classes that are loaded dynamically
            {cssFile: "/components/softwareloop/inboxes/zurb-foundation-icons/general_foundicons.css"}
        ],

        title: "",

        iconClass: "",

        query: null,

        selected: false,

        data: null,

        itemClass: "softwareloop/inboxes/Item",

        weekStartOffset: 0,

        buildRendering: function () {
            if (this.id) {
                this.title = this.message(this.id);
            }
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            var url = Alfresco.constants.PROXY_URI + "cmis/query";
            xhr(url, {
                handleAs: "xml",
                query: this.getCmisQueryObject()
            }).then(
                lang.hitch(this, this.handleData),
                lang.hitch(this, function (err) {
                    this.counterNode.innerHTML = "ERR";
                    console.log(err.message);
                })
            );
        },

        getCmisQueryObject: function () {
            var cmisQuery = lang.replace(this.query, this.getCmisQueryParameters());
            return {
                q: cmisQuery,
                includeAllowableActions: false,
                includeRelationships: false,
                searchAllVersions: false,
                skipCount: 0
            };
        },

        getCmisQueryParameters: function () {
            var now = new Date();
            var y = now.getFullYear();
            var m = now.getMonth();
            var d = now.getDate();
            var dov = now.getDay() - this.weekStartOffset;
            var todayStart = new Date(y, m, d);
            var todayEnd = new Date(y, m, d + 1);
            var weekStart = new Date(y, m, d - dov);
            var weekEnd = new Date(y, m, d - dov + 7);
            var monthStart = new Date(y, m, 1);
            var monthEnd = new Date(y, m + 1, 1);
            var yearStart = new Date(y, 0, 1);
            var yearEnd = new Date(y + 1, 0, 1);
            result = {
                userName: Alfresco.constants.USERNAME,
                now: cmis.formatDate(now),
                todayStart: cmis.formatDate(todayStart),
                todayEnd: cmis.formatDate(todayEnd),
                weekStart: cmis.formatDate(weekStart),
                weekEnd: cmis.formatDate(weekEnd),
                monthStart: cmis.formatDate(monthStart),
                monthEnd: cmis.formatDate(monthEnd),
                yearStart: cmis.formatDate(yearStart),
                yearEnd: cmis.formatDate(yearEnd)
            };
            return result;
        },

        handleData: function (data) {
            var totalResultsNodes =
                browser.getElementsByTagName(data, "opensearch", "totalResults");
            var totalResults = totalResultsNodes[0].firstChild.nodeValue;
            this.counterNode.innerHTML = totalResults;

            this.data = data;
            this.postItemsIfReady();
        },

        postItems: function () {
            require([this.itemClass], lang.hitch(this, function (itemClass) {
                try {
                    var i;
                    var items = [];
                    var entryNodes = this.data.getElementsByTagName("entry");
                    array.forEach(entryNodes, function (entryNode) {
                        var entry = new Entry(entryNode);
                        var item = new itemClass({entry: entry});
                        items.push(item);
                    });
                    topic.publish("/inboxes/results", items);
                } catch (err) {
                    console.log(this.title, this.data, err);
                }
            }));
        },

        unselect: function () {
            this.selected = false;
            domClass.remove(this.domNode, "inboxes-selected");
        },

        select: function () {
            this.selected = true;
            domClass.add(this.domNode, "inboxes-selected");
            var parent = registry.getEnclosingWidget(this.domNode.parentNode);
            var fullTitle = parent.title + " \u00bb " + this.title;
            this.alfPublish("ALF_UPDATE_PAGE_TITLE", {
                title: fullTitle
            });
            this.postItemsIfReady();
        },

        postItemsIfReady: function () {
            if (this.data && this.selected) {
                this.postItems();
            }
        },

        clickHandler: function () {
            hash(this.id);
        }
    });
});
