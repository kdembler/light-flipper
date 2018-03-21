/* global artifacts */
const Flipper = artifacts.require('LightFlipper')
const fs = require('fs')

const contractFile = 'contract.json'

module.exports = deployer => {
  console.log('deploying')
  deployer.then(() => Flipper.new()).then(instance => {
    // write newly deployed contract's address and abi to file
    const contract = {address: instance.address, abi: instance.abi}
    fs.writeFileSync(contractFile, JSON.stringify(contract))
  })
}
