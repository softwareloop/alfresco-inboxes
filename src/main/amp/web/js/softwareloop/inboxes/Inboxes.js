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
    "dijit/registry",
    "dojo/query"
], function (ProcessWidgets, declare, template, topic, hash, lang, registry, query) {
    return declare([ProcessWidgets], {
        templateString: template,

        currentInbox: null,

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
                this.hashFirstInbox();
            }
        },

        hashFirstInbox: function () {
            var nodes = query(".inboxes-inbox", this.containerNode);
            if (nodes.length == 0) {
                console.log("No inboxes found");
                return null;
            } else {
                var inboxId = nodes[0].getAttribute('id');
                hash(inboxId);
            }
        },

        hashChangeHandler: function (hash) {
            // unselect current inbox
            if (this.currentInbox) {
                this.currentInbox.unselect();
            }

            // select the inbox that matches the hash
            this.currentInbox = registry.byId(hash);
            if (this.currentInbox) {
                this.currentInbox.select();
            } else {
                this.hashFirstInbox();
            }
        }
    });
});