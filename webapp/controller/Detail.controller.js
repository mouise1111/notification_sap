sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	return Controller.extend("notification.controller.Detail", {
		onInit: function () {
			// var oModel = this.getView().getModel("oData"); is is the model

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function (oEvent) {
			var sId = oEvent.getParameter("arguments").MaintenanceNotification;

			var sPath = this.getView().getModel().createKey("ZC_NOTIFICATION", {
				MaintenanceNotification: sId
			});

			this.getView().bindElement("/" + sPath);
		}
	});
});