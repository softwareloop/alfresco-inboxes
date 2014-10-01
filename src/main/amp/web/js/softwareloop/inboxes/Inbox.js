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
    "softwareloop/compatibility/browser",
    "dojo/_base/array"
], function (TemplatedMixin, AttachMixin, WidgetBase, Core, declare, template, xhr, domClass, registry, hash, lang, topic, browser, array) {
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

        buildRendering: function () {
            if (this.id) {
                this.title = this.message(this.id);
            }
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            var url = Alfresco.constants.PROXY_URI + "cmis/query";
            var queryObject = {
                q: this.query,
                includeAllowableActions: false,
                includeRelationships: false,
                searchAllVersions: false,
                skipCount: 0
            };
            xhr(url, {
                handleAs: "xml",
                query: queryObject
            }).then(
                lang.hitch(this, this.handleData),
                lang.hitch(this, function (err) {
                    this.counterNode.innerHTML = "ERR";
                    console.log(err.message);
                })
            );
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
                    var entries = this.data.getElementsByTagName("entry");
                    array.forEach(entries, function (entry) {
                        var item = new itemClass({entry: entry});
                        items.push(item);
                    });
                    topic.publish("/inboxes/results", items);
                } catch (err) {
                    console.log(this.title, this.data);
                    throw err;
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
