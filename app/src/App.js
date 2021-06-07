import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  const [account, setAccount] = useState(null);
  const [dispAccount, setDispAccount] = useState('Connect');
  const init = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      console.log('Ethereum successfully detected!');
      const element = 'Metamask detected.';
      let acc = provider.selectedAddress;
      if (acc) {
        setAccount(acc);
        setDispAccount(acc.substring(0, 5) + '...' + acc.substring(acc.length-3, acc.length));
        //ReactDOM.render(element, document.getElementById('message'));
      }
    } else {
      console.log('Please install MetaMask!');
      const element = 'Please install MetaMask.';
      //ReactDOM.render(element, document.getElementById('message'));
    }
  };
  init();

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
    </div>);
}

export default App;
