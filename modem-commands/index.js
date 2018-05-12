let SerialPort = require('serialport')
let pdu = require('pdu')
let EventEmitter = require('events').EventEmitter

const Modem = function() {

  let modem = new EventEmitter()
  let data = ''
  let resultData = {}
  let timeouts = {}

  modem.queue = []
  modem.partials = {}
  modem.isLocked = false
  modem.isOpened = false
  let returnResult = false
  modem.job_id = 1

  modem.close = function(callback) {
    if (callback == undefined) {
      return new Promise((resolve, reject) => {
        modem.close((error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })
    }
    modem.port.close(error => {
      if (error) {
        callback(error)
      } else {
        callback(null, {
          status: 'success',
          request: 'diconnectModem',
          data: {
            comName: modem.port.path,
            status: 'Offline'
          }
        })
      }
    })
  }

  modem.open = function(device, options, callback) {
    if (options) options['parser'] = SerialPort.parsers.raw
    modem.port = SerialPort(device, options, (error) => {
      let result = {status: 'success', request: 'connectModem', data: {modem: modem.port.path,status: 'Online'}}
      if (error) {
        callback(error)
      } else {
        modem.emit('open', result)
        callback(null, result)
      }
    })

    modem.port.on('open', function() {
      modem.isOpened = true
      modem.port.on('data', modem.dataReceived.bind(this))
    })

    modem.port.on('close', function() {
      modem.emit('close', {
        modem: modem.port.path
      })
      modem.isOpened = false
    })

    modem.port.on('error', function() {
      modem.emit('error', {
        modem: modem.port.path
      })
      modem.isOpened = false
    })
  }

  modem.dataReceived = function(buffer) {
    data += buffer.toString()
    let parts = data.split('\r\n')
    data = parts.pop()
    parts.forEach(function(part) {

      let newparts = []
      newparts = part.split('\r')
      newparts = part.split('\n')

      newparts.forEach(function(newpart) {
        console.log(newpart)
        let pduTest = /[0-9A-Fa-f]{6}/g



        if (newpart.substr(0, 6) == '+CMTI:') { // New Message Indicatpr with SIM Card ID, After Recieving Read The DMessage From the SIM Card
          newpart = newpart.split(',')
          modem.ReadSMSByID(newpart[1], function(res) {})
        }
        if (modem.queue.length) {
          if (modem.queue[0] && (modem.queue[0]['status'] == 'sendSMS')) { // If SMS is currently Sending Emit currently sending SMS
            modem.emit('onSendingMessage', {
              status: 'Sending SMS',
              request: 'sendingSMS',
              data: {
                messageId: modem.queue[0]['messageID'],
                message: modem.queue[0]['message'],
                recipient: modem.queue[0]['recipient'],
                response: 'Message Currently Sending'
              }
            })
            modem.queue[0]['status'] = 'Sending SMS'
          }
          if (modem.queue[0] && (modem.queue[0]['command'] == `AT+CPMS='SM'`)) { // Query SIM Card Space Available
            if (newpart.trim().substr(0, 6) === '+CPMS:') {
              modem.parseSIMCardResponse(newpart, function(result) {
                resultData = result
              })
            }
            if ((newpart == ">" || newpart == 'OK') && resultData) {
              returnResult = true
            }
          } else if (modem.queue[0] && (modem.queue[0]['command'] == 'AT+CMGD=1,4')) { // Delete All Data from SIM Card
            if (newpart == 'OK') {
              resultData = {
                status: 'success',
                request: 'deleteAllSimMessages',
                data: 'success'
              }
              returnResult = true
            }
          } else if (modem.queue[0] && (modem.queue[0]['command'] == 'ATZ')) { // Query Modem AT to initialize
            resultData = {
              status: 'success',
              request: 'modemInitialized',
              data: 'Modem Successfully Initialized'
            }
            if ((newpart == ">" || newpart =="> " || newpart == 'OK') && resultData) {
              returnResult = true
            }
          } else if (modem.queue[0] && (modem.queue[0]['command'] == 'AT+CMGF=0') || (modem.queue[0]['command'] == 'AT+CMGF=1')) { // PDU Mode for Modem .. Default PDU Mode to accomodate Long SMS
            if (modem.queue[0]['command'].substr(8, 8) == '0') {
              resultData = {
                status: 'success',
                request: 'modemMode',
                data: 'PDU_Mode'
              }
            } else if (modem.queue[0]['command'].substr(8, 8) == '1') {
              resultData = {
                status: 'success',
                request: 'modemMode',
                data: 'SMS_Mode'
              }
            }
            if ((newpart == ">" || newpart == 'OK') && resultData) {
              returnResult = true
            }
          } else if (modem.queue[0] && (modem.queue[0]['command'].substr(0, 7) == 'AT+CMGS=' || pduTest.test(modem.queue[0]['command']))) { // Sending of Message if with response ok.. Then Message was sent successfully.. If Error then Message Sending Failed
            resultData = {
              status: 'success',
              request: 'SendSMS',
              data: {
                messageId: modem.queue[0]['messageID'],
                message: modem.queue[0]['message'],
                recipient: modem.queue[0]['recipient'],
                response: 'Message Successfully Sent'
              }
            }
            if ((newpart == ">" || newpart == 'OK') && resultData) {
              console.log('callback')
              returnResult = true
            }else if(newpart=='ERROR'){
              resultData = {
                status: 'Fail',
                request: 'SendSMS',
                data: {
                  messageId: modem.queue[0]['messageID'],
                  message: modem.queue[0]['message'],
                  recipient: modem.queue[0]['recipient'],
                  response: 'Message Failed'
                }
              }
              returnResult = true

            }
          } else if (modem.queue[0] && (modem.queue[0]['command'].substr(0, 7) == 'AT+CMGR')) { // Get New Message From SIM Card
            let re = /[0-9A-Fa-f]{6}/g
            if (re.test(newpart)) {
              let newMessage = pdu.parse(newpart)
              resultData = {
                sender: newMessage.sender,
                timeSent: newMessage.time
              }
              modem.emit('onNewMessageIndicator', resultData)
              modem.emit('onNewMessage', newMessage)

            }
            re.lastIndex = 0 // be sure to reset the index after using .text()
            if ((newpart == ">" || newpart == 'OK') && resultData) {
              returnResult = true
            }
          }
          let callback;
          if (returnResult) { // Expected Result was ok or with error call back function that asked for the data or emit to listener, Execute next Command if any or Execute Next Command if TIME Out and modem did not respond
            returnResult = false
            if (modem.queue[0] && modem.queue[0]['callback']) {
              callback = modem.queue[0]['callback']

            } else {
              callback = null
            }

            modem.queue[0]['end_time'] = new Date()
            clearTimeout(timeouts[modem.queue[0].id])
            modem.release()

            if (callback) {
              callback(resultData)
            }
            resultData = null
            modem.executeNext()
          }
        }
      })
    })
  }

  modem.ReadSMSByID = function(id, callback) {
    modem.executeCommand(`AT+CMGR=${id}`, function(data) {}, true)
  }

  modem.checkSIMMemory = function(callback, priority) {
    if (priority == null) priority = false
    modem.executeCommand(`AT+CPMS='` + `SM'`, function(data) {
      callback(data)
    }, priority)
  }

  modem.initializeModem = function(callback, priority) {
    if (priority == null) priority = false
    // modem.executeCommand('ATZ', function(data) {
    //   callback(data)
    // }, false, 30000)
    modem.executeCommand('ATZ', function(data) {
      callback(data)
    }, false, 30000)


    // modem.executeCommand('AT+CFUN=0', function(data) {
    //   callback(data)
    // }, false, 5000)
    // modem.executeCommand('AT+CFUN=1', function(data) {
    //   callback(data)
    // }, false, 5000)
    // modem.executeCommand('AT+CFUN=1', function(data) {
    //   callback(data)
    // }, priority, 5000)
  }

  modem.modemMode = function(callback, priority, timeout, mode) {
    modemMode = '0'
    if (priority == null) priority = true
    if (timeout == 'PDU' || timeout == 'SMS') {
      mode == timeout
    }
    if (priority == 'PDU' || priority == 'SMS') {
      mode = priority
    }
    if (mode == 'PDU' || mode == 'SMS') {
      if (mode == 'PDU') {
        modemMode = '0'
      } else if (mode = 'SMS') {
        modemMode = '1'
      }
      modem.executeCommand(`AT+CMGF=${modemMode}`, function(data) {
        callback(data)
      }, false, 30000)
    } else {
      callback({
        status: 'Fail',
        request: 'modemMode',
        data: 'Modem Failed to Changed Mode'
      })
    }
  }

  modem.makeid = function(numOfCharacters) {
    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < numOfCharacters; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
  }

  modem.sendSMS = function(number, message, callback, priority) {
    try {
      if (number && message) {
        let messageID = modem.makeid(25)
        let pduMessage = pdu.generate({
          text: message,
          receiver: number,
          encoding: '16bit'
        })



        modem.executeCommand(`AT+CMGS=${(pduMessage.toString().length/2)-1}`, function(data) {}, false, 100);
        modem.executeCommand(`${pduMessage.toString()}`+'\x1a', function(data) {
          var channel = ''
          if(data.status == "Fail"){
            channel = 'onMessageSendingFailed'
          }else{
            channel = 'onMessageSent'
          }

          var result = {
            status: data.status,
            request: data.request,
            Data: {
              messageId: data.data.messageId,
              message: data.data.message,
              recipient: data.data.recipient,
              response: data.data.response
            }
          }
          modem.emit(channel, result)
          callback(result)
        }, false, 30000,messageID, message, number);
        //
        // modem.executeCommand(`AT+CMGS=${(pduMessage.toString().length/2)-1}\n${pduMessage.toString()}`+'\x1a', function(data) {
        //   var channel = ''
        //   if(data.status == "Fail"){
        //     channel = 'onMessageSendingFailed'
        //   }else{
        //     channel = 'onMessageSent'
        //   }
        //
        //   var result = {
        //     status: data.status,
        //     request: data.request,
        //     Data: {
        //       messageId: data.data.messageId,
        //       message: data.data.message,
        //       recipient: data.data.recipient,
        //       response: data.data.response
        //     }
        //   }
        //   modem.emit(channel, result)
        //   callback(result)
        // }, false, 30000,messageID, message, number);

        callback({
          status: 'Success',
          request: 'sendSMS',
          Data: {
            messageId: messageID,
            response: 'Successfully Sent to Message Queue'
          }
        })
      } else {
        callback({
          status: 'Error',
          request: 'sendSMS',
          error: 'Missing Arguments'
        })
      }
    } catch (error) {
      callback({
        status: 'Error',
        request: 'sendSMS',
        error: error
      })
    }
  }


  modem.deleteAllSimMessages = function(callback, priority, timeout) {
    if (priority == null) priority = false
    modem.executeCommand('AT+CMGD=1,4', function(data) {
      callback(data)
    }, priority, timeout)
  }

  modem.listOpenPorts = function(callback) {
    if (callback === undefined) {
      return new Promise((resolve, reject) => {
        modem.listOpenPorts((error, results) => {
          if (error) {
            resolve(error)
          } else {
            reject(results)
          }
        })
      })
    }
    SerialPort.list((error, results) => {
      if (error) {
        callback(error)
      } else {
        callback(null, results)
      }
    })
  }


  modem.release = function() {
    this.data = '' //Empty the result buffer.
    this.isLocked = false //release the modem for next command.
    this.queue.shift() //Remove current item from queue.
  }


  modem.executeCommand = function(command, c, priority, timeout, messageID, message, recipient) {
    if (!this.isOpened) {
      this.emit('close')
      return
    }

    let item = new EventEmitter()
    if (messageID) {
      item.messageID = messageID
      item.message = message
      item.recipient = recipient
      item.status = 'sendSMS'
    }
    item.command = command
    item.callback = c
    item.add_time = new Date()
    item.id = ++this.job_id
    item.timeout = timeout
    if (item.timeout == undefined) //Default timeout it 60 seconds. Send false to disable timeouts.
      item.timeout = 60000
    if (priority) {
      this.queue.unshift(item)
      if (this.queue.length > 1) {
        this.queue.splice(1, 0, item)
      } else {
        this.queue.unshift(item)
      }
      // this.queue.unshift(item)

    } else {
      this.queue.push(item)
    }

    this.emit('job', item)
    process.nextTick(this.executeNext.bind(this))
    return item
  }

  modem.executeNext = function() {
    if (!this.isOpened) {
      this.emit('close')
      return
    }
    //Someone else is running. Wait.
    if (this.isLocked)
      return

    let item = this.queue[0]

    if (!item) {
      this.emit('idle')
      return //Queue is empty.
    }

    this.data = ''
    this.isLocked = true

    item.execute_time = new Date()

    item.emit('start')

    if (item.timeout)
      timeouts[item.id] = setTimeout(function() {
        item.emit('timeout')
        this.release()
        this.executeNext()
      }.bind(this), item.timeout)
    modem.port.write(item['command'] + '\r')
  }

  /////////// Functions ////////////////////////////////
  modem.parseSIMCardResponse = function(newpart, callback) {
    let simCardCheck = {
      used: '',
      totalSpace: ''
    }
    newpart = (newpart.split(' '))
    newpart = (newpart[1].split(','))
    simCardCheck.used = newpart[0]
    simCardCheck.totalSpace = newpart[1]
    callback({
      status: 'success',
      request: 'checkSIMMemory',
      data: simCardCheck
    })
  }

  return modem
}

module.exports = {
  Modem
}
