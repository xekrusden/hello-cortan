var express = require('express');
var builder = require('botbuilder');
var bodyParser = require("body-parser");
var nlu = require("./luis-nlu-https");

server = express();
server.use(bodyParser.json({type: "application/json"}));

server.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
  
var connector = new builder.ChatConnector({
    appId: "a11e37ee-4325-45eb-8118-cdfee365ee18",
    appPassword: "kdfUnrQiTw8yVuFeXgj7wtn"
});

var bot = new builder.UniversalBot(connector);

server.post('/cortana/botbuilder/progressive', connector.listen());

bot.dialog('/', function (session, results) {
    logMe(session, results);

    nlu.query(session.message.text)
        .then((intent) => {
            if (!intent) {
                if (isLaunch(session)) {
                    intent = 'LaunchIntent';
                }
            }

            if (intent === 'LaunchIntent') {
                session.say('Welcome!', '<speak>Welcome to Progressive!</speak>');
            } else if (intent === 'HomeTips') {
                session.say('Home Tips Audio Test', '<speak><audio src=\"https://s3.amazonaws.com/xapp-files/Alexa/Progressive/Progressive-Curb_Appeal_Intro-V2.mp3\" /> ' +
                    '<break time=\"0.2s\"/> <audio src=\"https://s3.amazonaws.com/xapp-files/Alexa/Progressive/Progressive-Curb_Appeal_Tip_1-V2.mp3\" /> ' +
                    '<break time=\"0.3s\"/> <audio src=\"https://s3.amazonaws.com/xapp-files/Alexa/Progressive/Progressive-Another_Tip.mp3\" /></speak>');
            } else if (intent === 'CarTips') {
                session.say('Car Tips', '<speak>Here you go! Car Tips!</speak>');
            } else if (intent === 'Help') {
                session.say('Help', '<speak>This is help!</speak>');
            } else {
                session.say('I did not catch that!', '<speak>Sorry! I did not catch that!</speak>');
            }

            session.conversationData.LASTINTENT = intent ? intent : 'Unknown';

            session.save();
            session.endDialog();
        })
        .catch((ex) => {
            console.error("There was a problem. I'm so scared.");
            console.error(ex, ex.stack || ex);

            session.say('Error!', '<speak>There was a problem. I am so scared.</speak>');
        });
});

function logMe(session, results) {
    if (results) {
        console.log('Results: ' + JSON.stringify(results));
    }
    console.log('Message: ' + JSON.stringify(session.message));
    console.log('ConversationData: ' + JSON.stringify(session.conversationData));
    console.log("");
}

function isLaunch(session) {
    if (!session || !session.message || !session.message.entities) return false;

    var entities = session.message.entities;

    for (i = 0; i < entities.length; i++) {
        if ("Microsoft.Launch" === entities[i].name) {
            return true;
        }
    }

    return false;
}

