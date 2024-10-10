/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/te/pollution/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.te.pollution.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            getExcelDataTemplate: function () {
                let excelDataTemplate = {
                        "bpsheetnav": {
                                "Customernumber": '',
                                "Custacctgroup": '',
                                "Panno": '',
                                "Title": '',
                                "Name": '',
                                "Street": '',
                                "City": '',
                                "District": '',
                                "Region": '',
                                "Postalcode": '',
                                "Country": '',
                                "Language": '',
                                "Searchterm1": '',
                                "Companycode": '',
                                "Reconcacct": '',
                                "Salesorg": '',
                                "Distchannel": '',
                                "Division": '',
                                "Currency": '',
                                "Pricingproc": '',
                                "Shipcond": '',
                                "Custgroup": '',
                                "Salesdistrict": '',
                                "Salesoffice": '',
                                "Pricegroup": '',
                                "Incoterms": '',
                                "Incotermsloc": '',
                                "Paymentterms": ''
                            },
                  }
                return structuredClone(excelDataTemplate);
            },
        });
    }
);