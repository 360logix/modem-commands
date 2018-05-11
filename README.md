# modem-commands

Very simple way to communicate with a GSM modem

## Getting Started

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

//LIST ALL OPEN PORTS//
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

//// Connect to the Modem ///////

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
