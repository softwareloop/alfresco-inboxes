/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    "alfresco/core/ProcessWidgets",
    'dojo/_base/declare',
    'dojo/text!./templates/Inboxes.html'
], function (ProcessWidgets, declare, template) {
    return declare([ProcessWidgets], {
        templateString: template
    });
});