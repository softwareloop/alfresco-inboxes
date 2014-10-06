define([
    "dojo/date/locale"
], function (locale) {
    var datePattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";

    var formatOptions = {
        datePattern: datePattern,
        selector: "date"
    };

    return {
        formatDate: function (date) {
            var tmp = locale.format(date, formatOptions);
            var result = tmp.substring(0, 26) + ":" + tmp.substring(26);
            return result;
        },

        parseDate: function (stringValue) {
            return locale.parse(stringValue, formatOptions);
        }
    }
});