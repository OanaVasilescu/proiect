sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "riskapp/utils/AjaxClient",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs",
    "sap/m/MessageToast",

], function (Controller, AjaxClient, JSONModel, URLs, MessageToast) {
    "use strict";
    return Controller.extend("riskapp.controller.BaseController", {
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        get: function (url, data) {
            var sUrl = this.createUrl(url);

            return AjaxClient.get(sUrl, data);
        },

        post: function (url, data) {
            var sUrl = this.createUrl(url);

            return AjaxClient.post(sUrl, data);
        },

        delete: function (url) {
            var sUrl = this.createUrl(url);

            return AjaxClient.delete(sUrl);
        },

        put: function (url, data) {
            var sUrl = this.createUrl(url);

            return AjaxClient.put(sUrl, data);
        },

        getInitials: function (name) {
            return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
        },

        createUrl: function (url) { // return this.getOwnerComponent().getManifestObject().resolveUri(url);
            return url;
        },

        messageHandler: function (messageName) {
            let msg = this.getView().getModel("i18n").getResourceBundle().getText(messageName);
            MessageToast.show(msg);
        },

        cutStringAfterChar: function (str, c) {
            let n = str.lastIndexOf(c);
            return str.substring(n + 1);
        },

        onInputChange: function (oEvent) { // function used to validate inputs on change (XML)
            let source = oEvent.getSource();
            let sValue;
            let sId = source.getId();
            let sourceId = sId.slice(sId.lastIndexOf("-") + 1);
            if (sourceId !== "eventType") {
                sValue = source.getValue();
            } else {
                sValue = "Not relevant";
            }
            let sValueState = "None";
            let bValid = this._validateInput(sValue, sId);
            let errorOrWarning = "Error";
            if (! bValid) {
                sValueState = errorOrWarning;
            }
            source.setValueState(sValueState);
        },

        _validateInput: function (sValue, sId) {
            let id = sId.slice(sId.lastIndexOf("-") + 1);
            if (sValue.trim() == "") { // if the field is empty, return false, else verify for each input type
                return false;
            }
            switch (id) {
                case "newRiskTitle":
                    return this._validateNotEmpty(sValue.trim());
                case "description":
                    return this._validateNotEmpty(sValue.trim());
                case "impactSummary":
                    return this._validateNotEmpty(sValue.trim());
                case "datePicker":
                    return this._validateNotEmpty(sValue.trim())
                case "eventType":
                    return this._validateSelect(sId);
                    // case "countriesAffected":
                    //     return this._validateSelect(sId);
                case "taskTypeSelect":
                    return this._validateSelect(sId);
                default:
                    return false;
            }
        },

        _validateNotEmpty: function (sValue) {
            if (sValue.length < 1) {
                return false;
            }
            return true;
        },

        _validateSelect: function (sId) {
            if (this.getView().byId(sId).getSelectedItem()) {
                return true;
            }
            return false;
        },

        validateInputOnSubmit: function (aInputs) { // validate inputs on pressing button
            let oView = this.getView();
            if (!Array.isArray(aInputs)) {
                let emptyArray = [];
                emptyArray.push(aInputs); // TODO: if it's not array, make it an array
                aInputs = emptyArray;
            }
            let bNoValidationError = true,
                bIsValid = true;
            for (const sId of aInputs) {
                if (sId !== "eventType") {
                    bIsValid = this._validateInput(oView.byId(sId).getValue(), sId);
                } else {
                    bIsValid = this._validateInput("Not relevant", sId); // select does not have getValue
                };
                bNoValidationError = bIsValid && bNoValidationError;
                let errorOrWarning = "Error";

                if (! bIsValid) 
                    oView.byId(sId).setValueState(errorOrWarning);
                 else {
                    oView.byId(sId).setValueState("None");
                }
            }
            if (bNoValidationError) {
                return true;
            } else {
                return false;
            }
        }
    });
});
