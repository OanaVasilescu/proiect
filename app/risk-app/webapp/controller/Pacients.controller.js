sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/DateFormat",
    "sap/m/ToolbarSpacer",
    "sap/ui/thirdparty/jquery"
], function (BaseController, JSONModel, URLs, Filter, FilterOperator, DateFormat, ToolbarSpacer, jQuery) {
    "use strict";

    return BaseController.extend("riskapp.controller.Pacients", {
        onInit() {
            var oView = this.getView();
            this.getRouter().getRoute("RouteOverview").attachPatternMatched(this.initPage, this);

            this.getView().setModel(new JSONModel());
            oView.setModel(new JSONModel({globalFilter: "", availabilityFilterOn: false, cellFilterOn: false}), "ui");
        },

        initPage: async function () {
            await this.getPacients();
        },

        _filter: function () {
            var oFilter = null;

            if (this._oGlobalFilter && this._oPriceFilter) {
                oFilter = new Filter([
                    this._oGlobalFilter, this._oPriceFilter
                ], true);
            } else if (this._oGlobalFilter) {
                oFilter = this._oGlobalFilter;
            } else if (this._oPriceFilter) {
                oFilter = this._oPriceFilter;
            }

            this.byId("table").getBinding().filter(oFilter, "Application");
        },

        filterGlobally: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._oGlobalFilter = null;

            if (sQuery) {
                this._oGlobalFilter = new Filter([
                    new Filter("Name", FilterOperator.Contains, sQuery),
                    new Filter("Category", FilterOperator.Contains, sQuery)
                ], false);
            }

            this._filter();
        },
        filterPrice: function (oEvent) {
            var oColumn = oEvent.getParameter("column");
            if (oColumn != this.byId("price")) {
                return;
            }

            oEvent.preventDefault();

            var sValue = oEvent.getParameter("value");

            function clear() {
                this._oPriceFilter = null;
                oColumn.setFiltered(false);
                this._filter();
            }

            if (! sValue) {
                clear.apply(this);
                return;
            }

            var fValue = null;
            try {
                fValue = parseFloat(sValue, 10);
            } catch (e) { // nothing
            }

            if (!isNaN(fValue)) {
                this._oPriceFilter = new Filter("Price", FilterOperator.BT, fValue - 20, fValue + 20);
                oColumn.setFiltered(true);
                this._filter();
            } else {
                clear.apply(this);
            }
        },

        clearAllFilters: function (oEvent) {
            var oTable = this.byId("table");

            var oUiModel = this.getView().getModel("ui");
            oUiModel.setProperty("/globalFilter", "");
            oUiModel.setProperty("/availabilityFilterOn", false);

            this._oGlobalFilter = null;
            this._oPriceFilter = null;
            this._filter();

            var aColumns = oTable.getColumns();
            for (var i = 0; i < aColumns.length; i++) {
                oTable.filter(aColumns[i], null);
            }

            oTable.getBinding().sort(null);
            this._resetSortingState();
        },

        _resetSortingState: function () {
            var oTable = this.byId("table");
            var aColumns = oTable.getColumns();
            for (var i = 0; i < aColumns.length; i++) {
                aColumns[i].setSorted(false);
            }
        },

        toggleAvailabilityFilter: function (oEvent) {
            this.byId("availability").filter(oEvent.getParameter("pressed") ? "X" : "");
        },

        formatAvailableToObjectState: function (bAvailable) {
            return bAvailable ? "Success" : "Error";
        },

        validCNP: function (p_cnp) {
            var i = 0,
                year = 0,
                hashResult = 0,
                cnp = [],
                hashTable = [
                    2,
                    7,
                    9,
                    1,
                    4,
                    6,
                    3,
                    5,
                    8,
                    2,
                    7,
                    9
                ];
            if (p_cnp.length !== 13) {
                return false;
            }
            for (i = 0; i < 13; i++) {
                cnp[i] = parseInt(p_cnp.charAt(i), 10);
                if (isNaN(cnp[i])) {
                    return false;
                }
                if (i < 12) {
                    hashResult = hashResult + (cnp[i] * hashTable[i]);
                }
            }
            hashResult = hashResult % 11;
            if (hashResult === 10) {
                hashResult = 1;
            }
            year = (cnp[1] * 10) + cnp[2];
            switch (cnp[0]) {
                case 1:
                case 2:
                    {
                        year += 1900;
                    }
                    break;
                case 3:
                case 4:
                    {
                        year += 1800;
                    }
                    break;
                case 5:
                case 6:
                    {
                        year += 2000;
                    }
                    break;
                case 7:
                case 8:
                case 9:
                    {
                        year += 2000;
                        if (year > (parseInt(new Date().getYear(), 10) - 14)) {
                            year -= 100;
                        }
                    }
                    break;
                default:
                    {
                        return false;
                    }
            }
            if (year < 1800 || year > 2099) {
                return false;
            }
            return(cnp[12] === hashResult);
        },

        completePacient: function (pacient) {
            if (pacient.cnp) {
                const firstChar = pacient.cnp[0];
                switch (firstChar) {
                    case 1: pacient.sex = M;
                        break;
                    case 2: pacient.sex = F;
                        break;
                    case 5: pacient.sex = M;
                        break;
                    case 6: pacient.sex = F;
                        break;
                    case 7: pacient.sex = M;
                        break;
                    case 8: pacient.sex = F;
                        break;
                    default:
                        break;
                }
                let an = pacient.cnp.substring(1, 3);
                if (firstChar == 1 || firstChar == 2) {
                    an = 19 + an;
                }
                if (firstChar == 5 || firstChar == 6) {
                    an = 20 + an;
                }

                if (firstChar == 7 || firstChar == 8) {
                    an = 20 + an;
                }
                if (firstChar == 3 || firstChar == 4) {
                    an = 18 + an;
                }

                let luna = pacient.cnp.substring(3, 5);

                switch (luna) {
                    case '01': luna = 'Jan';
                        break;
                    case '02': luna = 'Feb';
                        break;
                    case '03': luna = 'Mar';
                        break;
                    case '04': luna = 'Apr';
                        break;
                    case '05': luna = 'May';
                        break;
                    case '06': luna = 'Jun';
                        break;
                    case '07': luna = 'Jul';
                        break;
                    case '08': luna = 'Aug';
                        break;
                    case '09': luna = 'Sep';
                        break;
                    case '10': luna = 'Oct';
                        break;
                    case '11': luna = 'Nov';
                        break;
                    case '12': luna = 'Dec';
                        break;
                    default:
                        break;
                }

                let zi = pacient.cnp.substring(5, 7);

                let total = zi + luna + an;

                pacient.dataNasterii = total;

                let varsta = new Date().getFullYear() - an;

                pacient.varsta = varsta;
                return pacient;
            } else {
                return pacient;
            }
        },

        getPacients: async function () {
            await this.get(URLs.getPacientsUrl()).then(async (data) => {
                let completedData,
                    completedDataArray = [];
                for (let pct of data.value) {
                    completedData = this.completePacient(pct);
                    completedDataArray.push(completedData);
                }
                await this.getView().getModel().setData(completedDataArray);
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get pacients error");
            });
        }
    });
});
