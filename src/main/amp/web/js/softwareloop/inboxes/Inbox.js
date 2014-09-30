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
    "dojo/topic"
], function (TemplatedMixin, AttachMixin, WidgetBase, Core, declare, template, xhr, domClass, registry, hash, lang, topic) {
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

        items: null,

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
            var _this = this;
            xhr(url, {
                handleAs: "xml",
                query: queryObject
            }).then(
                lang.hitch(this, this.handleData),
                function (err) {
                    _this.counterNode.innerHTML = "ERR";
                });
        },

        handleData: function (data) {
            var totalResults = data.getElementsByTagName("totalResults")[0].innerHTML;
            this.counterNode.innerHTML = totalResults;

            var i;
            if (this.items) {
                for (i = this.items; i < this.items.length; i++) {
                    this.items[i].destroy();
                }
            }
            var _this = this;
            require([this.itemClass], function (itemClass) {
                try {
                    _this.items = [];
                    var entries = data.getElementsByTagName("entry");
                    for (i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        var item = new itemClass({entry: entry});
                        _this.items.push(item);
                    }
                    _this.postItemsIfReady();
                } catch (err) {
                    console.log(this.title, data);
                    throw err;
                }
            });
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
            if (this.items && this.selected) {
                topic.publish("/inboxes/results", this.items);
            }
        },

        clickHandler: function () {
            hash(this.id);
        }
    });
});
