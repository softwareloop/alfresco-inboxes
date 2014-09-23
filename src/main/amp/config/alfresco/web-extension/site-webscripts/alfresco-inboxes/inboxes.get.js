/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

//<import resource="classpath:/alfresco/site-webscripts/org/alfresco/share/imports/share-header.lib.js">
//<import resource="classpath:/alfresco/site-webscripts/org/alfresco/share/imports/share-footer.lib.js">

// Get the initial header services and widgets...
//var services = getHeaderServices();
//var widgets = getHeaderModel("Alfresco inboxes");

var webscriptConfig = new XML(config.script);

var inboxSelection = {
    name: "alfresco/layout/VerticalWidgets",
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
        name: "alfresco-inboxes/Inboxes",
        config: {
            title: String(group.title),
            widgets: []
        }
    };
    inboxSelection.config.widgets.push(widget);
    groupInboxes = group.inbox;
    for (index2 in groupInboxes) {
        groupInbox = groupInboxes[index2];
        widget.config.widgets.push({
            name: "alfresco-inboxes/InboxItem",
                config: {
                    title: String(groupInbox.title),
                    iconClass: String(groupInbox.iconClass)
                }
        });
    }
}

var main = {
    name: "alfresco/layout/VerticalWidgets",
    config: {
        baseClass: "side-margins",
        widgets: [
            {
                id: "MY_HORIZONTAL_WIDGET_LAYOUT",
                name: "alfresco/layout/HorizontalWidgets",
                config: {
                    widgets: [
                        inboxSelection,
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
};


model.jsonModel = {
    widgets: [main]
};
//widgets.push(main);
// Push services and widgets into the getFooterModel to return with a sticky footer wrapper
//model.jsonModel = getFooterModel(services, widgets);
//model.jsonModel.groupMemberships = user.properties["alfUserGroups"];