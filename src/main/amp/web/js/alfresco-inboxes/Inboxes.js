/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    'dojo/_base/declare',
    'alfresco/layout/ClassicWindow'
], function (declare, ClassicWindow) {
    return declare([ClassicWindow], {
        i18nRequirements: [
            {i18nFile: "./i18n/alfresco-inboxes.properties"}
        ]
    });
});