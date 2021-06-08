import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Web3 from 'web3';
import abi from './Airdrop.json';

function App() {
  const [account, setAccount] = useState(null);
  const [dispAccount, setDispAccount] = useState('Connect');
  const [airdropBalance, setAirdropBalance] = useState(0);
  let web3, airdrop;
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
    web3 = new Web3(provider);
    airdrop = new web3.eth.Contract(abi,'0xc1c412260c017c7da3dD3499e562447553f0a9b2');
    if (provider) {
      provider
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          let acc = accounts[0];
          console.log(acc);
          if (acc) {
            setAccount(acc);
            setDispAccount(acc.substring(0, 5) + '...' + acc.substring(acc.length-3, acc.length));
            airdrop.methods.getBalance().call()
            .then((balance) => {
              setAirdropBalance(balance);
            })
          } else {
            //walletConnect();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      //walletConnect();
    }
  };

  $(function() {
    init();
  });

  return (
    <div className="App">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">HOTPOT COIN</a>
          <button type="button"
            className={account ? 'btn btn-success' : 'btn btn-warning'}>{dispAccount}</button>
        </div>
      </nav>
      <div className={ `alert' + ${ account ? 'alert alert-success' : 'alert alert-info' }`} role="alert">
        { account ? 'Connection established.' : 'Waiting for connection...' }
      </div>
      <div className="alert alert-info" role="alert">
        Remaining airdrop balance is<br/>{airdropBalance ? Web3.utils.fromWei(airdropBalance) + ' HOTPOT': '?'}
      </div>
    </div>);
}

export default App;
