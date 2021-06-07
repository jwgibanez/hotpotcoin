import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  const init = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      console.log('Ethereum successfully detected!')
      const element = 'Metamask detected.';
      ReactDOM.render(element, document.getElementById('message'));
    } else {
      console.log('Please install MetaMask!');
      const element = 'Please install MetaMask.';
      ReactDOM.render(element, document.getElementById('message'));
    }
  };
  init();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p id="message">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
