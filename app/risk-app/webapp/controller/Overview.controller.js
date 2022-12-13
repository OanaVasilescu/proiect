sap.ui.define(["riskapp/controller/BaseController"], function (BaseController) {
    "use strict";

    return BaseController.extend("riskapp.controller.Overview", {
        onInit() {},
        onItemSelect: function (oEvent) {
            let oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        }
    });
});
