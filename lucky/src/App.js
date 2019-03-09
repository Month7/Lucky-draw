import React, { Component } from 'react';
import logo from './logo.svg';
// import './App.css';
import backgroundImg from './imgs/background.jpg'
import Index from './pages/index';
import RootRouter from './router';

class App extends Component {
  render() {
    return (
      <RootRouter />
      // <div>
      //   <header className="App-header">
      //     {/* <img src={logo} className="App-logo" alt="logo" /> */}
      //     {/* <img src={backgroundImg} /> */}
         
      //   </header>
      // </div>
    );
  }
}

export default App;
