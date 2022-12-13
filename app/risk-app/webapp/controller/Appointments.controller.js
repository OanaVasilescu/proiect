sap.ui.define([
    "riskapp/controller/BaseController", "sap/ui/model/json/JSONModel", "riskapp/utils/URLs",

], function (BaseController, JSONModel, URLs) {
    "use strict";

    return BaseController.extend("riskapp.controller.Appointments", {
        onInit() {
            this.getRouter().getRoute("RouteOverview").attachPatternMatched(this.initPage, this);
            this.getView().setModel(new JSONModel(), "appointmentsModel");
            let oModel = new JSONModel();
            oModel.setData({enableAppointmentsDragAndDrop: true, enableAppointmentsResize: true, enableAppointmentsCreate: true});
            this.getView().setModel(oModel, "settings");
        },

        initPage: async function () {
            await this.getAppointments();
        },

        getAppointments: async function () {
            await this.get(URLs.getAppointmentsUrl()).then(async (data) => {
                await this.getView().getModel("appointmentsModel").setData(data);
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get appointment error");
            });
        },

        handleAppointmentDrop: function (oEvent) {
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
                oModel.getData().appointments.push(oNewAppointment);
                oModel.updateBindings();
            } else {
                oAppointment.setStartDate(oStartDate);
                oAppointment.setEndDate(oEndDate);
            }

            MessageToast.show("Appointment with title \n'" + sAppointmentTitle + "'\n has been " + (
            bCopy ? "create" : "moved"
        ));
        },


        handleAppointmentCreateDnD: function (oEvent) {
            var oStartDate = oEvent.getParameter("startDate"),
                oEndDate = oEvent.getParameter("endDate"),
                sAppointmentTitle = "New Appointment",
                oModel = this.getView().getModel(),
                oNewAppointment = {
                    title: sAppointmentTitle,
                    startDate: oStartDate,
                    endDate: oEndDate
                };

            oModel.getData().appointments.push(oNewAppointment);
            oModel.updateBindings();

            MessageToast.show("Appointment with title \n'" + sAppointmentTitle + "'\n has been created");
        },

        handleViewChange: function () {
            this.messageHandler("'viewChange' event fired.");
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

            if (! oAppointment.getSelected() && this._pDetailsPopover) {
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
                this._pDetailsPopover = Fragment.load({id: oView.getId(), name: "sap.m.sample.SinglePlanningCalendar.Details", controller: this}).then(function (oResponsivePopover) {
                    oView.addDependent(oResponsivePopover);
                    return oResponsivePopover;
                });
            }
            this._pDetailsPopover.then(function (oResponsivePopover) {
                oResponsivePopover.setBindingContext(oAppointment.getBindingContext());
                oResponsivePopover.openBy(oAppointment);
            });
        },

        handleMoreLinkPress: function (oEvent) {
            var oDate = oEvent.getParameter("date"),
                oSinglePlanningCalendar = this.getView().byId("SPC1");

            oSinglePlanningCalendar.setSelectedView(oSinglePlanningCalendar.getViews()[2]); // DayView

            this.getView().getModel().setData({
                startDate: oDate
            }, true);
        },

        handleEditButton: function () { // The sap.m.Popover has to be closed before the sap.m.Dialog gets opened
            var oDetailsPopover = this.byId("detailsPopover");
            oDetailsPopover.close();
            this.sPath = oDetailsPopover.getBindingContext().getPath();
            this._arrangeDialogFragment("Edit appointment");
        },

        handlePopoverDeleteButton: function () {
            var oModel = this.getView().getModel(),
                oAppointments = oModel.getData().appointments,
                oDetailsPopover = this.byId("detailsPopover"),
                oAppointment = oDetailsPopover._getBindingContext().getObject();

            oDetailsPopover.close();

            oAppointments.splice(oAppointments.indexOf(oAppointment), 1);
            oModel.updateBindings();
        }


    });
});
