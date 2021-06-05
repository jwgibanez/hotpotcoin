const Airdrop = artifacts.require('../../contracts/Airdrop.sol');
const IBEP20 = artifacts.require('../../contracts/IBEP20.sol');
const Hotpot = artifacts.require('../../contracts/Hotpot.sol');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

contract('Airdrop', function (accounts) {
  let token;
  let airdrop;

  const claimAmount = web3.utils.toWei("1000000000");

  beforeEach(async () => {
    token = await Hotpot.new();
    airdrop = await Airdrop.new(token.address, claimAmount);
  });

  it('can be deployed', async () => {
    assert.equal(await airdrop.owner.call(), accounts[0], "Owner doesn't match.");
    assert.equal(await airdrop.getToken(), token.address, "Token address doesn't match.");
    assert.equal(await airdrop.getClaimAmount(), claimAmount, "Claim amount doesn't match.");
  });

  it('can set claim amount', async () => {
    await airdrop.setClaimAmount(5e6);
    assert.equal(await airdrop.getClaimAmount(), 5e6, "Claim amount not updated");
    await expectRevert(
      airdrop.setClaimAmount(5e6, { from: accounts[1]}),
      'Ownable: caller is not the owner'
    );
  });

  it('can deposit & withdraw by owner', async () => {
    const originalOwnerBalance = await token.balanceOf(accounts[0]);
    const depositAmount = web3.utils.toWei("10000000000");
    assert.equal(await token.allowance(accounts[0], airdrop.address), 0, "Allowance is not zero");
    await expectRevert(
      airdrop.deposit(depositAmount),
      'BEP20: transfer amount exceeds allowance.'
    );
    await token.approve(airdrop.address, depositAmount);
    assert.equal(await token.allowance(accounts[0], airdrop.address), depositAmount, "Allowance is not ${depositAmount}");
    await airdrop.deposit(depositAmount);
    assert.equal(await token.balanceOf(airdrop.address), depositAmount, "Balance doesn't match");
    assert.equal(await airdrop.getBalance(), depositAmount, "Balance doesn't match");
    let b = await token.balanceOf(accounts[0]);
    assert.equal(b, originalOwnerBalance-depositAmount, "Owner balance was not deducted");
    await airdrop.withdraw();
    assert.equal(await token.balanceOf(airdrop.address), 0, "Balance is not zero");
    assert.equal(await airdrop.getBalance(), 0, "Balance is not zero");
    b = await token.balanceOf(accounts[0]);
    assert.equal(b.toString(), originalOwnerBalance.toString(), "Owner balance was not added");
    assert.equal(await token.allowance(accounts[0], airdrop.address), 0, "Allowance is not zero");
  });

  it('non-owner cannot withdraw', async () => {
    const depositAmount = web3.utils.toWei("10000000000");
    await token.approve(airdrop.address, depositAmount);
    assert.equal(await token.allowance(accounts[0], airdrop.address), depositAmount, "Allowance is not ${depositAmount}");
    await airdrop.deposit(depositAmount);
    assert.equal(await token.balanceOf(airdrop.address), depositAmount, "Balance doesn't match");
    assert.equal(await airdrop.getBalance(), depositAmount, "Balance doesn't match");
    await expectRevert(
      airdrop.withdraw({ from: accounts[1] }),
      'Ownable: caller is not the owner'
    );
  });

  it('can claim only once', async () => {
    await expectRevert(
      airdrop.claim(),
      'airdrop has insufficient balance'
    );
    const depositAmount = web3.utils.toWei("10000000000");
    await token.approve(airdrop.address, depositAmount);
    assert.equal(await token.allowance(accounts[0], airdrop.address), depositAmount, "Allowance is not ${depositAmount}");
    await airdrop.deposit(depositAmount);    assert.equal(await token.balanceOf(airdrop.address), depositAmount, "Balance doesn't match");
    assert.equal(await airdrop.getBalance(), depositAmount, "Balance doesn't match");
    const originalBalance = await token.balanceOf(accounts[1]);
    expectEvent(
      await airdrop.claim({ from: accounts[1] }),
      'Claim',
      {
        to: accounts[1],
        amount: claimAmount
      }
    );
    let b = await token.balanceOf(accounts[1]);
    assert.equal(b.toString(), web3.utils.toWei("1000000000"), "Claim failed");
    await expectRevert(
      airdrop.claim({ from: accounts[1] }),
      'address already claimed airdrop'
    );
  });

  it('can gift', async () => {
    await expectRevert(
      airdrop.gift(accounts[1]),
      'airdrop has insufficient balance'
    );
    const depositAmount = web3.utils.toWei("10000000000");
    await token.approve(airdrop.address, depositAmount);
    assert.equal(await token.allowance(accounts[0], airdrop.address), depositAmount, "Allowance is not ${depositAmount}");
    await airdrop.deposit(depositAmount);
    assert.equal(await token.balanceOf(airdrop.address), depositAmount, "Balance doesn't match");
    assert.equal(await airdrop.getBalance(), depositAmount, "Balance doesn't match");
    const originalBalance = await token.balanceOf(accounts[1]);
    expectEvent(
      await airdrop.gift(accounts[1]),
      'Gift',
      {
        from: accounts[0],
        to: accounts[1],
        amount: claimAmount
      }
    );
    let b = await token.balanceOf(accounts[1]);
    assert.equal(b.toString(), web3.utils.toWei("1000000000"), "Claim failed");
    await expectRevert(
      airdrop.gift(accounts[1]),
      'address already claimed airdrop'
    );
  });

});
