sap.ui.define(["sap/ui/core/mvc/Controller"], function (BaseController) {
    "use strict";

    return BaseController.extend("riskapp.controller.Overview", {
        onInit() {},
        onItemSelect: function (oEvent) {
            let oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        }
    });
});
