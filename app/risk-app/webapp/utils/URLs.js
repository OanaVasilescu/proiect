sap.ui.define([], function () {
    "use strict";
    const origin = "/catalog";
    const slash = "/";
    const events = "/Events";
    const status = "/EventStatus";
    const types = "/EventTypes";
    const impacts = "/EventImpact";
    const expandedEvents = "?&$expand=impact,type,status,country,city"

    return {
        getEventsUrl: function () {
            return origin + events;
        },
        getExpandedEventsUrl: function () {
            return origin + events + expandedEvents;
        },
        getExpandedEventUrl: function (id) {
            return origin + events + slash + id + expandedEvents;
        },
        getEventImpact: function () {
            return origin + events + expandedEvents;
        },
        getEventTypes: function () {
            return origin + events + expandedEvents;
        },
        getEventStatus: function () {
            return origin + events + expandedEvents;
        },
        getCitiesOfCountry: function (country_code) {
            return origin + slash + `getCitiesOfCountry(country_code='${country_code}')`
        }
    }
})
