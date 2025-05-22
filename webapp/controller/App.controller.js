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
            {
              // icon: "sap-icon://sys-enter-2",
              hotel: "Nguyễn Văn A",
              diachi: "Hà Nội",
              sdt: "0901234567",
              selected: false,
            },
            {
              // icon: "sap-icon://sys-enter-2",
              hoten: "Trần Thị B",
              diachi: "Hồ Chí Minh",
              sdt: "0987654321",
              selected: false,
            },
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
        const oModel = this.getView().getModel();
        let aUsers = oModel.getProperty("/users");

        // Giữ lại các dòng chưa chọn
        aUsers = aUsers.filter((user) => !user.selected);

        oModel.setProperty("/users", aUsers);
        this.byId("selectAllCheckbox").setSelected(false); // reset checkbox tổng
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

      onSelectAll: function (oEvent) {
        var bSelected = oEvent.getParameter("selected"); // true nếu được chọn
        var oModel = this.getView().getModel();
        var aData = oModel.getProperty("/users"); // Đường dẫn đến mảng dữ liệu

        // Cập nhật trạng thái selected cho từng dòng
        aData.forEach(function (oItem) {
          oItem.selected = bSelected;
        });

        oModel.setProperty("/Users", aData); // Cập nhật lại model
      },

      onSortAsc: function () {
        var oTable = this.byId("userTable");
        var oBinding = oTable.getBinding("items");
        var sSortField = this.byId("sortFieldSelect").getSelectedKey();

        if (sSortField) {
          var oSorter = new sap.ui.model.Sorter(sSortField, false); // false = ASC
          oBinding.sort(oSorter);
        }
      },

      onSortDesc: function () {
        var oTable = this.byId("userTable");
        var oBinding = oTable.getBinding("items");
        var sSortField = this.byId("sortFieldSelect").getSelectedKey();

        if (sSortField) {
          var oSorter = new sap.ui.model.Sorter(sSortField, true); // true = DESC
          oBinding.sort(oSorter);
        }
      },

      onDownload: function () {
        var aData = this.getView().getModel().getProperty("/users");

        if (typeof XLSX === "undefined") {
          sap.m.MessageToast.show(
            "Không thể tải thư viện XLSX. Kiểm tra kết nối hoặc file index.html."
          );
          console.error("XLSX is not defined");
          return;
        }

        var oWorksheet = XLSX.utils.json_to_sheet(aData);
        var oWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(oWorkbook, oWorksheet, "Users");

        XLSX.writeFile(oWorkbook, "DanhSachNguoiDung.xlsx");
      },
    });
  }
);
