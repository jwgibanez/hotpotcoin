// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Address.sol";
import "./IBEP20.sol";
import "./Ownable.sol";

contract Airdrop is Ownable {
  mapping(address => bool) private _beneficiaries;

  uint256 private _claimAmount;
  address private _token;

  constructor(address token, uint256 claimAmount) {
    require(claimAmount > 0, 'claim amount must not be 0');
    _token = token;
    _claimAmount = claimAmount;
  }

  /**
   * @dev Returns claim amount
   */
  function getClaimAmount() external view returns (uint256) {
    return _claimAmount;
  }

  /**
   * @dev Set claim amount
   */
  function setClaimAmount(uint256 newClaimAmount) external onlyOwner returns (bool) {
    require(newClaimAmount > 0, 'new claim amount must not be 0');
    _claimAmount = newClaimAmount;
    return true;
  }

  /**
   * @dev Returns token address
   */
  function getToken() external view returns (address) {
    return _token;
  }

  /**
   * @dev This function allows owner to deposit to airdrop
   */
  function deposit(uint256 amount) external onlyOwner returns (bool) {
    require(amount > 0, 'amount must not be zero');
    return IBEP20(_token).transferFrom(msg.sender, address(this), amount);
  }

  /**
   * @dev This function withdraws the remaining balance back to the owner
   */
  function withdraw() external onlyOwner returns (bool) {
    IBEP20 bep20 = IBEP20(_token);
    uint256 balance = bep20.balanceOf(address(this));
    require(balance > 0, 'airdrop has no remaining balance');
    return bep20.transfer(owner(), balance);
  }

  /**
   * @dev Lets users claim airdrop
   */
  function claim() external returns (bool) {
    require(Address.isContract(msg.sender) == false, 'sender must not be a contract');
    IBEP20 bep20 = IBEP20(_token);
    uint256 balance = bep20.balanceOf(address(this));
    require(balance >= _claimAmount, 'airdrop has insufficient balance');
    require(_beneficiaries[msg.sender] == false, 'address already claimed airdrop');
    _beneficiaries[msg.sender] = true;
    bool success = bep20.transfer(msg.sender, _claimAmount);
    require(success, 'transfer failed');
    emit Claim(msg.sender, _claimAmount);
    return true;
  }

  /**
   * @dev Lets users gift airdrop to another non-contract address
   */
  function gift(address recipient) external returns (bool) {
    require(Address.isContract(msg.sender) == false, 'sender must not be a contract');
    require(Address.isContract(recipient) == false, 'recipient must not be a contract');
    IBEP20 bep20 = IBEP20(_token);
    uint256 balance = bep20.balanceOf(address(this));
    require(balance >= _claimAmount, 'airdrop has insufficient balance');
    require(_beneficiaries[recipient] == false, 'address already claimed airdrop');
    _beneficiaries[recipient] = true;
    bool success = bep20.transfer(recipient, _claimAmount);
    require(success, 'transfer failed');
    emit Gift(msg.sender, recipient, _claimAmount);
    return true;
  }

  function getBalance() external view returns (uint256) {
    return IBEP20(_token).balanceOf(address(this));
  }

  /**
   * @dev This function is called for all messages sent to
   * this contract (there is no other function).
   * Sending Ether to this contract will cause an exception,
   * because the fallback function does not have the `payable`
   * modifier.
   */
  fallback() external {
    revert();
  }

  /**
   * @dev Emitted when airdrop is succeesfully claimed.
   */
  event Claim(address indexed to, uint256 amount);

  /**
   * @dev Emitted when airdrop is succeesfully gifted.
   */
  event Gift(address indexed from, address indexed to, uint256 amount);
}
