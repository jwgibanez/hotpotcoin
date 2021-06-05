const Hotpot = artifacts.require('../../contracts/Hotpot.sol');

contract('Hotpot', function (accounts) {
  let contract;
  let decimals;

  beforeEach(async () => {
    contract = await Hotpot.deployed();
  });

  it('can be deployed', async () => {
    const owner = await contract.owner.call();
    assert.equal(owner, accounts[0], "Owner doesn't match.");
  });

  it('has 18 decimals & initial 1e15 supply', async () => {
    const decimals = await contract.decimals.call();
    assert.equal(decimals, 18);
    const totalSupply = await contract.totalSupply.call();
    assert.equal(totalSupply, web3.utils.toWei("1000000000000000"));
  });

  it('can transfer tokens', async () => {
    const recipientInitBal = await contract.balanceOf(accounts[1]);
    assert.equal(recipientInitBal, 0);

    await contract.transfer(accounts[1], 1500, { from: accounts[0] });
    const recipientNewBal = await contract.balanceOf(accounts[1]);
    assert.equal(recipientNewBal, 1500);

    await contract.transfer(accounts[2], 500, { from: accounts[1] });
    const recipient2Bal = await contract.balanceOf(accounts[2]);
    assert.equal(recipient2Bal, 500);
  });

});
