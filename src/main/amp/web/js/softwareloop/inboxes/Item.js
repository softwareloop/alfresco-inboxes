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
    "alfresco/core/Core",
    "dojo/_base/lang",
    "dojo/_base/array",
    "softwareloop/util/browser",
    "softwareloop/util/cmis"
], function (TemplatedMixin, WidgetBase, declare, template, locale, AlfDialog, Core, lang, array, browser, cmis) {
    return declare([WidgetBase, TemplatedMixin, Core], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/messages.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Item.css"}
        ],


        entry: null,
        entryId: null,
        entryAttributes: null,

        previewUrl: "",
        downloadUrl: "",
        escapedLine1: "",
        escapedLine2: "",
        escapedLine3: "",
        escapedLine4: "",
        escapedTag: "",

        approveLabel: "approve",
        rejectLabel: "reject",
        downloadLabel: "download",

        postMixInProperties: function () {
            this.bindToEntry();
            this.composeLines();
        },

        bindToEntry: function () {
            this.entryId = this.entry.getElementsByTagName("id")[0].firstChild.nodeValue.substring(9);
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
            this.parseProperties("propertyInteger", parseInt);

            this.parseProperties("propertyBoolean",
                function (stringValue) {
                    return stringValue === 'true';
                }
            );
            this.parseProperties("propertyDateTime", cmis.parseDate);
        },

        parseProperties: function (tagName, converter) {
            var propertyStrings =
                browser.getElementsByTagName(this.entry, "cmis", tagName);
            for (var i = 0; i < propertyStrings.length; i++) {
                var propertyString = propertyStrings[i];
                var cmisAttributeName =
                    propertyString.getAttribute("propertyDefinitionId");
                var entryAttribute = {
                    tagName: tagName,
                    values: [],
                    value: function () {
                        return (this.values.length > 0) ? this.values[0] : null
                    }
                };
                this.entryAttributes[cmisAttributeName] = entryAttribute;
                var valueNode = browser.getElementsByTagName(propertyString, "cmis", "value");
                if (valueNode) {
                    array.forEach(valueNode, function (current) {
                        var cmisAttributeValue = null;
                        try {
                            var nodeValue = current.firstChild.nodeValue;
                            cmisAttributeValue = converter(nodeValue);
                        } catch (e) {
                            cmisAttributeValue = null;
                        }
                        entryAttribute.values.push(cmisAttributeValue);
                    });
                }
            }
        },

        composeLines: function () {
            if (this.entryAttributes["cmis:baseTypeId"].value() === "cmis:document") {
                this.previewUrl = lang.replace(
                    "{proxyUri}api/node/workspace/SpacesStore/{entryId}/content/thumbnails/doclib?c=queue&ph=true&lastModified=1",
                    {
                        proxyUri: Alfresco.constants.PROXY_URI,
                        entryId: this.entryId
                    }
                );
            } else {
                this.previewUrl = lang.replace(
                    "{urlRescontext}components/documentlibrary/images/folder-64.png",
                    {
                        urlRescontext: Alfresco.constants.URL_RESCONTEXT
                    }
                );
            }
            this.downloadUrl = lang.replace(
                "{proxyUri}api/node/content/workspace/SpacesStore/{entryId}/{filename}?a=true",
                {
                    proxyUri: Alfresco.constants.PROXY_URI,
                    entryId: this.entryId,
                    filename: encodeURIComponent(this.entryAttributes["cmis:name"].value())
                }
            );
            this.escapedLine1 = this.encodeHTML(this.entryAttributes["cmis:name"].value());
            if (!this.escapedLine1) {
                this.escapedLine1 = "";
            }
            this.escapedLine2 = this.encodeHTML(this.entryAttributes["cm:title"].value());
            if (!this.escapedLine2) {
                this.escapedLine2 = "";
            }
            var line3 = this.message(
                "modified.on.by",
                {
                    date: locale.format(this.entryAttributes["cmis:lastModificationDate"].value(), {
                        formatLength: "medium",
                        locale: Alfresco.constants.JS_LOCALE.substring(0, 2)
                    }),
                    user: this.entryAttributes["cmis:lastModifiedBy"].value()
                }
            );
            this.escapedLine3 = this.encodeHTML(line3);
            if (!this.escapedLine3) {
                this.escapedLine3 = "";
            }
            this.escapedLine4 = this.encodeHTML(this.entryAttributes["cm:description"].value());
            if (!this.escapedLine4) {
                this.escapedLine4 = "";
            }
            var versionLabel = this.entryAttributes["cmis:versionLabel"].value();
            if ("0.0" === versionLabel) {
                versionLabel = "1.0";
            }
            this.escapedTag = this.encodeHTML(versionLabel);
            if (!this.escapedTag) {
                this.escapedTag = "";
            }

            this.downloadLabel = this.message(
                "download.size",
                {
                    size: this.getHumanSize(this.entryAttributes["cmis:contentStreamLength"].value())
                }
            );
        },

        buildRendering: function () {
            if (this.approveLabel) {
                this.approveLabel = this.message(this.approveLabel);
            }
            if (this.rejectLabel) {
                this.rejectLabel = this.message(this.rejectLabel);
            }
            this.inherited(arguments);
        },

        approveAction: function () {
            this.showDialog(
                "Document approved",
                    "This is just a stub action. " +
                    "To provide a real implementation you should customize " +
                        "Item.approveAction()",
                true
            );
        },

        rejectAction: function () {
            this.showDialog(
                "Document rejected",
                    "This is just a stub action. " +
                    "To provide a real implementation you should customize " +
                        "Item.rejectAction()",
                true
            );
        },

        showDialog: function (title, content, reloadOnHide) {
            var myDialog = new AlfDialog({
                title: title,
                content: content,
                style: "width: 300px"
            });
            if (reloadOnHide) {
                myDialog.on("hide", function () {
                    location.reload(false);
                });
            }
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
