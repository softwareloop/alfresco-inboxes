/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'alfresco/core/Core',
    'dojo/_base/declare',
    'dojo/text!./templates/InboxItem.html'
], function (TemplatedMixin, WidgetBase, Core, declare, template) {
    return declare([WidgetBase, TemplatedMixin, Core], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/alfresco-inboxes.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/InboxItem.css"},
            {cssFile: "/components/alfresco-inboxes/zurb-foundation-icons/general_foundicons.css"}
        ],

        i18nTitle: null,

        title: '',

        iconClass: '',

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            if (this.i18nTitle) {
                this.title = this.message(this.i18nTitle);
            }
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
        }
    });
});
