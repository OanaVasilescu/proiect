sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat",
    "sap/ui/unified/library",
    "sap/ui/core/library",
], function (BaseController, JSONModel, URLs, Fragment, DateFormat, unifiedLibrary, coreLibrary) {
    "use strict";

    var ValueState = coreLibrary.ValueState;
    var CalendarDayType = unifiedLibrary.CalendarDayType;
    return BaseController.extend("riskapp.controller.Appointments", {
        onInit() {
            this.getRouter().getRoute("RouteOverview").attachPatternMatched(this.initPage, this);
            this.getView().setModel(new JSONModel());

            let oModel = new JSONModel();
            oModel.setData({ enableAppointmentsDragAndDrop: true, enableAppointmentsResize: true, enableAppointmentsCreate: true });
            this.getView().setModel(oModel, "settings");

            this.getView().setModel(new JSONModel(), "Pacients");

            oModel = new JSONModel();
            oModel.setData({ allDay: false });
            this.getView().setModel(oModel, "allDay");

            let supportedAppointmentItems = [
                {
                    text: "Consultation",
                    type: CalendarDayType.Type01
                },
                {
                    text: "Examination",
                    type: CalendarDayType.Type05
                },
                {
                    text: "Personal",
                    type: CalendarDayType.Type08
                },
                {
                    text: "Out of office",
                    type: CalendarDayType.Type09
                }, {
                    text: "Lunch break",
                    type: CalendarDayType.Type14
                }
            ]

            oModel = new JSONModel();
            oModel.setData({ supportedAppointmentItems: supportedAppointmentItems });
            this.getView().setModel(oModel, "supportedAppointmentItems");

            this.getView().setModel(new JSONModel({ allDay: false }), "visibilityModel");
        },

        initPage: async function () {
            await this.getAppointments();
            await this.getPacients();
        },

        handleDateTimePickerChange: function (oEvent) {
            var oDateTimePickerStart = this.byId("DTPStartDate"),
                oDateTimePickerEnd = this.byId("DTPEndDate"),
                oStartDate = oDateTimePickerStart.getDateValue(),
                oEndDate = oDateTimePickerEnd.getDateValue(),
                oErrorState = {
                    errorState: false,
                    errorMessage: ""
                };

            if (!oStartDate) {
                oErrorState.errorState = true;
                oErrorState.errorMessage = "Please pick a date";
                this._setDateValueState(oDateTimePickerStart, oErrorState);
            } else if (!oEndDate) {
                oErrorState.errorState = true;
                oErrorState.errorMessage = "Please pick a date";
                this._setDateValueState(oDateTimePickerEnd, oErrorState);
            } else if (!oEvent.getParameter("valid")) {
                oErrorState.errorState = true;
                oErrorState.errorMessage = "Invalid date";
                if (oEvent.getSource() === oDateTimePickerStart) {
                    this._setDateValueState(oDateTimePickerStart, oErrorState);
                } else {
                    this._setDateValueState(oDateTimePickerEnd, oErrorState);
                }
            } else if (oStartDate && oEndDate && (oEndDate.getTime() <= oStartDate.getTime())) {
                oErrorState.errorState = true;
                oErrorState.errorMessage = "Start date should be before End date";
                this._setDateValueState(oDateTimePickerStart, oErrorState);
                this._setDateValueState(oDateTimePickerEnd, oErrorState);
            } else {
                this._setDateValueState(oDateTimePickerStart, oErrorState);
                this._setDateValueState(oDateTimePickerEnd, oErrorState);
            }

            this.updateButtonEnabledState(oDateTimePickerStart, oDateTimePickerEnd, this.byId("modifyDialog").getBeginButton());
        },

        handleDatePickerChange: function () {
            var oDatePickerStart = this.byId("DPStartDate"),
                oDatePickerEnd = this.byId("DPEndDate"),
                oStartDate = oDatePickerStart.getDateValue(),
                oEndDate = oDatePickerEnd.getDateValue(),
                bEndDateBiggerThanStartDate = oEndDate.getTime() < oStartDate.getTime(),
                oErrorState = {
                    errorState: false,
                    errorMessage: ""
                };

            if (oStartDate && oEndDate && bEndDateBiggerThanStartDate) {
                oErrorState.errorState = true;
                oErrorState.errorMessage = "Start date should be before End date";
            }
            this._setDateValueState(oDatePickerStart, oErrorState);
            this._setDateValueState(oDatePickerEnd, oErrorState);
            this.updateButtonEnabledState(oDatePickerStart, oDatePickerEnd, this.byId("modifyDialog").getBeginButton());
        },

        handleAppointmentDrop: async function (oEvent) {
            var oAppointment = oEvent.getParameter("appointment"),
                oStartDate = oEvent.getParameter("startDate"),
                oEndDate = oEvent.getParameter("endDate"),
                bCopy = oEvent.getParameter("copy"),
                sAppointmentTitle = oAppointment.getTitle(),
                oModel = this.getView().getModel(),
                oNewAppointment;

            if (bCopy) {
                oNewAppointment = {
                    title: sAppointmentTitle,
                    icon: oAppointment.getIcon(),
                    text: oAppointment.getText(),
                    type: oAppointment.getType(),
                    startDate: oStartDate,
                    endDate: oEndDate
                };

                // oModel.getData().push(oNewAppointment);
                // oModel.updateBindings();
                await this.post("/app/Programare", oNewAppointment).then(async (data) => {
                    this.getAppointments()
                    this.messageHandler("Appointment with title \n'" + sAppointmentTitle + "'\n has been created");
                }).catch((err) => {
                    this.messageHandler("uploadRiskEventError");
                    return "error";
                });
            } else {
                oAppointment.setStartDate(oStartDate);
                oAppointment.setEndDate(oEndDate);
            }

            this.messageHandler("Appointment with title \n'" + sAppointmentTitle + "'\n has been " + (
                bCopy ? "create" : "moved"
            ));
        },

        handleAppointmentResize: async function (oEvent) {
            var oAppointment = oEvent.getParameter("appointment"),
                oStartDate = oEvent.getParameter("startDate"),
                oEndDate = oEvent.getParameter("endDate"),
                sAppointmentTitle = oAppointment.getTitle();

            oAppointment.setStartDate(oStartDate);
            oAppointment.setEndDate(oEndDate);

            this.prepareAppointment(oAppointment);
            await this.put("/app/Programare/" + oAppointment.ID, oAppointment).then(async (data) => {
                this.messageHandler("Appointment with title \n'" + sAppointmentTitle + "'\n has been resized");
                this.getAppointments();
            }).catch((err) => {
                this.messageHandler("error");
                return "error";
            });

        },


        handleAppointmentCreateDnD: async function (oEvent) {
            var oStartDate = oEvent.getParameter("startDate"),
                oEndDate = oEvent.getParameter("endDate"),
                sAppointmentTitle = "New Appointment",
                oNewAppointment = {
                    title: sAppointmentTitle,
                    startDate: oStartDate,
                    endDate: oEndDate
                };

            await this.post("/app/Programare", oNewAppointment).then(async (data) => {
                this.getAppointments()
                this.messageHandler("Appointment with title \n'" + sAppointmentTitle + "'\n has been created");
            }).catch((err) => {
                this.messageHandler("uploadRiskEventError");
                return "error";
            });
        },

        handleOpenLegend: function (oEvent) {
            var oSource = oEvent.getSource(),
                oView = this.getView();

            if (!this._pLegendPopover) {
                this._pLegendPopover = Fragment.load({ id: oView.getId(), name: "riskapp.view.fragments.Legend", controller: this }).then(function (oLegendPopover) {
                    oView.addDependent(oLegendPopover);
                    return oLegendPopover;
                });
            }

            this._pLegendPopover.then(function (oLegendPopover) {
                if (oLegendPopover.isOpen()) {
                    oLegendPopover.close();
                } else {
                    oLegendPopover.openBy(oSource);
                }
            });
        },

        handleViewChange: function () { // this.messageHandler("'viewChange' event fired.");
        },

        handleAppointmentSelect: function (oEvent) {
            var oAppointment = oEvent.getParameter("appointment"),
                oStartDate,
                oEndDate,
                oTrimmedStartDate,
                oTrimmedEndDate,
                bAllDate,
                oModel,
                oView = this.getView();

            if (oAppointment === undefined) {
                return;
            }

            oStartDate = oAppointment.getStartDate();
            oEndDate = oAppointment.getEndDate();
            oTrimmedStartDate = new Date(oStartDate);
            oTrimmedEndDate = new Date(oEndDate);
            bAllDate = false;
            oModel = this.getView().getModel("allDay");

            if (!oAppointment.getSelected() && this._pDetailsPopover) {
                this._pDetailsPopover.then(function (oResponsivePopover) {
                    oResponsivePopover.close();
                });
                return;
            }

            this._setHoursToZero(oTrimmedStartDate);
            this._setHoursToZero(oTrimmedEndDate);

            if (oStartDate.getTime() === oTrimmedStartDate.getTime() && oEndDate.getTime() === oTrimmedEndDate.getTime()) {
                bAllDate = true;
            }

            oModel.getData().allDay = bAllDate;
            oModel.updateBindings();

            if (!this._pDetailsPopover) {
                this._pDetailsPopover = Fragment.load({ id: oView.getId(), name: "riskapp.view.fragments.Details", controller: this }).then(function (oResponsivePopover) {
                    oView.addDependent(oResponsivePopover);
                    return oResponsivePopover;
                });
            }
            this._pDetailsPopover.then(function (oResponsivePopover) {
                oResponsivePopover.setBindingContext(oAppointment.getBindingContext());
                oResponsivePopover.openBy(oAppointment);
            });
        },

        _setDateValueState: function (oPicker, oErrorState) {
            if (oErrorState.errorState) {
                oPicker.setValueState(ValueState.Error);
                oPicker.setValueStateText(oErrorState.errorMessage);
            } else {
                oPicker.setValueState(ValueState.None);
            }
        },

        handleMoreLinkPress: function (oEvent) {
            var oDate = oEvent.getParameter("date"),
                oSinglePlanningCalendar = this.getView().byId("SPC1");

            oSinglePlanningCalendar.setSelectedView(oSinglePlanningCalendar.getViews()[2]); // DayView

            this.getView().getModel().setData({
                startDate: oDate
            }, true);
        },

        handleCheckBoxSelect: function (oEvent) {
            var bSelected = oEvent.getSource().getSelected(),
                sStartDatePickerID = bSelected ? "DTPStartDate" : "DPStartDate",
                sEndDatePickerID = bSelected ? "DTPEndDate" : "DPEndDate",
                oOldStartDate = this.byId(sStartDatePickerID).getDateValue(),
                oNewStartDate = new Date(oOldStartDate),
                oOldEndDate = this.byId(sEndDatePickerID).getDateValue(),
                oNewEndDate = new Date(oOldEndDate);

            if (!bSelected) {
                oNewStartDate.setHours(this._getDefaultAppointmentStartHour());
                oNewEndDate.setHours(this._getDefaultAppointmentEndHour());
            } else {
                this._setHoursToZero(oNewStartDate);
                this._setHoursToZero(oNewEndDate);
            } sStartDatePickerID = !bSelected ? "DTPStartDate" : "DPStartDate";
            sEndDatePickerID = !bSelected ? "DTPEndDate" : "DPEndDate";
            this.byId(sStartDatePickerID).setDateValue(oNewStartDate);
            this.byId(sEndDatePickerID).setDateValue(oNewEndDate);
        },

        _getDefaultAppointmentStartHour: function () {
            return 9;
        },

        _getDefaultAppointmentEndHour: function () {
            return 10;
        },

        _setHoursToZero: function (oDate) {
            oDate.setHours(0, 0, 0, 0);
        },

        formatDate: function (oDate) {
            if (oDate) {
                var iHours = oDate.getHours(),
                    iMinutes = oDate.getMinutes(),
                    iSeconds = oDate.getSeconds();

                if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
                    return DateFormat.getDateTimeInstance({ style: "medium" }).format(oDate);
                } else {
                    return DateFormat.getDateInstance({ style: "medium" }).format(oDate);
                }
            }
        },

        _typeFormatter: function (sType) {
            var sTypeText = "",
                aTypes = this.getView().getModel("supportedAppointmentItems").getData().supportedAppointmentItems;

            for (var i = 0; i < aTypes.length; i++) {
                if (aTypes[i].type === sType) {
                    sTypeText = aTypes[i].text;
                }
            }

            if (sTypeText !== "") {
                return sTypeText;
            } else {
                return sType;
            }
        },

        _arrangeDialogFragment: function (sTitle) {
            var oView = this.getView();

            if (!this._pNewAppointmentDialog) {
                this._pNewAppointmentDialog = Fragment.load({ id: oView.getId(), name: "riskapp.view.fragments.Modify", controller: this }).then(function (oNewAppointmentDialog) {
                    oView.addDependent(oNewAppointmentDialog);
                    return oNewAppointmentDialog;
                });
            }

            this._pNewAppointmentDialog.then(function (oNewAppointmentDialog) {
                this._arrangeDialog(sTitle, oNewAppointmentDialog);
            }.bind(this));
        },

        _arrangeDialog: function (sTitle, oNewAppointmentDialog) {
            this._setValuesToDialogContent(oNewAppointmentDialog);
            oNewAppointmentDialog.setTitle(sTitle);
            oNewAppointmentDialog.open();
        },


        handleEditButton: function () { // The sap.m.Popover has to be closed before the sap.m.Dialog gets opened
            var oDetailsPopover = this.byId("detailsPopover");
            oDetailsPopover.close();
            this.sPath = oDetailsPopover.getBindingContext().getPath();
            this._arrangeDialogFragment("Edit appointment");
        },

        _setValuesToDialogContent: function (oNewAppointmentDialog) {
            var oAllDayAppointment = this.byId("allDay"),
                sStartDatePickerID = oAllDayAppointment.getSelected() ? "DPStartDate" : "DTPStartDate",
                sEndDatePickerID = oAllDayAppointment.getSelected() ? "DPEndDate" : "DTPEndDate",
                oTitleControl = this.byId("appTitle"),
                oTextControl = this.byId("moreInfo"),
                oTypeControl = this.byId("appType"),
                oStartDateControl = this.byId(sStartDatePickerID),
                oEndDateControl = this.byId(sEndDatePickerID),
                oEmptyError = {
                    errorState: false,
                    errorMessage: ""
                },
                oContext,
                oContextObject,
                oSPCStartDate,
                sTitle,
                sText,
                oStartDate,
                oEndDate,
                sType;


            if (this.sPath) {
                oContext = this.byId("detailsPopover").getBindingContext();
                oContextObject = oContext.getObject();
                sTitle = oContextObject.title;
                sText = oContextObject.text;
                oStartDate = oContextObject.startDate;
                oEndDate = oContextObject.endDate;
                sType = oContextObject.type;
            } else {
                sTitle = "";
                sText = "";
                if (this._oChosenDayData) {
                    oStartDate = this._oChosenDayData.start;
                    oEndDate = this._oChosenDayData.end;

                    delete this._oChosenDayData;
                } else {
                    oSPCStartDate = this.getView().byId("SPC1").getStartDate();
                    oStartDate = new Date(oSPCStartDate);
                    oStartDate.setHours(this._getDefaultAppointmentStartHour());
                    oEndDate = new Date(oSPCStartDate);
                    oEndDate.setHours(this._getDefaultAppointmentEndHour());
                } oAllDayAppointment.setSelected(false);
                sType = "Type01";
            } oTitleControl.setValue(sTitle);
            oTextControl.setValue(sText);
            oStartDateControl.setDateValue(oStartDate);
            oEndDateControl.setDateValue(oEndDate);
            oTypeControl.setSelectedKey(sType);
            this._setDateValueState(oStartDateControl, oEmptyError);
            this._setDateValueState(oEndDateControl, oEmptyError);
            this.updateButtonEnabledState(oStartDateControl, oEndDateControl, oNewAppointmentDialog.getBeginButton());
        },


        handlePopoverDeleteButton: async function () {
            var oModel = this.getView().getModel(),
                oAppointments = oModel.getData(),
                oDetailsPopover = this.byId("detailsPopover"),
                oAppointment = oDetailsPopover._getBindingContext().getObject();

            oDetailsPopover.close();

            await this.delete("/app/Programare/" + oAppointment.ID).then(async (data) => {
                this.getAppointments()
            }).catch((err) => {
                this.messageHandler("error");
                return "error";
            })
        },

        updateButtonEnabledState: function (oDateTimePickerStart, oDateTimePickerEnd, oButton) {
            var bEnabled = oDateTimePickerStart.getValueState() !== ValueState.Error && oDateTimePickerStart.getValue() !== "" && oDateTimePickerEnd.getValue() !== "" && oDateTimePickerEnd.getValueState() !== ValueState.Error;

            oButton.setEnabled(bEnabled);
        },

        handleDialogCancelButton: function () {
            this.sPath = null;
            this.byId("pacientSelect").setSelectedItem(null)
            this.byId("modifyDialog").close();
        },


        handleDialogOkButton: async function () {
            var bAllDayAppointment = (this.byId("allDay")).getSelected(),
                sStartDate = bAllDayAppointment ? "DPStartDate" : "DTPStartDate",
                sEndDate = bAllDayAppointment ? "DPEndDate" : "DTPEndDate",
                sTitle = this.byId("appTitle").getValue(),
                sText = this.byId("moreInfo").getValue(),
                sType = this.byId("appType").getSelectedItem().getKey(),
                oStartDate = this.byId(sStartDate).getDateValue(),
                oEndDate = this.byId(sEndDate).getDateValue(),
                pacientSelected = this.byId("pacientSelect").getSelectedItem(),
                oModel = this.getView().getModel(),
                sAppointmentPath;
            let pacient_ID

            if (pacientSelected && (sType == CalendarDayType.Type01 || sType == CalendarDayType.Type05)) {
                pacient_ID = pacientSelected.getKey()
            } else {
                pacient_ID = null;
            }

            if (this.byId(sStartDate).getValueState() !== ValueState.Error && this.byId(sEndDate).getValueState() !== ValueState.Error) {

                if (this.sPath) {
                    sAppointmentPath = this.sPath;
                    oModel.setProperty(sAppointmentPath + "/title", sTitle);
                    oModel.setProperty(sAppointmentPath + "/text", sText);
                    oModel.setProperty(sAppointmentPath + "/type", sType);
                    oModel.setProperty(sAppointmentPath + "/startDate", oStartDate);
                    oModel.setProperty(sAppointmentPath + "/endDate", oEndDate);
                    oModel.setProperty(sAppointmentPath + "/pacient_ID", pacient_ID);

                    this.prepareAppointment(oModel.getProperty(sAppointmentPath));
                    await this.put("/app/Programare/" + oModel.getProperty(sAppointmentPath + "/ID"), oModel.getProperty(sAppointmentPath)).then(async (data) => { }).catch((err) => {
                        this.messageHandler("uploadRiskEventError");
                        return "error";
                    });
                } else {
                    let appt = {
                        title: sTitle,
                        text: sText,
                        type: sType,
                        startDate: oStartDate,
                        endDate: oEndDate,
                        pacient_ID: pacient_ID
                    };

                    await this.post("/app/Programare", appt).then(async (data) => {
                        oModel.getData().push({
                            title: sTitle,
                            text: sText,
                            type: sType,
                            startDate: oStartDate,
                            endDate: oEndDate,
                            pacient_ID: pacient_ID
                        });

                        // this.messageHandler("Appointment with title \n'" + sAppointmentTitle + "'\n has been created");
                    }).catch((err) => {
                        this.messageHandler("uploadRiskEventError");
                        return "error";
                    });
                }

                this.getAppointments();
                this.byId("pacientSelect").setSelectedItem(null)
                this.byId("modifyDialog").close();
            }
        },

        handleAppointmentCreate: function () {
            this._createInitialDialogValues(this.getView().byId("SPC1").getStartDate());
        },

        handleHeaderDateSelect: function (oEvent) {
            this._createInitialDialogValues(oEvent.getParameter("date"));
        },

        _createInitialDialogValues: function (oDate) {
            var oStartDate = new Date(oDate),
                oEndDate = new Date(oStartDate);

            oStartDate.setHours(this._getDefaultAppointmentStartHour());
            oEndDate.setHours(this._getDefaultAppointmentEndHour());
            this._oChosenDayData = {
                start: oStartDate,
                end: oEndDate
            };
            this.sPath = null;

            this._arrangeDialogFragment("Create appointment");
        },

        handleStartDateChange: function (oEvent) {
            var oStartDate = oEvent.getParameter("date");
            // this.messageHandler("'startDateChange' event fired.\n\nNew start date is " + oStartDate.toString());
        },

        getPacientSelectVisible: function () {
            let selection = this.getView().byId("appType").getSelectedItem().getKey()
            if (selection == 'Type05' || selection == 'Type01') {
                this.getView().getModel("visibilityModel").setProperty('/pacients', true);
            } else {
                this.getView().getModel("visibilityModel").setProperty('/pacients', false);
            }

            if (selection == 'Type14' || selection == 'Type01' || selection == 'Type05') {
                this.getView().getModel("visibilityModel").setProperty('/allDay', false);
            } else {
                this.getView().getModel("visibilityModel").setProperty('/allDay', true);
            }
        },

        goToPacient: function (event) {
            let path = event.getSource().getBindingContext().sPath
            let model = this.getView().getModel().getProperty(path);
            if (model.pacient_ID) {
                this.getRouter().navTo("Details", {
                    id: model.pacient_ID
                });
            }
        },

        prepareAppointment: function (model) {
            delete model.pacient;
        },

        getAppointments: async function () {
            await this.get(URLs.getAppointmentsUrl()).then(async (data) => {
                let dt = data.value.map(element => ({
                    ...element,
                    startDate: new Date(element.startDate),
                    endDate: new Date(element.endDate)
                }));
                await this.getView().getModel().setData(dt);
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get appointment error");
            });
        },

        getPacients: async function () {
            await this.get(URLs.getPacientsUrl()).then(async (data) => {
                await this.getView().getModel("Pacients").setData(data.value);
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get pacients error");
            });
        }
    });
});
