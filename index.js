const Web3 = require('web3')
const net = require('net')
const gpio = require('rpi-gpio')
const fs = require('fs')

const DEFAULT_PIN = 7

function readJSON (path, required = false) {
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'UTF-8'))
  }
  if (required) {
    console.error(`Error: file '${path}' doesn't exist`)
    process.exit(1)
  }
  return null
}

const loadedConfig = readJSON('config.json') || {}

const config = {
  pin: DEFAULT_PIN,
  network: 'development',
  abiPath: 'abi.json',
  addressPath: 'address.json',
  ipcPath: `${process.env.HOME}/.rinkeby/geth.ipc`,
  ...loadedConfig
}

// setup gpio
gpio.setup(config.pin, gpio.DIR_OUT)

// setup web3
let provider = null
if (config.network === 'rinkeby') {
  provider = new Web3.providers.IpcProvider(config.ipcPath, net)
} else {
  provider = new Web3.providers.HttpProvider('http://localhost:9545')
}
let web3 = new Web3(provider)

web3.eth.defaulAccount = web3.eth.accounts[0]

// setup contract
let abi = readJSON(config.abiPath, true)
let address = readJSON(config.addressPath, true).address

let Flipper = web3.eth.contract(abi)
let flipper = Flipper.at(address)

// listen for events
flipper.FlippedLight((err, result) => {
  if (err) {
    console.error('Failed fetching event')
  } else {
    console.log(result)
  }
})

console.log('Listening for events')
