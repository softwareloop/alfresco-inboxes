define([
    "alfresco/core/ProcessWidgets",
    'dojo/_base/declare',
    'dojo/text!./templates/Results.html',
    "dojo/_base/lang",
    "dojo/topic"
], function (ProcessWidgets, declare, template, lang, topic) {
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
            this.containerNode.innerHTML = "";
            for (var i = 0; i < items.length; i++) {
                items[i].placeAt(this.containerNode).startup();
            }
        }

    });
});
