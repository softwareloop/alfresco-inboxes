/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

var webscriptConfig = new XML(config.script);

var inboxes = {
    name: "softwareloop/inboxes/Inboxes",
    config: {
        width: "30%",
        widgets: []
    }
};
var groups = webscriptConfig.group;
var group;
var index;
var index2;
var widget;
var groupInboxes;
var groupInbox;
for (index in groups) {
    group = groups[index];
    widget = {
        name: "softwareloop/inboxes/Group",
        config: {
            id: String(group.@id),
            widgets: []
        }
    };
    inboxes.config.widgets.push(widget);
    groupInboxes = group.inbox;
    for (index2 in groupInboxes) {
        groupInbox = groupInboxes[index2];
        widget.config.widgets.push({
            name: "softwareloop/inboxes/Inbox",
            config: {
                id: String(groupInbox.@id),
                iconClass: String(groupInbox.@iconClass)
            }
        });
    }
}

model.jsonModel = {
    widgets: [
        {
            id: "SET_PAGE_TITLE",
            name: "alfresco/header/SetTitle",
            config: {
                title: "Inboxes"
            }
        },
        {
            name: "alfresco/layout/VerticalWidgets",
            config: {
                baseClass: "side-margins",
                widgets: [
                    {
                        id: "MY_HORIZONTAL_WIDGET_LAYOUT",
                        name: "alfresco/layout/HorizontalWidgets",
                        config: {
                            widgets: [
                                inboxes,
                                {
                                    name: "alfresco/buttons/AlfButton",
                                    config: {
                                        width: "70%",
                                        label: "Hello!"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
};
