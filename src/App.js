import logo from './logo.svg';
import './App.css';
import BarChart from './BarChart';
import React, {Component} from 'react';

class App extends Component {
  state = {
    data: [12, 5, 6, 6, 9, 10],
    width: 500,
    height: 300,
    //id: root
  }
  render() {
    return (
      <div className="App">
        <BarChart data={this.state.data} width={this.state.width} height={this.state.height}/>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
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
        </header> */}
      </div>
    );
  }
}

export default App;
