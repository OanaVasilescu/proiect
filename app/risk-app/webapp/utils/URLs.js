sap.ui.define([], function () {
    "use strict";
    const origin = "/app";
    const slash = "/";
    const Programare = "/Programare?&$expand=pacient";
    const pacients = "/Pacient?&$expand=fise";

    return {
        getAppointmentsUrl: function () {
            return origin + Programare;
        },
        getPacientsUrl: function () {
            return origin + pacients;
        },
        getPacientUrl: function () {
            return origin + '/Pacient';
        },
        getAlergeni: function () {
            return origin + '/Alergie';
        }
    }
})
