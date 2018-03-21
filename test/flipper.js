/* global artifacts assert contract it */
const Flipper = artifacts.require('LightFlipper')

contract('LightFlipper', accounts => {
  let controller = accounts[0]
  let buyer = accounts[1]

  async function shouldRevert (promise, message) {
    let gotErr = false
    try {
      await promise
    } catch (e) {
      assert.equal(e.message.includes('revert'), true, `Unexpected error message: ${e.message}`)
      gotErr = true
    }
    assert.equal(gotErr, true, message)
  }

  it('should create the contract', async () => {
    let flipper = await Flipper.new({from: controller})

    assert.equal(await flipper.controller(), controller)
  })

  it('should buy flipping rights', async () => {
    let flipper = await Flipper.new({from: controller})
    assert.equal(await flipper.flippingRights(buyer), false, 'Buyer had flipping rights before buying them')
    await flipper.buyFlippingRights({from: buyer, value: 0.5e18})
    assert.equal(await flipper.flippingRights(buyer), true, `Buyer didn't acquire buying rights`)
  })

  it('should not buy flipping rights with insufficient amount', async () => {
    let flipper = await Flipper.new({from: controller})

    await shouldRevert(flipper.buyFlippingRights({from: buyer, value: 0.49e18}), 'It was possible to buy flipping rights without sufficient funds')
  })

  it('should revoke flipping rights', async () => {
    let flipper = await Flipper.new({from: controller})

    await flipper.buyFlippingRights({from: buyer, value: 0.5e18})
    await flipper.revokeFlippingRights({from: buyer})

    assert.equal(await flipper.flippingRights(buyer), false, 'Buyer had flipping rights after revoking them')
  })

  it(`should withdraw user's funds`, async () => {
    let flipper = await Flipper.new({from: controller})

    await flipper.buyFlippingRights({from: buyer, value: 0.5e18})
    await flipper.revokeFlippingRights({from: buyer})

    try {
      await flipper.withdraw({from: buyer})
    } catch (e) {
      assert.fail(true, false, 'Withdrawal after revoking threw')
    }

    await shouldRevert(flipper.withdraw({from: buyer}), 'Second withdrawal in a row succeeded')
  })

  it('should flip when called by user with flipping rights', async () => {
    let flipper = await Flipper.new({from: controller})

    await flipper.buyFlippingRights({from: buyer, value: 0.5e18})

    assert.equal(await flipper.flipped(), false, 'Flipped was true before any flipping')
    await flipper.flip({from: buyer})
    assert.equal(await flipper.flipped(), true, 'Flipped was false after flipping')
  })

  it('should not flip when called by user without flipping rights', async () => {
    let flipper = await Flipper.new({from: controller})

    await shouldRevert(flipper.flip({from: buyer}), 'User without flipping riths was able to flip')
  })

  it('should restrict access to controller functions', async () => {
    let flipper = await Flipper.new({from: controller})

    await shouldRevert(flipper.changeState(0, {from: buyer}), 'User was able to change state')
    await shouldRevert(flipper.changeController(buyer, {from: buyer}), 'User was able to change controller')
    await shouldRevert(flipper.stealTheMoney({from: buyer}), 'User was able to scam everyone')
  })

  it(`should change the contract's state`, async () => {
    let flipper = await Flipper.new({from: controller})

    assert.equal((await flipper.state()).toNumber(), 0, 'Deployed contract not in active state')
    await flipper.changeState(1, {from: controller})
    assert.equal((await flipper.state()).toNumber(), 1, `State was not changed`)
  })

  it('should not flip when not in active state', async () => {
    let flipper = await Flipper.new({from: controller})

    await flipper.changeState(1, {from: controller})
    await flipper.buyFlippingRights({from: buyer, value: 0.5e18})

    await shouldRevert(flipper.flip({from: buyer}), 'User flipped when contract was in Paused state')
  })

  it('should not buy rights when in Inactive state', async () => {
    let flipper = await Flipper.new({from: controller})

    await flipper.changeState(2, {from: controller})
    await shouldRevert(flipper.buyFlippingRights({from: buyer, value: 0.5e18}), 'User was able to buy rights in Inactive state')
  })

  it('should change the controller', async () => {
    let flipper = await Flipper.new({from: controller})

    await flipper.changeController(buyer, {from: controller})

    assert.equal(await flipper.controller(), buyer, 'Controller was not changed')
  })
})
