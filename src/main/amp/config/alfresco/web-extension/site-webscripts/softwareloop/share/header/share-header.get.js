<import resource="classpath:/alfresco/site-webscripts/org/alfresco/share/imports/share-header.lib.js">

model.jsonModel = {
    rootNodeId: "share-header",
    services: getHeaderServices(),
    widgets: [
        {
            id: "SHARE_VERTICAL_LAYOUT",
            name: "alfresco/layout/VerticalWidgets",
            config: {
                widgets: getHeaderModel()
            }
        }
    ]
};

var inboxesMenu = {
    id: "HEADER_INBOXES",
    name: "alfresco/menus/AlfMenuBarItem",
    config: {
        id: "HEADER_INBOXES",
        label: "Inboxes",
        targetUrl: "hdp/ws/inboxes"
    }
};

var appMenu =
    widgetUtils.findObject(model.jsonModel, "id", "HEADER_APP_MENU_BAR");
if (appMenu != null) {
    appMenu.config.widgets.push(inboxesMenu);
}
