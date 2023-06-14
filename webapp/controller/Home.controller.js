sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     */
    function (Controller, UIComponent, JSONModel, Filter, FilterOperator) {
        "use strict";

        var oModel;
        return Controller.extend("notification.controller.Home", {
            onInit: function () {
                sap.ui.core.BusyIndicator.show();
                // Create a new instance of the OData model
                var oModel = new sap.ui.model.odata.v2.ODataModel({
                    serviceUrl: "/sap/opu/odata/sap/ZUI_NOTIFICATION_V2/",
                    // Additional parameters and configurations if needed
                });

                // this.byId("busyIndicator").setVisible(true);
                // Set the model to your view
                this.getView().setModel(oModel, "Notifications");

                // Get the reference to the OData model
                var oModel = this.getView().getModel("Notifications");
                
                // Store the reference to the controller instance
                var that = this;

                //#region total notification

                // const totalNotifications = oModel.read("/ZC_NOTIFICATION/$count");

                oModel.read("/ZC_NOTIFICATION/$count", {
                    success: function(iCount) {
                      // Update the count property in your model
                      oModel.setProperty("/MaintenanceNotificationCount", iCount);
                      var totalNotifications = this.byId('totalNotifications')
                      totalNotifications.setText(iCount);
                    }.bind(this),
                    error: function(oError) {
                      // Handle error if necessary
                    }
                  });

                //#endregion

                //#region notification types card
                // Define an empty array for the notification types
                var notificationTypes = [];
                
                var list = this.byId("types");

                // Fetch the notification types from the backend
                oModel.read("/ZC_NOTIFICATION", {
                    urlParameters: {
                        "$select": "NotificationType"
                    },
                    success: function (oData, oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        var results = oData.results;
                        results.forEach(function (notification) {
                            notificationTypes.push(notification.NotificationType);
                        });

                        // Define an object to track the added notification types
                        var addedNotificationTypes = {};

                        notificationTypes.forEach(function (type) {
                            var oFilter = new sap.ui.model.Filter("NotificationType", sap.ui.model.FilterOperator.EQ, type);

                            oModel.read("/ZC_NOTIFICATION/$count", {
                                filters: [oFilter],
                                success: function (oData, oResponse) {
                                    var count = parseInt(oResponse.body);


                                    if (!addedNotificationTypes[type]) {
                                        var hbox = new sap.m.HBox();

                                        var vbox = new sap.m.VBox();

                                        hbox.addStyleClass("sapUiJustifyContentSpaceBetween");
                                        hbox.addStyleClass("sapUiAlignItemsCenter");

                                        vbox.addStyleClass("sapUiSmallMarginBegin");
                                        vbox.addStyleClass("sapUiSmallMarginTopBottom");

                                        var text = new sap.m.Text({
                                            text: "Total " + type + " notifications: " + count
                                        });

                                        vbox.addItem(text);

                                        hbox.addItem(vbox);
                                        // Add the notification type to the object to mark it as added
                                        addedNotificationTypes[type] = true;

                                        // Add the VBox as a new CustomListItem to the List
                                        list.addItem(new sap.m.CustomListItem({
                                            content: [hbox]
                                        }));
                                    }
                                }.bind(this),
                                error: function (oError) {
                                    console.log(oError);
                                }
                            });
                        });


                    },
                    error: function (oError) {
                        // Handle error
                        console.log(oError);
                    }
                });

                //#endregion
            
                var userBox = this.byId("usersBox");

                oModel.read("/ZC_NOTIFICATION", {
                    success: function(oData) {
                      // List of users
                      var aNotifications = oData.results;
                      var aUsers = [];
                      aNotifications.forEach(function(notification) {
                        if (aUsers.indexOf(notification.CreatedByUser) === -1) {
                          aUsers.push(notification.CreatedByUser);
                        }
                      });
            
                      var oNotificationsByUser = {};
                      aUsers.forEach(function(user) {
                        var aFilteredNotificationss = aNotifications.filter(function(notification) {
                          return notification.CreatedByUser === user;
                        });
                        oNotificationsByUser[user] = aFilteredNotificationss;
                      });
                      aUsers.forEach(function(user) {
                        var iNotificationsCount = oNotificationsByUser[user].length;
                        var sTitle = user + " : " + iNotificationsCount;
                        var oText = new sap.m.Text({ text: sTitle }); // Create a new Text control with the title
                        userBox.addItem(oText); // Add the Text control to the VBox
                      });
                      userBox.setModel(new JSONModel(oNotificationsByUser));
            
            
                    },
                    error: function(oError) {
                      // Handle error if necessary
                    }
                  
                  });
            },

            onPress: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("myRoute");
            },

            navigateToList: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainList")
            },


            onCreate: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo('Create');
            }
        });
    });