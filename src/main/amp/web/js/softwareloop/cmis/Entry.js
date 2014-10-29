define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "softwareloop/cmis/cmis",
    "softwareloop/util/browser"
], function (declare, array, cmis, browser) {
    return declare(null, {
        constructor: function (entryNode) {
            this.attributes = {};
            this.parseProperties(entryNode, "propertyId",
                function (stringValue) {
                    return stringValue;
                }
            );
            this.parseProperties(entryNode, "propertyString",
                function (stringValue) {
                    return stringValue;
                }
            );
            this.parseProperties(entryNode, "propertyInteger", parseInt);

            this.parseProperties(entryNode, "propertyBoolean",
                function (stringValue) {
                    return stringValue === 'true';
                }
            );
            this.parseProperties(entryNode, "propertyDateTime", cmis.parseDate);

            this.id = this.getAttributeValues("cmis:versionSeriesId");
        },

        parseProperties: function (entryNode, tagName, converter) {
            var propertyStrings =
                browser.getElementsByTagName(entryNode, "cmis", tagName);
            for (var i = 0; i < propertyStrings.length; i++) {
                var propertyString = propertyStrings[i];
                var cmisAttributeName =
                    propertyString.getAttribute("propertyDefinitionId");
                var attribute = {
                    tagName: tagName,
                    values: [],
                    value: function () {
                        return (this.values.length > 0) ? this.values[0] : null
                    }
                };
                this.attributes[cmisAttributeName] = attribute;
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
                        attribute.values.push(cmisAttributeValue);
                    });
                }
            }
        },

        getAttributeValues: function (name) {
            var attribute = this.attributes[name];
            return attribute ? attribute.values : [];
        },

        getAttributeValue: function (name) {
            var attributeValues = this.getAttributeValues(name);
            return (attributeValues.length > 0) ? attributeValues[0] : null;
        }

    });
});