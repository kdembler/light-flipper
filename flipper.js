const Web3 = require('web3')
const gpio = require('rpi-gpio')
const fs = require('fs')

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

// setup config
const loadedConfig = readJSON('config.json') || {}

const config = {
  pin: 7,
  network: 'development',
  devPort: 9545,
  rpcAddress: 'localhost',
  contractInfoPath: 'contract.json',
  ...loadedConfig
}

// setup gpio
let gpioReady = false
gpio.setup(config.pin, gpio.DIR_HIGH, () => {
  gpioReady = true
})

// setup web3
let rpcPort = config.devPort
if (config.network === 'rinkeby') {
  rpcPort = 8545
}
const provider = new Web3.providers.HttpProvider(`http://${config.rpcAddress}:${rpcPort}`)
const web3 = new Web3(provider)

web3.eth.defaulAccount = web3.eth.accounts[0]

// setup contract
const contractInfo = readJSON(config.contractInfoPath)
const abi = contractInfo.abi
const address = contractInfo.address

const Flipper = web3.eth.contract(abi)
const flipper = Flipper.at(address)

// listen for events
flipper.FlippedLight((err, result) => {
  if (err) {
    console.error('Failed fetching event')
  } else {
    console.log('Flipping')
    if (gpioReady) {
      gpio.write(config.pin, !result.args.newState, err => {
        if (err) {
          console.error(`Error: couldn't write to GPIO pin`)
          process.exit(1)
        }
      })
    } else {
      console.error('Warning: got event, but GPIO not ready')
    }
  }
})

console.log('Listening for flips')
