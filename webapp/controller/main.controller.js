sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("com.te.pollution.controller.main", {
        onInit: function () {
            let tiles = [
              {
                title: 'Business Partner Creation',
                route: 'RouteView1',
              },
              {
                title: 'Approval Screen',
                route: 'approvalScreen',
              },
            ]
    
            let myTilesModel = new JSONModel(tiles)
            this.getView().setModel(myTilesModel, 'tiles')
          },
          press: function (sRoute) {
           this.getOwnerComponent().getRouter().navTo(sRoute)
          },   
	});
});