define([
    "dojo/_base/array",
    "dojo/date/locale",
    "dojo/request/xhr",
    "softwareloop/util/XmlBuffer"
], function (array, locale, xhr, XmlBuffer) {
    var datePattern = "yyyy-MM-dd'T'HH:mm:ss.SZ";

    var formatOptions = {
        datePattern: datePattern,
        selector: "date"
    };

    return {
        formatDate: function (date) {
            var tmp = locale.format(date, formatOptions);
            var result = tmp.substring(0, 26) + ":" + tmp.substring(26);
            return result;
        },

        parseDate: function (stringValue) {
            return locale.parse(stringValue, formatOptions);
        },

        updateEntry: function (url, entryAttributes, successCallback, failureCallback) {
            var now = new Date();
            var xb = new XmlBuffer();
            xb.writeXmlDeclaration("1.0", "UTF-8");
            xb.openElement("atom:entry");
            xb.addAttribute("xmlns:atom", "http://www.w3.org/2005/Atom");
            xb.addAttribute("xmlns:cmis", "http://docs.oasis-open.org/ns/cmis/core/200908/");
            xb.addAttribute("xmlns:cmisra", "http://docs.oasis-open.org/ns/cmis/restatom/200908/");

            xb.openElement("atom:id");
            xb.write("urn:uuid:00000000-0000-0000-0000-00000000000");
            xb.closeElement("atom:id");

            xb.openElement("atom:title");
            xb.closeElement("atom:title");

            xb.openElement("atom:updated");
            xb.write(now.toISOString());
            xb.closeElement("atom:updated");

            xb.openElement("cmisra:object");
            xb.openElement("cmis:properties");

            for (var cmisAttributeName in entryAttributes) {
                if (entryAttributes.hasOwnProperty(cmisAttributeName)) {
                    var entryAttribute = entryAttributes[cmisAttributeName];
                    var elementName = "cmis:" + entryAttribute.tagName;
                    xb.openElement(elementName);
                    xb.addAttribute("propertyDefinitionId", cmisAttributeName);
                    array.forEach(entryAttribute.values, function (value) {
                        xb.openElement("cmis:value");
                        xb.write(value.toString());
                        xb.closeElement("cmis:value");
                    });
                    xb.closeElement(elementName);
                }
            }

            xb.closeElement("cmis:properties");
            xb.closeElement("cmisra:object");

            xb.closeElement("atom:entry");

            xhr(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/atom+xml;type=entry",
                    "Alfresco-CSRFToken": Alfresco.util.CSRFPolicy.getToken()
                },
                data: xb.toString()
            }).then(
                successCallback,
                failureCallback
            );
        }
    }
});