/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    "alfresco/core/ProcessWidgets",
    'dojo/_base/declare',
    'dojo/text!./templates/Inboxes.html'
], function (ProcessWidgets, declare, template) {
    return declare([ProcessWidgets], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/alfresco-inboxes.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Inboxes.css"}
        ],

        title: '',

        buildRendering: function () {
            if (this.title) {
                this.title = this.message(this.title);
            }
            this.inherited(arguments);
        }

    });
});