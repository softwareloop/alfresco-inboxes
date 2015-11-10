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
var indexGroup;
var indexGroup2;
var indexUser;
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
			enabledGroup: String(group.@enabledGroup),//attribute to manage group visibility 
 			enabledUser: String(group.@enabledUser),//attribute to manage user visibility
            widgets: []
        }
    };


      var actionUrl =  "/api/people/"+user.name+"?groups=true";
	  
	  var json = remote.call(actionUrl);

	  if (json.status == 200)   {

         var proprieta = eval('(' + json + ')');
 	     var gruppi = proprieta.groups;
						 
					 
		//groups list, with separator ',' 
		var gruppoAbil = groupWidget.config.enabledGroup;
		//users list, with separator ',' 
		var uteAbil = groupWidget.config.enabledUser;
		var found = false;
		if(!gruppoAbil && !uteAbil){//if groups and users not present everyone can see all menu items
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
		else{ //presence of users or groups
			if(gruppoAbil){//groups
				var gruppiAbil = gruppoAbil.split(",");
				for(indexGroup2 in gruppiAbil){
					var g2 = gruppiAbil[indexGroup2];
					for (indexGroup in gruppi) {//read logged user groups
						var g = gruppi[indexGroup].itemName;
						if(groupWidget.config.enabledGroup && g==g2){
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
							found = true;
							break;
						}
					}
					if(found) break;
				}
			}
			if(!found && uteAbil){//users (and not yet visibile)
				var utentiAbil = groupWidget.config.enabledUser.split(",");
				for(indexUser in utentiAbil){
					var u = utentiAbil[indexUser];
					if(u == user.name){
						found = true;
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
					if(found) break;
				}
			}
		 }
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
                        name: "alfresco/html/Spacer",
                        config: {
                            height: "14px"
                        }
                    },
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
