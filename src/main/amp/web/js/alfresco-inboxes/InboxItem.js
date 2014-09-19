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

        cssRequirements: [
            {cssFile: "./css/InboxItem.css"},
            {cssFile: "/components/alfresco-inboxes/zurb-foundation-icons/general_foundicons.css"}
        ],

        title: '',

        iconClass: '',

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
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
