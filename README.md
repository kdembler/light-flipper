# Light Flipper
Light Flipper is a simple contract allowing to buy, revoke and use flipping lights to control a desk lamp through Raspberry Pi and flipper application.

### Live contract
You can mess with my light on Rinkeby at
```
0x3167168DA658dfB094F37eC79aD699bA96fEEcE8
```
with abi
```
[ { "constant": true, "inputs": [], "name": "flipped", "outputs": [ { "name": "", "type": "bool", "value": true } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "flippingRights", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "controller", "outputs": [ { "name": "", "type": "address", "value": "0x40e5f1822864cbe233fb3286834d2b8f846fa5e9" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "who", "type": "address" } ], "name": "BoughtFlippingRights", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "who", "type": "address" } ], "name": "RevokedFlippingRights", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "who", "type": "address" }, { "indexed": false, "name": "newState", "type": "bool" } ], "name": "FlippedLight", "type": "event" }, { "constant": false, "inputs": [], "name": "buyFlippingRights", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "revokeFlippingRights", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "flip", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_state", "type": "uint8" } ], "name": "changeState", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_controller", "type": "address" } ], "name": "changeController", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "stealTheMoney", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]
```

![Example GIF](https://thumbs.gfycat.com/UnsteadyBowedHarvestmouse-size_restricted.gif)

## Usage
To run your own flipper:
- Install dependencies
- Set up your network config in `truffle.js`
- Run migrations with `truffle migrate` - this will create file `contract.json` making it possible for flipper application to interact with deployed contract
- Start flipper with `yarn run flipper` - note that accessing GPIO may require administrative privileges. If needed any configuration can be overriden by creating `config.json` file
