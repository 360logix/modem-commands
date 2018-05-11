var SerialPort = require('serialport');
var pdu = require('pdu');
var sp = require('serialport');
var EventEmitter = require('events').EventEmitter;

var modem = new EventEmitter();
var data = "";
var resultData = {};
var timeouts = {};
var modem = new EventEmitter();

const Modem = function() {
  var modem = new EventEmitter();
  var data = "";
  var resultData = {};
  var timeouts = {};
  var returnResult = false;

  modem.queue = [];
  modem.partials = {};
  modem.isLocked = false;
  modem.isOpened = false;
  modem.job_id = 1;

  modem.listOpenPorts = function(callback) {
    SerialPort.list(function (err, results) {
      callback(err,results)
    })
  }

  // modem.test = function(){
  //   return 'test'
  // }

  return modem;
}

module.exports = {
  Modem
}
