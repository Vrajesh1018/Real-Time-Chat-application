
// For getting current time and date
const moment = require("moment");


function formatMessage(username,text){

    return {
        username,
        text,
        time : moment().format("h:mm a") // return hour and minute with am or pm
    }
}


module.exports = formatMessage;