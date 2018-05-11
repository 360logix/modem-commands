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
