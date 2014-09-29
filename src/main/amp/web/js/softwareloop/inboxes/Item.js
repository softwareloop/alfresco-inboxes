/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/Item.html',
    "dojo/date/locale"
], function (TemplatedMixin, WidgetBase, declare, template, locale) {
    return declare([WidgetBase, TemplatedMixin], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/messages.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Item.css"}
        ],

        formatOptions: {
            datePattern: "yyyy-MM-ddTHH:mm:ss.SSSZZ",
            selector: "date"
        },

        cmisAttributes: {},

        escapedLine1: "",
        escapedLine2: "",
        escapedLine3: "",
        escapedLine4: "",
        escapedTag: "",

        constructor: function (params, srcNodeRef, entry) {
            this.bindToEntry(entry);
            this.composeLines();
        },

        bindToEntry: function (entry) {
            this.parseProperties(entry, "propertyId",
                function (stringValue) {
                    return stringValue;
                }
            );
            this.parseProperties(entry, "propertyString",
                function (stringValue) {
                    return stringValue;
                }
            );
            this.parseProperties(entry, "propertyInteger",
                function (stringValue) {
                    return parseInt(stringValue);
                }
            );
            this.parseProperties(entry, "propertyBoolean",
                function (stringValue) {
                    return stringValue === 'true';
                }
            );
            var _formatOptions = this.formatOptions;
            this.parseProperties(entry, "propertyDateTime",
                function (stringValue) {
                    return locale.parse(stringValue, _formatOptions);
                }
            );
        },

        parseProperties: function (entry, tagName, converter) {
            var propertyStrings = entry.getElementsByTagName(tagName);
            for (var i = 0; i < propertyStrings.length; i++) {
                var propertyString = propertyStrings[i];
                var cmisAttributeName = propertyString.getAttribute("propertyDefinitionId").replace(":", "_");
                var valueNode = propertyString.getElementsByTagName("value");
                var cmisAttributeValue = null;
                if (valueNode && valueNode.length > 0) {
                    cmisAttributeValue = converter(valueNode[0].innerHTML);
                }
                this.cmisAttributes[cmisAttributeName] = cmisAttributeValue;
            }
        },

        composeLines: function () {
            this.escapedLine1 = this._escapeValue(this.cmisAttributes.cmis_name);
            this.escapedLine2 = this._escapeValue(this.cmisAttributes.cm_title);
            var line3 = "Modified on " +
                this.cmisAttributes.cmis_lastModificationDate +
                " by " +
                this.cmisAttributes.cmis_lastModifiedBy +
                " - " +
                this.cmisAttributes.cmis_contentStreamLength;
            this.escapedLine3 = this._escapeValue(line3);
            this.escapedLine4 = this._escapeValue(this.cmisAttributes.cm_description);
            this.escapedTag = this._escapeValue(this.cmisAttributes.cmis_versionLabel);
        },

        /* Borrowed from dojo 1.10 */
        _escapeValue: function (/*String*/ val) {
            if (val) {
                return val.replace(/["'<>&]/g, function (val) {
                    return {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        "\"": "&quot;",
                        "'": "&#x27;"
                    }[val];
                });
            } else {
                return null;
            }
        }
    });
});
