/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

var webscriptConfig = new XML(config.script);

var inboxes = {
    name: "softwareloop/inboxes/Inboxes",
    align: "sidebar",
    widthPx: 340,
    config: {
        width: "30%",
        widgets: []
    }
};

var weekStartOffset = Number(webscriptConfig.@weekStartOffset);
var defaultInboxClass = "softwareloop/inboxes/Inbox";
var groups = webscriptConfig.group;
var group;
var index;
var index2;
var groupInboxes;
var groupInbox;
var groupInboxName;
var groupWidget;
var inboxWidget;
for (index in groups) {
    group = groups[index];
    groupWidget = {
        name: "softwareloop/inboxes/Group",
        config: {
            id: String(group.@id),
            widgets: []
        }
    };
    inboxes.config.widgets.push(groupWidget);
    groupInboxes = group.inbox;
    for (index2 in groupInboxes) {
        groupInbox = groupInboxes[index2];
        groupInboxName = String(groupInbox.@inboxClass);
        if (!groupInboxName) {
            groupInboxName = defaultInboxClass;
        }
        inboxWidget = {
            name: groupInboxName,
            config: {
                id: String(groupInbox.@id),
                iconClass: String(groupInbox.@iconClass),
                query: String(groupInbox.query),
                weekStartOffset: weekStartOffset
            }
        };
        var itemClass = String(groupInbox.@itemClass);
        if (itemClass) {
            inboxWidget.config.itemClass = itemClass;
        }
        groupWidget.config.widgets.push(inboxWidget);
    }
}

var results = {
    name: "alfresco/layout/VerticalWidgets",
    config: {
        id: "results-container",
        width: "70%",
        widgets: [
            {
                name: "softwareloop/inboxes/Results",
                config: {
                    id: "results"
                }
            }
        ]
    }
};


model.jsonModel = {
    widgets: [
        {
            name: "alfresco/layout/VerticalWidgets",
            config: {
                baseClass: "side-margins",
                widgets: [
                    {
                        name: "alfresco/layout/HorizontalWidgets",
                        config: {
                            widgets: [
                                inboxes,
                                results
                            ]
                        }
                    }
                ]
            }
        }
    ]
};
