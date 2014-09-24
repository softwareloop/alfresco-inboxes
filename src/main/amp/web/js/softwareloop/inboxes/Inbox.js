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
    "dojo/hash"
], function (TemplatedMixin, AttachMixin, WidgetBase, Core, declare, template, xhr, domClass, registry, hash) {
    return declare([WidgetBase, TemplatedMixin, Core, AttachMixin], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/messages.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Inbox.css"},
            {cssFile: "/components/softwareloop/inboxes/zurb-foundation-icons/general_foundicons.css"}
        ],

        title: "",

        iconClass: "",

        query: null,

        buildRendering: function () {
            if (this.id) {
                this.title = this.message(this.id);
            }
            this.inherited(arguments);
        },

        postCreate: function () {
            var url = Alfresco.constants.PROXY_URI + "cmis/query";
            var queryObject = {
                q: this.query,
                includeAllowableActions: false,
                includeRelationships: false,
                searchAllVersions: false,
                skipCount: 0,
                maxItems: 0
            };
            var _this = this;
            xhr(url, {
                handleAs: "xml",
                query: queryObject
            }).then(function (data) {
                var totalResults = data.getElementsByTagName("totalResults")[0].innerHTML;
                _this.counterNode.innerHTML = totalResults;
            }, function (err) {
                _this.counterNode.innerHTML = "ERR";
            });
        },

        unselect: function () {
            domClass.remove(this.domNode, "inboxes-selected");
        },

        select: function () {
            domClass.add(this.domNode, "inboxes-selected");
            var parent = registry.getEnclosingWidget(this.domNode.parentNode);
            var fullTitle = parent.title + " \u00bb " + this.title;
            this.alfPublish("ALF_UPDATE_PAGE_TITLE", {
                title: fullTitle
            });
        },

        clickHandler: function () {
            hash(this.id);
        }
    });
});
