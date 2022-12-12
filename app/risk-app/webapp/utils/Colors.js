sap.ui.define([], function () {
    "use strict";
    const active_non = "rgb(251,176,176)";
    const active_isolated = "rgb(248,109,109)";
    const active_regional = "rgb(246,50,50)";

    const emerging_non = "rgb(255, 242, 225)";
    const emerging_isolated = "rgb(255,229,195)";
    const emerging_regional = "rgb(255,207,144)"

    const possible_non = "rgb(164, 178, 223)";
    const possible_isolated = "rgb(107,128,202)";
    const possible_regional = "rgb(61,86,171)"


    return {
        getActiveNonCritical: function () {
            return active_non;
        },
        getActiveIsolated: function () {
            return active_isolated
        },
        getActiveRegional: function () {
            return active_regional
        },
        getEmergingNonCritical: function () {
            return emerging_non
        },
        getEmergingIsolated: function () {
            return emerging_isolated
        },
        getEmergingRegional: function () {
            return emerging_regional
        },
        getPossibleNonCritical: function () {
            return possible_non
        },
        getPossibleIsolated: function () {
            return possible_isolated
        },
        getPossibleRegional: function () {
            return possible_regional
        }
    }
})
