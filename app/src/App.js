import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Web3 from 'web3';
import hotpotAbi from './Hotpot.json';
import airdropAbi from './Airdrop.json';

function App() {
  const [account, setAccount] = useState(null);
  const [dispAccount, setDispAccount] = useState('Connect');
  const [airdropBalance, setAirdropBalance] = useState(0);
  const [walletBalance, setWalletBalance] = useState('0');
  let web3, token, airdrop;
  const walletConnect = async() => {
    console.log('Checking wallet connect...');

    // Create a connector
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        //throw error;
        console.log('No MetaMask or WalletConnect found.');
        const element = 'Please install MetaMask.';
        return;
      }

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];

      if (accounts) {
        let acc = accounts[0];
        setAccount(acc);
        setDispAccount(acc.substring(0, 5) + '...' + acc.substring(acc.length-3, acc.length));
      }
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Delete connector
    });
  };

  const init = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      web3 = new Web3(provider);
      // token = new web3.eth.Contract(hotpotAbi,'0xD67b8B287aBDcb1F65b1477B5Fb3723a79710cE5');
      // airdrop = new web3.eth.Contract(airdropAbi,'0x74e039AD6AF2D375874e45Ac9E09840227b600d2');
      // test
      token = new web3.eth.Contract(hotpotAbi,'0x720f546e672c6B612aF334220d748478eD98361E');
      airdrop = new web3.eth.Contract(airdropAbi,'0xC995c46E77a7e4FB7622E10521E23b06d2dF2058');
      // Get account 0
      provider
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          let acc = accounts[0];
          if (acc) {
            setAccount(acc);
            setDispAccount(acc.substring(0, 5) + '...' + acc.substring(acc.length-3, acc.length));
            refresh(acc);
          } else {
            //walletConnect();
          }
          renderConnectionInfo();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      renderConnectionInfo();
    }
  };

  $(function() {
    init();
  });

  function refresh(account) {
    getAirdropBalance();
    getAmountHeldByAccount(account);
    checkIsClaimedBy(account);
  }

  function getAirdropBalance() {
    airdrop.methods.getBalance().call()
    .then((balance) => {
      setAirdropBalance(balance);
      renderAirdropInfo();
    });
  }

  function getAmountHeldByAccount(account) {
    // Get amount held by account
    token.methods.balanceOf(account).call()
    .then((balance) => {
      setWalletBalance(balance);
      renderWalletBalance();
    });
  }

  function checkIsClaimedBy(account) {
    // Check if address has received airdrop
    airdrop.methods.isClaimedBy(account).call()
    .then((claimed) => {
      renderClaimButton(claimed);
    })
  }

  function renderConnectionInfo() {
    ReactDOM.render(
      <div className={ `alert' + ${ account ? 'alert alert-success' : 'alert alert-secondary' }`} role="alert">
        { account ? 'Connection established.' : 'No connection established.' }
      </div>,
      document.getElementById('connection-info')
    );
  }

  function renderAirdropInfo() {
    ReactDOM.render(
      <div className="alert alert-info" role="alert">
        Remaining airdrop balance is<br/>{airdropBalance ? Web3.utils.fromWei(airdropBalance).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' HOTPOT.': '...'}
      </div>,
      document.getElementById('airdrop-info')
    );
  }

  function renderWalletBalance() {
    ReactDOM.render(
      <div className="alert alert-info" role="alert">
        Your wallet currently holds<br/>{Web3.utils.fromWei(walletBalance).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' HOTPOT.'}
      </div>,
      document.getElementById('wallet-info')
    );
  }

  function renderClaimButton(claimed) {
    ReactDOM.render(
      <div className="d-grid gap-2">
        <button type="button" className={'btn btn-lg ' + (claimed ? 'btn-secondary' : 'btn-primary') } disabled={claimed} onClick={claim}>
          {claimed ? 'Address has claimed airdrop.' : 'Claim 1,000,000 HOTPOT'}
        </button>
        <p><small>*Airdrop can only be claimed once per address.</small></p>
      </div>,
      document.getElementById('claim-info')
    );
  }

  function claim() {
    airdrop.methods.claim().send({from: account})
    .then(function (result) {
      alert('Airdrop claimed successfully.');
      refresh(account);
    }, function (error) {
      alert('Airdrop claim failed. Please check your transaction history.');
      refresh(account);
    });
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">HOTPOT COIN</a>
          <button type="button"
            className={account ? 'btn btn-success' : 'btn btn-warning'}>{dispAccount}</button>
        </div>
      </nav>
      <div id='connection-info'>
        <div className="alert alert-secondary" role="alert">
          Trying to establish connection...
        </div>
      </div>
      <div id='airdrop-info'/>
      <div id='wallet-info'/>
      <div id='claim-info'/>
    </div>);
}

export default App;
