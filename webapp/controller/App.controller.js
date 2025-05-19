sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
  ],
  (BaseController, MessageToast, Filter, FilterOperator, JSONModel) => {
    "use strict";

    return BaseController.extend("project8.controller.App", {
      onInit() {
        const oData = {
          isButtonVisible: false,
          buttonIcon: "sap-icon://edit",
          editable: false,
          users: [
            { hoten: "Nguyễn Văn A", diachi: "Hà Nội", sdt: "0901234567" },
            { hoten: "Trần Thị B", diachi: "Hồ Chí Minh", sdt: "0987654321" },
          ],
        };

        const oModel = new JSONModel(oData);

        this.getView().setModel(oModel);
      },
      onChange: function () {
        var oModel = this.getView().getModel();
        var editable = oModel.getProperty("/editable");

        if (editable) {
          oModel.setProperty("/editable", false);
          oModel.setProperty("/isButtonVisible", false);
          oModel.setProperty("/buttonIcon", "sap-icon://edit");
        } else {
          oModel.setProperty("/editable", true);
          oModel.setProperty("/isButtonVisible", true);
          oModel.setProperty("/buttonIcon", "sap-icon://display");
        }
      },

      onAdd: function () {
        const oModel = this.getView().getModel();
        const aUsers = oModel.getProperty("/users");
        console.log(oModel);
        aUsers.push({ hoten: "", diachi: "", sdt: "" });
        oModel.setProperty("/users", aUsers);
      },

      onSave: function () {
        MessageToast.show("Dữ liệu đã được lưu (tạm thời trong bộ nhớ).");
        // Nếu muốn lưu backend thì gọi AJAX hoặc OData update ở đây
      },

      onDelete: function () {
        const oTable = this.byId("userTable");
        const oSelectedItem = oTable.getSelectedItem();
        var aItems = oTable.getAggregation("items");
        var iIndex = aItems.indexOf(oSelectedItem);
        console.log("Index của dòng được chọn:", iIndex);
        if (iIndex === -1) {
          MessageToast.show("Vui lòng chọn dòng để xóa.");
          return;
        } else {
          const oModel = this.getView().getModel();
          const aUsers = oModel.getProperty("/users");
          aUsers.splice(iIndex, 1);
          oModel.setProperty("/users", aUsers);
          iIndex = null;
          MessageToast.show("Đã xóa dòng.");
        }
      },

      onFilterPosts: function (oEvent) {
        var sQuery = oEvent.getParameter("query");
        var aFilter = [];

        if (sQuery) {
          aFilter.push(new Filter("hoten", FilterOperator.Contains, sQuery));
        }

        var oTable = this.byId("userTable");
        var oBinding = oTable.getBinding("items");
        oBinding.filter(aFilter);
      },
    });
  }
);
