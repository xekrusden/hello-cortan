var https = require('https');

var url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8db8e9d5-5b6f-43d7-8293-9bb26693803b?subscription-key=9f060b5692ab4929b84002fff1d81ea1&staging=true&verbose=true&timezoneOffset=-300"


function query(q) {
    return new Promise((resolve, reject) => {
        if (!q) {
            resolve(null);
            return;
        }

        
        https.get(url + '&q=' + q, function(response) {
            var finalData = "";

            response.on("data", function (data) {
                finalData += data.toString();
            });

            response.on("end", function() {
                //console.log(finalData.length);
                //console.log(finalData.toString());

                var response = JSON.parse(finalData);

                // printOnSuccess(response);

                if (response.topScoringIntent) {
                    resolve(response.topScoringIntent.intent);
                } else {
                    resolve(null);
                    
                }
            });
        });
    });
}

exports.query = query;

function printOnSuccess(response) {
    console.log("Query: " + response.query);
    console.log("Top Intent: " + response.topScoringIntent.intent);
    console.log("Entities:");

    for (var i = 1; i <= response.entities.length; i++) {
        console.log(i + "- " + response.entities[i-1].entity);
    }

    if (response.dialog) {
        console.log("Dialog Status: " + response.dialog.status);
        if(!response.dialog.isFinished()) {
            console.log("Dialog Parameter Name: " + response.dialog.parameterName);
            console.log("Dialog Prompt: " + response.dialog.prompt);
            
        }
    }
};
