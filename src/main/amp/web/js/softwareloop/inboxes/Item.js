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
    "dojo/_base/lang"
], function (TemplatedMixin, WidgetBase, declare, template, locale, AlfDialog, Core, lang) {
    return declare([WidgetBase, TemplatedMixin, Core], {
        templateString: template,

        i18nRequirements: [
            {i18nFile: "./i18n/messages.properties"}
        ],

        cssRequirements: [
            {cssFile: "./css/Item.css"}
        ],


        entry: null,

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
            this.composeLines();
        },

        composeLines: function () {
            if (this.entry.getAttributeValue("cmis:baseTypeId") === "cmis:document") {
                this.previewUrl = lang.replace(
                    "{proxyUri}api/node/workspace/SpacesStore/{entryId}/content/thumbnails/doclib?c=queue&ph=true&lastModified=1",
                    {
                        proxyUri: Alfresco.constants.PROXY_URI,
                        entryId: this.entry.id
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
                    entryId: this.entry.id,
                    filename: encodeURIComponent(this.entry.getAttributeValue("cmis:name"))
                }
            );
            this.escapedLine1 = this.encodeHTML(this.entry.getAttributeValue("cmis:name"));
            if (!this.escapedLine1) {
                this.escapedLine1 = "";
            }
            this.escapedLine2 = this.encodeHTML(this.entry.getAttributeValue("cm:title"));
            if (!this.escapedLine2) {
                this.escapedLine2 = "";
            }
            var line3 = this.message(
                "modified.on.by",
                {
                    date: locale.format(this.entry.getAttributeValue("cmis:lastModificationDate"), {
                        formatLength: "medium",
                        locale: Alfresco.constants.JS_LOCALE.substring(0, 2)
                    }),
                    user: this.entry.getAttributeValue("cmis:lastModifiedBy")
                }
            );
            this.escapedLine3 = this.encodeHTML(line3);
            if (!this.escapedLine3) {
                this.escapedLine3 = "";
            }
            this.escapedLine4 = this.encodeHTML(this.entry.getAttributeValue("cm:description"));
            if (!this.escapedLine4) {
                this.escapedLine4 = "";
            }
            var versionLabel = this.entry.getAttributeValue("cmis:versionLabel");
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
                    size: this.getHumanSize(this.entry.getAttributeValue("cmis:contentStreamLength"))
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
