import React from 'react';
import './styles/App.css';
import ChessGame from "./Chess/ChessGame";

function App() {
  return (
    <div className="App">
		<header className="App-header">
			Chess App
		</header>
		<div className="App-body">
			<ChessGame />
		</div>
		<footer className="App-footer">
			Copyright Gordon Mason 2019
		</footer>
    </div>
  );
}

export default App;
