sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/BusyDialog",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    Controller,
    JSONModel,
    MessageToast,
    MessageBox,
    BusyDialog,
    Filter,
    FilterOperator
  ) {
    "use strict";
 
    return Controller.extend("com.te.pollution.controller.approval", {
      onInit: function () {
        let approveDataModel = new JSONModel();
        this.getView().setModel(approveDataModel, "sheetdata");

        let oModel = this.getOwnerComponent().getModel("ZSM_APPROVAL_SRV");
        let apprDataArr = [];

        oModel.read("/ZSM_APPROVERSet", {
          success: function (oData) {
            oData.results.forEach((el) =>
              apprDataArr.push({
                Selected: false,
                Customernumber: el.Customernumber,
                Applevel: el.Applevel,
                Custacctgroup: el.Custacctgroup,
                Panno: el.Panno,
                Title: el.Title,
                Name: el.Name,
                Street: el.Street, 
                City: el.City,
                District: el.District,
                Region: el.Region,
                Postalcode: el.Postalcode,
                Country: el.Country,
                Language: el.Language,
                Searchterm1: el.Searchterm1,
                Companycode: el.Companycode,
                Reconcacct: el.Reconcacct,
                Salesorg: el.Salesorg,
                Distchannel: el.Distchannel,
                Division: el.Division,
                Currency: el.Currency,
                Pricingproc: el.Pricingproc,
                Shipcond: el.Shipcond,
                Custgroup: el.Custgroup,
                Salesdistrict: el.Salesdistrict,
                Salesoffice: el.Salesoffice,
                Pricegroup: el.Pricegroup,
                Incoterms: el.Incoterms,
                Incotermsloc: el.Incotermsloc,
                Paymentterms: el.Paymentterms,
                Timestamp: el.Timestamp,
                Apprid: el.Apprid,
                Status: el.Status,
                Remarks: el.Remarks,
              })
            );
            approveDataModel.setData(apprDataArr);
          },
          error: function () {
            MessageToast.show("Error fetching data.");
          },
        });
      },

      onFilterByStatus: function () {
        var oView = this.getView();
        var oTable = oView.byId("iTab");
        var oBinding = oTable.getBinding("rows");
        var aFilters = [];

        var sStatus = oView.byId("statusSelect").getSelectedKey();
        if (sStatus) {
          aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
        }

        var oDate = oView.byId("filterDate").getDateValue();
        if (oDate) {
          aFilters.push(new Filter("Date", FilterOperator.EQ, oDate));
        }
        oBinding.filter(aFilters);
        MessageToast.show("Filters applied");
      },
      onClearFilters: function () {
        var oView = this.getView();
        oView.byId("statusSelect").setSelectedKey("");
        oView.byId("filterDate").setDateValue(null);

        var oTable = oView.byId("iTab");
        var oBinding = oTable.getBinding("rows");
        oBinding.filter([]);

        MessageToast.show("Filters cleared");
      },
      onApproveSelected: function () {
        var oTable = this.getView().byId("iTab");
        var aSelectedIndices = oTable.getSelectedIndices();
        var aItems = oTable
          .getBinding("rows")
          .getContexts()
          .map((context) => context.getObject());
        var remarksProvided = true;
        var appLevelProvided = true; 
      
        aSelectedIndices.forEach(function (index) {
          var selectedItem = aItems[index];
          if (!selectedItem.Remarks || selectedItem.Remarks.trim() === "") {
            remarksProvided = false;
          }
          if (!selectedItem.Applevel || selectedItem.Applevel.trim() === "") {
            appLevelProvided = false;
          }
        });
      
        if (!remarksProvided) {
          MessageBox.error("Please enter remarks for all approved items.");
          return;
        }
      
        if (!appLevelProvided) {
          MessageBox.error("Please specify the approver level for all approved items.");
          return;
        }
      
        aSelectedIndices.forEach(function (index) {
          aItems[index].Status = "Approved";
        });
      
        aItems.forEach(function (item, index) {
          if (!aSelectedIndices.includes(index)) {
            item.Status = "Pending";
          }
        });
      
        this.getView().getModel("sheetdata").refresh(true);
      
        MessageToast.show("Selected items approved.");
      },
      ondownloadPDF: function () {
        if (typeof html2pdf !== "undefined") {
          console.log("html2pdf library loaded successfully.");
          var oView = this.getView();
          var oContent = oView.byId("iTab").$();
      
          var oOptions = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'Approval_Data.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
          };
      
          html2pdf().set(oOptions).from(oContent[0]).save();
        } else {
          console.error("html2pdf library is not loaded.");
        }
      },     
      
      onRejectSelected: function () {
        var oTable = this.getView().byId("iTab");
        var aSelectedIndices = oTable.getSelectedIndices();
        var aItems = oTable
          .getBinding("rows")
          .getContexts()
          .map((context) => context.getObject());
        var remarksProvided = true;
        aSelectedIndices.forEach(function (index) {
          var selectedItem = aItems[index];
          if (!selectedItem.Remarks || selectedItem.Remarks.trim() === "") {
            remarksProvided = false;
          }
        });
        if (!remarksProvided) {
          MessageBox.error("Please enter remarks for all rejected items.");
          return;
        }
        aSelectedIndices.forEach(function (index) {
          aItems[index].Status = "Rejected";
        });

        // Set status to 'Pending' for unselected items
        aItems.forEach(function (item, index) {com.te.pollution.controller.approvalcom.te.pollution.controller.approval
          if (!aSelectedIndices.includes(index)) {
            item.Status = "Pending"; // Update status to Pending for unselected items
          }
        });

        // Refresh the model to update the table
        this.getView().getModel("sheetdata").refresh(true);

        MessageToast.show("Selected items rejected.");
      },

      onSaveChanges: function () {
        var oModel = this.getOwnerComponent().getModel("ZSM_APPROVAL_SRV");
        var aUpdatedItems = []; // Array to hold updated items
        var oTable = this.getView().byId("iTab");
        var aRows = oTable
          .getBinding("rows")
          .getContexts()
          .map((context) => context.getObject());
        aRows.forEach(function (item) {
          if (item.Remarks || item.Status) {
            // Check if any editable fields are modified
            aUpdatedItems.push(item);
          }
        });

        // Assuming you're using batch processing for OData
        oModel.setUseBatch(true);

        aUpdatedItems.forEach(function (item) {
          oModel.update(
            "/ZSM_APPROVERSet('" + item.Customernumber + "')",
            item,
            {
              success: function () {
                MessageToast.show("Changes saved successfully.");
              },
              error: function () {
                MessageToast.show("Error saving changes.");
              },
            }
          );
        });
        oModel.setUseBatch(false);
      },
    });
  }
);
