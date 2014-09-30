/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/Item.html',
    "dojo/date/locale",
    "alfresco/dialogs/AlfDialog",
    "alfresco/core/Core"
], function (TemplatedMixin, WidgetBase, declare, template, locale, AlfDialog, Core) {
    return declare([WidgetBase, TemplatedMixin, Core], {
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

        entry: null,
        entryId: null,
        entryAttributes: null,

        previewUrl: "",
        escapedLine1: "",
        escapedLine2: "",
        escapedLine3: "",
        escapedLine4: "",
        escapedTag: "",

        approveString: "approve",
        rejectString: "reject",

        postMixInProperties: function () {
            this.bindToEntry();
            this.composeLines();
        },

        bindToEntry: function () {
            this.entryId = this.entry.getElementsByTagName("id")[0].innerHTML.substring(9);
            this.entryAttributes = {};
            this.parseProperties("propertyId",
                function (stringValue) {
                    return stringValue;
                }
            );
            this.parseProperties("propertyString",
                function (stringValue) {
                    return stringValue;
                }
            );
            this.parseProperties("propertyInteger",
                function (stringValue) {
                    return parseInt(stringValue);
                }
            );
            this.parseProperties("propertyBoolean",
                function (stringValue) {
                    return stringValue === 'true';
                }
            );
            var _formatOptions = this.formatOptions;
            this.parseProperties("propertyDateTime",
                function (stringValue) {
                    return locale.parse(stringValue, _formatOptions);
                }
            );
        },

        parseProperties: function (tagName, converter) {
            var propertyStrings = this.entry.getElementsByTagName(tagName);
            for (var i = 0; i < propertyStrings.length; i++) {
                var propertyString = propertyStrings[i];
                var cmisAttributeName = propertyString.getAttribute("propertyDefinitionId").replace(":", "_");
                var valueNode = propertyString.getElementsByTagName("value");
                var cmisAttributeValue = null;
                if (valueNode && valueNode.length > 0) {
                    cmisAttributeValue = converter(valueNode[0].innerHTML);
                }
                this.entryAttributes[cmisAttributeName] = cmisAttributeValue;
            }
        },

        composeLines: function () {
            this.previewUrl = Alfresco.constants.PROXY_URI +
                "api/node/workspace/SpacesStore/" +
                this.entryId +
                "/content/thumbnails/doclib?c=queue&ph=true&lastModified=1";
            this.escapedLine1 = this.encodeHTML(this.entryAttributes.cmis_name);
            if (!this.escapedLine1) {
                this.escapedLine1 = "";
            }
            this.escapedLine2 = this.encodeHTML(this.entryAttributes.cm_title);
            if (!this.escapedLine2) {
                this.escapedLine2 = "";
            }
            var line3 = this.message(
                "modified.on.by.size",
                {
                    date: locale.format(this.entryAttributes.cmis_lastModificationDate, {
                        formatLength: "medium",
                        locale: Alfresco.constants.JS_LOCALE.substring(0, 2)
                    }),
                    user: this.entryAttributes.cmis_lastModifiedBy,
                    size: this.getHumanSize(this.entryAttributes.cmis_contentStreamLength)
                }
            );
            this.escapedLine3 = this.encodeHTML(line3);
            if (!this.escapedLine3) {
                this.escapedLine3 = "";
            }
            this.escapedLine4 = this.encodeHTML(this.entryAttributes.cm_description);
            if (!this.escapedLine4) {
                this.escapedLine4 = "";
            }
            var versionLabel = this.entryAttributes.cmis_versionLabel;
            if ("0.0" === versionLabel) {
                versionLabel = "1.0";
            }
            this.escapedTag = this.encodeHTML(versionLabel);
            if (!this.escapedTag) {
                this.escapedTag = "";
            }
        },

        buildRendering: function () {
            if (this.approveString) {
                this.approveString = this.message(this.approveString);
            }
            if (this.rejectString) {
                this.rejectString = this.message(this.rejectString);
            }
            this.inherited(arguments);
        },

        approveAction: function () {
            this.showDialog(
                "Document approved",
                    "This is just a stub action. " +
                    "To provide a real implementation you should customize " +
                    "Item.approveAction()"
            );
        },

        rejectAction: function () {
            this.showDialog(
                "Document rejected",
                    "This is just a stub action. " +
                    "To provide a real implementation you should customize " +
                    "Item.rejectAction()"
            );
        },

        showDialog: function (title, content) {
            var myDialog = new AlfDialog({
                title: title,
                content: content,
                style: "width: 300px"
            });
            myDialog.on("hide", function () {
                location.reload(false);
            });
            myDialog.show();
        },

        sizePrefixes: " KMGTPEZYXWVU",

        getHumanSize: function (size) {
            if (size <= 0) return '0';
            var t2 = Math.min(Math.floor(Math.log(size) / Math.log(1024)), 12);
            return (Math.round(size * 10 / Math.pow(1024, t2)) / 10) +
                this.sizePrefixes.charAt(t2).replace(' ', '') + 'B';
        }

    });
});
