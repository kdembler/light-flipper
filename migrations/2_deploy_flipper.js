/* global artifacts */
const Flipper = artifacts.require('LightFlipper')
const fs = require('fs')

const addressFile = 'address.json'
const abiFile = 'abi.json'

module.exports = deployer => {
  console.log('deploying')
  deployer.then(() => Flipper.new()).then(instance => {
    // write newly deployed contract's address and abi to files
    fs.writeFileSync(addressFile, JSON.stringify({address: instance.address}))
    fs.writeFileSync(abiFile, JSON.stringify(instance.abi))
  })
}
