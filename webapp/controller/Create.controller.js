sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, JSONModel, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("notification.controller.Create", {
        onInit: function () {
            const serviceURL = '/sap/opu/odata/sap/ZUI_NOTIFICATION_V2';
            const oModel = new sap.ui.model.odata.v2.ODataModel(serviceURL);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

            // Create a JSON model for the notification object
            const oNotificationModel = new JSONModel({
                NotificationText: "hi Ayoub",
                NotificationType: "S2"
            });

            // Set the notification model to the view
            this.getView().setModel(oNotificationModel, "notification");

            // Bind the form to the notification model
            this.getView().byId("form").bindElement({
                model: "notification",
                path: "/"
            });
        },

        onCreate: function () {
            // Create a JSON model for the notification object
            const oNotificationModel = new JSONModel({
                NotificationText: this.byId("input_text").getValue(),
                NotificationType: this.byId("input_type").getValue()
            });

            // Set the notification model to the view
            this.getView().setModel(oNotificationModel, "notification");
            const oModel = this.getView().getModel();
            // Get the notification object from the notification model
            const oNotification = this.getView().getModel("notification").getData();

            // Create the entry locally
            const oContext = oModel.createEntry("/ZC_NOTIFICATION", {
                properties: oNotification
            });

            const that = this;

            this.getView().setBindingContext(oContext);
            oModel.submitChanges({
                success: function (data) {
                    MessageToast.show("Notification created successfully");
                    // var oRouter = UIComponent.getRouterFor(this);
                    that.navBack();

                },
                error: function (response) {
                    MessageToast.show("Error occurred while creating the notification");
                }
            });
        },

        navBack: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
        
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainList", {}, true /*no history*/);
            }
        }

    });
});