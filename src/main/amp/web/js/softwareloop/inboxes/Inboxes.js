/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

define([
    "alfresco/core/ProcessWidgets",
    'dojo/_base/declare',
    'dojo/text!./templates/Inboxes.html',
    "dojo/topic",
    "dojo/hash",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class"
], function (ProcessWidgets, declare, template, topic, hash, lang, array, dom, query, domClass) {
    return declare([ProcessWidgets], {
        templateString: template,

        buildRendering: function () {
            topic.subscribe(
                "/dojo/hashchange",
                lang.hitch(this, this.hashChangeHandler)
            );
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
            if (hash()) {
                topic.publish("/dojo/hashchange", hash());
            } else {
                var nodes = query(".inboxes-inbox", this.containerNode);
                if (nodes.length > 0) {
                    var inboxId = nodes[0].getAttribute('id');
                    hash(inboxId);
                }
            }
        },

        hashChangeHandler: function (hash) {
            // reset previously selected inbox
            var nodes = query(".inboxes-inbox.inboxes-selected", this.containerNode);
            array.forEach(nodes, function (node) {
                domClass.remove(node, "inboxes-selected");
            });

            // select the one that matches the hash
            var node = dom.byId(hash);
            if (node) {
                domClass.add(node, "inboxes-selected");
            } else {
                console.warn("Node", hash, "not found");
            }
        }
    });
});