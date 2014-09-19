/**
 * @author Paolo Predonzani (http://softwareloop.com/)
 */

//<import resource="classpath:/alfresco/site-webscripts/org/alfresco/share/imports/share-header.lib.js">
//<import resource="classpath:/alfresco/site-webscripts/org/alfresco/share/imports/share-footer.lib.js">

// Get the initial header services and widgets...
//var services = getHeaderServices();
//var widgets = getHeaderModel("Alfresco inboxes");

var inboxSelection = {
    name: "alfresco/layout/VerticalWidgets",
    align: "sidebar",
    widthPx: 340,
    config: {
        widgets: [
            {
                name: "alfresco/layout/ClassicWindow",
                config: {
                    title: "My inbox"
                }
            },
            {
                name: "alfresco/layout/ClassicWindow",
                config: {
                    title: "My team"
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