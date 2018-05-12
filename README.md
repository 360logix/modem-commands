# GSM Modem Commands (modem-commands)

## Description
> modem-commands allows you to use your GSM modems on node.  It supports the following
* Sending SMS messages
* Receiving SMS messages
* Message and Command Queue
* Check SIM Card
* Delete all messages in SIM memory

## Installation
```
$ npm install --save modem-comannds
```
## Setting Up

```
Accepts the following options:

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

let modem = require('modem-commands').Modem()

```
## List All Open Ports
```
modem.listOpenPorts((err, result)=>{
  console.log(result)
})

Output:
[ { comName: '/dev/tty.usbserial10',
    manufacturer: undefined,
    serialNumber: undefined,
    pnpId: undefined,
    locationId: undefined,
    vendorId: undefined,
    productId: undefined },
  { comName: '/dev/tty.usbserial',
    manufacturer: undefined,
    serialNumber: undefined,
    pnpId: undefined,
    locationId: undefined,
    vendorId: undefined,
    productId: undefined } ]

```
## Connect to GSM Modem
```

let device = '/dev/tty.usbserial'

modem.open(device,modemOptions, (err,result) => {
  console.log(result)
})

Output:
{ status: 'success',
  request: 'connectModem',
  data: {
    modem: '/dev/tty.usbserial',
    status: 'Online'
  }
}

///Initialize Modem by Sending an AT Command ///
modem.initializeModem((response) => {
  console.log(response)
})

output:
{ status: 'success',
  request: 'modemInitialized',
  data: 'Modem Successfully Initialized' }
```
## Change Modem Mode to SMS or PDU
```
  modem.modemMode((response) => {
    console.log(response)
  }, "PDU")

  output:
  { status: 'success',
  request: 'modemMode',
  data: 'PDU_Mode' }

  modem.modemMode((response) => {
    console.log(response)
  }, "SMS")

  output:
  { status: 'success',
  request: 'modemMode',
  data: 'SMS_Mode' }


```

## Events

```
modem.on('open', (data) => {
  console.log(data)
});

modem.on('onSendingMessage', (data) => {
  console.log(data)
})

modem.on('onMessageSent', (data) => {
  console.log(data)
})

modem.on('onMessageSendingFailed', (data) => {
  console.log(data)
})

modem.on('onNewMessage', (data) => {
  console.log(data)
})

modem.on('onNewMessageIndicator', (data) => {
  console.log(data)
})

modem.on('onModemActivityStream', (data) => {
  console.log(data)
})



```
