/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/Item.html'
], function (TemplatedMixin, WidgetBase, declare, template) {
    return declare([WidgetBase, TemplatedMixin], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/messages.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Item.css"}
        ],

        cmisAttributes: {},

        constructor: function (params, srcNodeRef, entry) {
            this.bindToEntry(entry);
        },

        bindToEntry: function (entry) {
            var propertyStrings = entry.getElementsByTagName("propertyString");
            for (var i = 0; i < propertyStrings.length; i++) {
                var propertyString = propertyStrings[i];
                console.log(propertyString);
                var cmisAttributeName = propertyString.getAttribute("propertyDefinitionId").replace(":", "_");
                var valueNode = propertyString.getElementsByTagName("value");
                if (valueNode && valueNode.length > 0) {
                    var cmisAttributeValue = valueNode[0].innerHTML;
                }
                this.cmisAttributes[cmisAttributeName] = cmisAttributeValue;
            }
        }
    });
});
