/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define(["dojo/_base/lang"], function (lang) {
    return {
        getElementsByTagName: function (node, ns, tagName) {
            var result1 = node.getElementsByTagName(tagName);
            var fullTagName = lang.replace(
                "{ns}:{tagName}",
                {
                    ns: ns,
                    tagName: tagName
                }
            );
            var result2 = node.getElementsByTagName(fullTagName);
            return (result1.length > result2.length) ? result1 : result2;
        }
    }
});