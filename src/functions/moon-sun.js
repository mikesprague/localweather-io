"use strict";

const request = require("request");
const rp = require("request-promise");
const bugsnag = require("bugsnag");

exports.handler = function(event, context, callback) {
  const lat = event.queryStringParameters.lat;
  const lng = event.queryStringParameters.lng;
  const tz = event.queryStringParameters.tz || "-4";
  if (!lat) {
    callback(null, {
      statusCode: 400,
      body: "Missing 'lat' parameter",
    });
  }
  if (!lng) {
    callback(null, {
      statusCode: 400,
      body: "Missing 'lng' parameter",
    });
  }
  const apiUrlToCall = `http://api.usno.navy.mil/rstt/oneday?date=today&id=LWio&tz=${tz}&coords=${lat},${lng}`;
  const rpOptions = {
    uri: apiUrlToCall,
    headers: {
        "User-Agent": "Request-Promise"
    },
    json: true
  };
  rp(rpOptions)
  .then(body => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
    });
  })
  .catch(err => {
    callback(bugsnag.notify(new Error(err)), {
      statusCode: 500,
      body: JSON.stringify(err),
    });
  });
};