const AWS = require('aws-sdk');
var ecs = new AWS.ECS({ apiVersion: '2014-11-13' });

module.exports = { ecs };
