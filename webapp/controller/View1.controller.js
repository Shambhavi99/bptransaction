sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
    "com/te/pollution/model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
function (Controller, JSONModel, ChartFormatter, Format, formatter, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.te.pollution.controller.View1", {
        formatter: formatter,
        dataPath: "../../model/data.json",
        oVizFrame: null,

        onInit: function () {
            let oSheetModel = new JSONModel({
                data: [],
                validationErrors: []
            });
            this.getView().setModel(oSheetModel, "sheetdata");
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;

            var oVizFrame = (this.oVizFrame = this.getView().byId("idVizFrame"));
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        visible: true,
                    },
                },
                valueAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT,
                    },
                    title: {
                        visible: false,
                    },
                },
                categoryAxis: {
                    title: {
                        visible: false,
                    },
                },
            });
            var dataModel = new JSONModel(this.dataPath);
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
        },

       onFileChange: function (oEvent) {
            var file = oEvent.getParameter("files")[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: "binary",
                    cellDates: true,
                });

                var firstSheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[firstSheetName];
                var json = XLSX.utils.sheet_to_json(worksheet);

                // Ensure the data includes the correct columns
                var aHeaders = [
                    "Customernumber", "Custacctgroup", "Panno", "Title", "Name", "Street", "City", "District", 
                    "Region", "Postalcode", "Country", "Language", "Searchterm1", "Companycode", 
                    "Reconcacct", "Salesorg", "Distchannel", "Division", "Currency", "Pricingproc", 
                    "Shipcond", "Custgroup", "Salesdistrict", "Salesoffice", "Pricegroup", 
                    "Incoterms", "Incotermsloc", "Paymentterms"
                ];

                var jsonData = json.map(function (row) {
                    var mappedItem = {};
                    aHeaders.forEach(function (header) {
                        mappedItem[header] = row[header] || ""; // Set default empty string if data is missing
                    });

                    return mappedItem;
                }.bind(this));  // bind 'this' to use the controller's context

                console.table(jsonData);

                this.getView().getModel("sheetdata").setProperty("/data", jsonData);
            }.bind(this);

            reader.readAsBinaryString(file);
        },

        onSaveData: function () {
            var oModel = this.getView().getModel("sheetdata");
            var aData = oModel.getProperty("/data");
            aData.forEach(function (item) {
                item.City = String(item.City || ""); // Ensure string data type
                item.Companycode = String(item.Companycode || "");
                item.Country = String(item.Country || "");
                item.Currency = String(item.Currency || "");
                item.Custacctgroup = String(item.Custacctgroup || "");
                item.Custgroup = String(item.Custgroup || "");
                item.Customernumber = String(item.Customernumber || ""); 
                item.Distchannel = String(item.Distchannel || "");
                item.District = String(item.District || "");
                item.Division = String(item.Division || "");
                item.Incoterms = String(item.Incoterms || "");
                item.Incotermsloc = String(item.Incotermsloc || "");
                item.Language = String(item.Language || "");
                item.Name = String(item.Name || "");
                item.Panno = String(item.Panno || "");
                item.Paymentterms = String(item.Paymentterms || "");
                item.Postalcode = String(item.Postalcode || "");
                item.Pricegroup = String(item.Pricegroup || "");
                item.Pricingproc = String(item.Pricingproc || "");
                item.Reconcacct = String(item.Reconcacct || "");
                item.Region = String(item.Region || "");
                item.Salesdistrict = String(item.Salesdistrict || "");
                item.Salesoffice = String(item.Salesoffice || "");
                item.Salesorg = String(item.Salesorg || "");
                item.Searchterm1 = String(item.Searchterm1 || "");
                item.Shipcond = String(item.Shipcond || "");
                item.Street = String(item.Street || "");
                item.Title = String(item.Title || "");
            });
        
            var oODataModel = this.getView().getModel(); // Assuming the default model is your OData model
            var oPayload = {
                bpsheetnav: aData
            };
        
            oODataModel.create("/dummySet", oPayload, {
                success: function () {
                    MessageToast.show("Data saved successfully");
                },
                error: function (oError) {
                    var errorMsg = oError.message || "Unknown error occurred";
                    MessageBox.error("Error saving data: " + errorMsg);
                }
            });
        },
        
        onPressExportToExcel: function () {
            // Define the headers for the Excel file (only headers, no data)
            var aHeaders = [
                "Customernumber", "Custacctgroup", "Panno", "Title", "Name", "Street", "City", "District", 
                "Region", "Postalcode", "Country", "Language", "Searchterm1", "Companycode", 
                "Reconcacct", "Salesorg", "Distchannel", "Division", "Currency", "Pricingproc", 
                "Shipcond", "Custgroup", "Salesdistrict", "Salesoffice", "Pricegroup", 
                "Incoterms", "Incotermsloc", "Paymentterms"
            ];
        
            // Create an empty array as no data is needed
            var aEmptyData = [];
        
            // Convert the empty data to a worksheet with headers
            var ws = XLSX.utils.json_to_sheet(aEmptyData, { header: aHeaders });
        
            // Create a new workbook and append the empty worksheet
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        
            // Generate the file and download it
            XLSX.writeFile(wb, "Template.xlsx");
        },       

        onShowHide: function () {
            // Get the reference to the FileUploader
            var oFileUploader = this.getView().byId("idFileUploader");

            // Toggle the visibility
            oFileUploader.setVisible(!oFileUploader.getVisible());
        },

        onNavigateToApproval: function () {
            this.getOwnerComponent().getRouter().navTo("approvalScreen");
        }
    });
});
