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
            i18nTitle: "drafts",
            iconClass: "foundicon-paper-clip"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            i18nTitle: "for.my.approval",
            iconClass: "foundicon-inbox"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            i18nTitle: "overdue",
            iconClass: "foundicon-clock"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            i18nTitle: "high.priority",
            iconClass: "foundicon-flag"
        }
    }
];

var archiveList = [
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            i18nTitle: "invoices",
            iconClass: "foundicon-page"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            i18nTitle: "purchase.orders",
            iconClass: "foundicon-left-arrow"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            i18nTitle: "quotations",
            iconClass: "foundicon-right-arrow"
        }
    },
    {
        name: "alfresco-inboxes/InboxItem",
        config: {
            i18nTitle: "marketing.documents",
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
                name: "alfresco-inboxes/Inboxes",
                config: {
                    title: "my.inboxes",
                    widgets: myInboxList
                }
            },
            {
                name: "alfresco-inboxes/Inboxes",
                config: {
                    title: "archive",
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