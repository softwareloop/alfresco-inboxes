define([
    "alfresco/core/ProcessWidgets",
    'dojo/_base/declare',
    'dojo/text!./templates/Results.html',
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/registry",
    "dojo/_base/array"
], function (ProcessWidgets, declare, template, lang, topic, registry, array) {
    return declare([ProcessWidgets], {
        cssRequirements: [
            {cssFile: "./css/Results.css"}
        ],

        templateString: template,

        buildRendering: function () {
            this.inherited(arguments);
            topic.subscribe(
                "/inboxes/results",
                lang.hitch(this, this.handleResults)
            );
        },

        handleResults: function (items) {
            var containerNode = this.containerNode;
            var widgets = registry.findWidgets(containerNode);
            array.forEach(widgets, function (widget) {
                widget.destroyRecursive(true);
            });
            containerNode.innerHTML = "";
            array.forEach(items, function (item) {
                item.placeAt(containerNode).startup();
            });
        }

    });
});
