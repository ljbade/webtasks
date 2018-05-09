var request = require('request');

module.exports = function(context, callback) {
var iftttEventName = 'pagerduty_incident';
var iftttKey = context.secrets.iftttKey;
var iftttUrl = 'https://maker.ifttt.com/trigger/' + iftttEventName + '/with/key/' + iftttKey;
  
  var triggerIFTTT = function (callback, value1, value2, value3) {
  var payload = { value1, value2, value3 };
  var options = {
      url: iftttUrl,
      method: 'POST',
      body: payload,
      json: true
    };
  
    request(options, function (error, response, body) {
      if (error) {
        console.log('IFTTT trigger error', error);
        return;
      }
  
      if (response.statusCode != 200) {
        console.log('IFTTT HTTP error', response.statusCode);
        console.log(body);
        return;
      }
  
      console.log('IFTTT triggered successfully');
      console.log(body);
    });
  }
  
  var process = function (message) {
    console.log('Processing message of event type', message.event);
    
    switch (message.event) {
    case 'incident.trigger':
      console.log('Triggered incident');
      
      if (!message.incident) {
        console.log('Missing incident field');
        return;
      }
  
      var incident = message.incident;
      console.log(incident.summary);
      
      if (assignments.find(x => x.email === 'leith@swift-nav.com')) {
        triggerIFTTT(incident.summary, incident.html_url);
      }
      break;
  
    default:
      console.log('Unrecognised message type', message.type);
    }
  }

  if (!context.body || !context.body.messages) {
    return callback('Missing messages field');
  }
  
  var messages = context.body.messages;

  for (var i = 0; i < messages.length; i++) {
    process(messages[i]);
  }

  callback(null, 'Processed successfully');
};
