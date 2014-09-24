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
    "dijit/registry"
], function (TemplatedMixin, AttachMixin, WidgetBase, Core, declare, template, xhr, domClass, registry) {
    return declare([WidgetBase, TemplatedMixin, Core, AttachMixin], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/messages.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Inbox.css"},
            {cssFile: "/components/softwareloop/inboxes/zurb-foundation-icons/general_foundicons.css"}
        ],

        title: '',

        iconClass: '',

        buildRendering: function () {
            if (this.id) {
                this.title = this.message(this.id);
            }
            this.inherited(arguments);
        },

        unselect: function () {
            domClass.remove(this.inboxNode, "inboxes-selected");
        },

        select: function () {
            domClass.add(this.inboxNode, "inboxes-selected");
            var parent = registry.getEnclosingWidget(this.inboxNode.parentNode);
            var fullTitle = parent.title + " \u00bb " + this.title;
            this.alfPublish("ALF_UPDATE_PAGE_TITLE", {
                title: fullTitle
            });
        },

        inboxClick: function () {
            var url = 'http://localhost:8080/share/proxy/alfresco/cmis/query?q=select%20cmis:name,cmis:objectId%20from%20cmis:document%20where%20cmis:name%20=%27Project%20Contract.pdf%27';
            xhr(url, {
                handleAs: "xml"
            }).then(function (data) {
                alert('Got data');
            }, function (err) {
                alert('Got error');
            });

        }
    });
});
