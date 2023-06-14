sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/UIComponent"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 * @param {typeof sap.ui.model.Filter} Filter
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
 * @param {typeof sap.ui.model.Sorter} Sorter
 * @param {typeof sap.ui.core.UIComponent} UIComponent
 */
function (Controller, Filter, FilterOperator, Sorter, UIComponent) {
    "use strict";

    return Controller.extend("notification.controller.MainList", {

        onInit: function () {
            this.bSortAscending = true;
        },

        onSearch: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getParameter("query");

            if (sQuery) {
                var oFilter1 = new Filter("NotificationText", FilterOperator.Contains, sQuery);
                var oFilter2 = new Filter("CreatedByUser", FilterOperator.Contains, sQuery);

                // Combine the filters using the "OR" operator
                var oCombinedFilter = new Filter({
                    filters: [oFilter1, oFilter2],
                    and: false // Set to false for "OR" operator
                });

                aFilters.push(oCombinedFilter);
            }

            var oTable = this.byId("NotifTable");
            var oBinding = oTable.getBinding("items");

            oBinding.filter(aFilters);

        },

        //this will open DETAIL PAGE
        onPressItem: function (oEvent) {
            var oItem = oEvent.getSource();
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Detail", {
                MaintenanceNotification: oItem.getBindingContext().getObject().MaintenanceNotification
            });
        },

       
        onCreate: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo('Create');
        }
    });
});