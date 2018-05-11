var modem = require('./modem-commands').Modem()
//19200 // 115200
let modemOptions = {
  baudRate: 115200,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  xon: false,
  rtscts: false,
  xoff: false,
  xany: false,
  buffersize: 0,
  onNewMessage: true,
  onNewMessageIndicator: true
}

modem.listOpenPorts((err, result)=>{
  console.log(result)
})
var device = '/dev/tty.usbserial'
setInterval(() => {
  if (!modem.isOpened) {
    modem.open(device,modemOptions, (err,result) => {
      console.log(result)
    })
  } else {
    console.log(`Serial port ${modem.port.path} is open`)
  }
}, 6000)

modem.on('open', (data) => {
  console.log(data);
  modem.initializeModem((response) => {
    console.log(response)
  })

/// Change the Mode of the Modem to SMS or PDU (Callback, "SMS"|"PDU")
  modem.modemMode((response) => {
    console.log(response)
  }, "PDU")


});
//
//   modem.modemMode((response) => {
//     console.log(response)
//     console.log('SMS')
//
//
//   }, "PDU")
//
//   // modem.checkSIMMemory(function(response){
//   //   console.log(response)
//   // })
//   //
//   modem.deleteAllSimMessages(function(response){
//     console.log(response)
//   })
//
//   try{
//     modem.sendSMS("09498893309", "Zab", function(response){
//       console.log(response)
//     })
//   }catch(e){
//     console.log(e)
//   }
//
//

  // modem.sendSMS("09498893309", "Zab", function(response){
  //   console.log(response)
  // })
  // modem.checkSIMMemory(function(response){
  //   console.log(response)
  // })
  // //
  // modem.deleteAllSimMessages(function(response){
  //   console.log(response)
  // })

  // modem.checkSIMMemory(function(response){
  //   console.log(response)
  // })
  // //


  // try{
  //   modem.sendSMS("09498893309", "Zab", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  // try{
  //   modem.sendSMS("09498893308", "Zab", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }

  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }

  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  //
  // try{
  //   modem.sendSMS("09498893309", "Test Message Dimple", function(response){
  //     console.log(response)
  //   })
  // }catch(e){
  //   console.log(e)
  // }

// })
//
// modem.on('onSendingMessage', (data) => {
//   console.log('onSendingMessage')
//   console.log(data)
// })
// //
// modem.on('onMessageSent', (data) => {
//   console.log('onMessageSent')
//   console.log(data)
// })
//
// modem.on('onMessageSendingFailed', (data) => {
//   console.log('Fail')
//   console.log(data)
// })
//
// //
// modem.on('onNewMessage', (data) => {
//   console.log(data)
// })
// //
// modem.on('onNewMessageIndicator', (data) => {
//   console.log('onNewMessageIndicator')
//   console.log(data)
// })
//
// modem.on('onModemActivityStream', (data) => {
//   console.log(data)
// })

//
//dev/tty.usbserial
// let open_port = setInterval(() => {
//       m1.open((status) => {
//           if (status == true) {
//               console.log("Port is open")
//               // clearInterval(open_port)
//           } else {
//
//           }
//       })
//
// }, 3000)
//
// m1.eventEmitter.on('new message', (num, text) => {
//
// })
//

// let m1 = new modem.Modem("/dev/tty.usbserial")

// let modem = require("./modem/modem2.js")
// let m1 = new modem.Modem_text("/dev/tty.usbserial")
//
// let open_port = setInterval(() => {
//     m1.open((status) => {
//         if (status == true) {
//             // console.log("Port is open")
//             clearInterval(open_port)
//         } else {
//             // console.log("in else")
//             // console.log(status)
//         }
//     })
// }, 3000)
//
// m1.eventEmitter.on('new message', (num, text) => {
//     console.log("New message:")
//     console.log(num)
//     console.log(text)
//
//     // let msg = text.trim().split(/\s+/)
// if (msg.toUpperCase() == "HELLO") {
//     let reply = "Hi"
//     m1.sendMessage(num, reply, (err, res) => {
//         if (err) {
//             console.log(err)
//         } else {
//
//         }
//     })
// }
// })


// let modem = require('./modem/index.js').Modem()

// modem.getModem((modem) => {
//   console.log(modem)
// })
// modem.getModem()
// modem.on('modem:get-modem', function(modem) {
//   console.log(modem)
// })

// modem.getPorts((ports) => {
//   console.log(ports)
// })
// let modemOptions = {autoOpen: false, baudRate: 115200,  dataBits: 8,  parity: 'none',  stopBits: 1, flowControl: false, xon : false, rtscts:false, xoff:false, xany:false, buffersize:0}
// //
// modem.connectModem('/dev/tty.usbserial', modemOptions, (err, response) => {
//   if(err){
//     console.log(err)
//   }else{
//     console.log(response)
//   }
// })
