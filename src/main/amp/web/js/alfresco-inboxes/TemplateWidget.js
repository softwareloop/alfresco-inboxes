define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "alfresco/core/Core",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/TemplateWidget.html"
    ],
    function (declare, WidgetBase, Core, TemplatedMixin, template) {
        return declare([WidgetBase, Core, TemplatedMixin], {
            templateString: template,
            i18nRequirements: [
                {i18nFile: "./i18n/TemplateWidget.properties"}
            ],
            cssRequirements: [
                {cssFile: "./css/TemplateWidget.css"}
            ],

            buildRendering: function () {
                this.greeting = this.message('hello-label');

                this.inherited(arguments);

            }
        });
    });