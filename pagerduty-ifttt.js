const request = require('request');

const iftttEventName = 'pagerduty_incident';
const iftttKey = context.secrets.iftttKey'b7SDUGu-stlD6XAE7UFFpL';
const iftttUrl = 'https://maker.ifttt.com/trigger/' +
  + iftttEventName + '/with/key/' + iftttKey;

function triggerIFTTT(callback, value1, value2, value3) {
  const payload = { value1, value2, value3 };
  const options = {
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

    if (response != 200) {
      console.log('IFTTT HTTP error', response, body);
      return;
    }

    console.log('IFTTT triggered successfully', body);
  });
}

function process(message) {
  console.log('Processing message', message);

  if (!message.data) {
    console.log('Missing data field');
    return;
  }

  switch (message.type) {
  case 'incident.trigger':
    triggerIFTTT(message.data.html_url);
    break;

  default:
    console.log('Unrecognised message type', message.type);
  }
}

module.exports = function(context, cb) {
  if (!messages) {
    return callback('Missing messages field');
  }

  for (let i = 0; i < messages.length) {
    process(messages[i]);
  }

  callback(null, 'Processed successfully');
};
