/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

//<import resource="classpath:/alfresco/site-webscripts/org/alfresco/share/imports/share-header.lib.js">
//<import resource="classpath:/alfresco/site-webscripts/org/alfresco/share/imports/share-footer.lib.js">

// Get the initial header services and widgets...
//var services = getHeaderServices();
//var widgets = getHeaderModel("Alfresco inboxes");

var myInboxList = [
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            title: "Drafts",
            iconClass: "foundicon-paper-clip"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            title: "For my approval",
            iconClass: "foundicon-inbox"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            title: "Overdue",
            iconClass: "foundicon-clock"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            title: "High priority",
            iconClass: "foundicon-flag"
        }
    }
];

var archiveList = [
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            title: "Invoices",
            iconClass: "foundicon-page"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            title: "Purchase orders",
            iconClass: "foundicon-left-arrow"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            title: "Quotations",
            iconClass: "foundicon-right-arrow"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            title: "Marketing documents",
            iconClass: "foundicon-globe"
        }
    }
];

var inboxSelection = {
    name: "alfresco/layout/VerticalWidgets",
    align: "sidebar",
    widthPx: 250,
    config: {
        widgets: [
            {
                name: "alfresco/layout/ClassicWindow",
                config: {
                    title: "My inbox",
                    widgets: myInboxList
                }
            },
            {
                name: "alfresco/layout/ClassicWindow",
                config: {
                    title: "Archive",
                    widgets: archiveList
                }
            }
        ]
    }
};

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
                            name: "alfresco-inboxes/TemplateWidget"
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