/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojox/html/entities"
], function (declare, lang, entities) {

    var encodeMap = [
        ["&", "amp"],
        ["<", "lt"],
        [">", "gt"],
        ["'", "apos"],
        ['"', "quot"]
    ];

    var xmlDeclarationTemplate = "<?xml version='{version}' encoding='{encoding}'?>"

    return declare(null, {
        constructor: function () {
            this.text = "";
            this.open = false;
        },

        escape: function (text) {
            return entities.encode(text, encodeMap);
        },

        writeXmlDeclaration: function (version, encoding) {
            this.text += lang.replace(xmlDeclarationTemplate, {
                version: version,
                encoding: encoding
            });
        },

        closeIfNeeded: function () {
            if (this.open) {
                this.text += ">";
                this.open = false;
            }
        },

        openElement: function (name) {
            this.closeIfNeeded();
            this.text += "<" + this.escape(name);
            this.open = true;
        },

        closeElement: function (name) {
            this.closeIfNeeded();
            this.text += "</" + this.escape(name) + ">";
        },

        addAttribute: function (name, value) {
            this.text += " " + name + '="' + this.escape(value) + '"'
        },

        write: function (text) {
            this.closeIfNeeded();
            this.text += this.escape(text);
        },

        toString: function () {
            this.closeIfNeeded();
            return this.text;
        }
    });
});