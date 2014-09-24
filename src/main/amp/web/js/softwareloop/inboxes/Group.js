/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    "alfresco/core/ProcessWidgets",
    'dojo/_base/declare',
    'dojo/text!./templates/Group.html'
], function (ProcessWidgets, declare, template) {
    return declare([ProcessWidgets], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/messages.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Group.css"}
        ],

        title: '',

        buildRendering: function () {
            if (this.id) {
                this.title = this.message(this.id);
            }
            this.inherited(arguments);
        }

    });
});