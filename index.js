const Web3 = require('web3')
const net = require('net')
const gpio = require('rpi-gpio')
const fs = require('fs')

const DEFAULT_PIN = 7

const config = {
  'pin': DEFAULT_PIN,
  'network': 'development',
  'abiPath': 'abi.json',
  'addressPath': 'address.json',
  'ipcPath': '/home/archie/.rinkeby/geth.ipc'
}

// read config

// setup
gpio.setup(config.pin, gpio.DIR_OUT)

let provider = null
if (config.network === 'rinkeby') {
  provider = new Web3.providers.IpcProvider(config.ipcPath, net)
} else {
  provider = new Web3.providers.HttpProvider('http://localhost:9545')
}
let web3 = new Web3(provider)

web3.eth.defaulAccount = web3.eth.accounts[0]

let abi = JSON.parse(fs.readFileSync(config.abiPath, 'UTF-8'))
let address = JSON.parse(fs.readFileSync(config.addressPath, 'UTF-8')).address

let Flipper = web3.eth.contract(abi)
let flipper = Flipper.at(address)

flipper.FlippedLight((err, result) => {
  if (err) {
    console.log('Failed fetching event')
  } else {
    console.log('Got result' + result)
  }
})
