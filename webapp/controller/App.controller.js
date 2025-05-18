sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (BaseController, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("project8.controller.App", {
      onInit() {
        const oData = {
          users: [
            { hoten: "Nguyễn Văn A", diachi: "Hà Nội", sdt: "0901234567" },
            { hoten: "Trần Thị B", diachi: "Hồ Chí Minh", sdt: "0987654321" },
          ],
        };

        const oModel = new sap.ui.model.json.JSONModel(oData);
        this.getView().setModel(oModel);
        // console.log("this", this);
      },

      onAdd: function () {
        const oModel = this.getView().getModel();
        const aUsers = oModel.getProperty("/users");
        console.log("this", aUsers);
        aUsers.push({ hoten: "", diachi: "", sdt: "" });
        oModel.setProperty("/users", aUsers);
      },

      onSave: function () {
        MessageToast.show("Dữ liệu đã được lưu (tạm thời trong bộ nhớ).");
        // Nếu muốn lưu backend thì gọi AJAX hoặc OData update ở đây
      },

      onDelete: function () {
        const oTable = this.byId("userTable");
        const iIndex = oTable.getSelectedItem();

        if (iIndex === null) {
          MessageToast.show("Vui lòng chọn dòng để xóa.");
          return;
        }
        console.log("thi err", iIndex);
        const oModel = this.getView().getModel();
        const aUsers = oModel.getProperty("/users");
        aUsers.splice(iIndex, 1);
        oModel.setProperty("/users", aUsers);
        MessageToast.show("Đã xóa dòng.");
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
