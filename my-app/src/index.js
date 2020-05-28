import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (

    // On click, Square's onClick is called, 
    // which was specified as a prop by Board's onClick. 
    // props sends it up the chain to Board. 
    // We don't need "this" since it's a class
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        // props sends it up the chain to Game to handle.
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  // Store game state in parent (Game). 
  // Have Game pass information down to child (Game), 
  // then down to Game's child (Square).
  constructor(props) {
    super(props);
    this.state = {
      // Game has access to game history.
      // History is an array of game boards.
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true, //First move is X
    };
  }

  // Means to handle the onClick.
  // Use "handle" to handle "on" events.
  handleClick(i) {
    // Duplicate state of history
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    // Call slice to copy the squares array to keep IMMUTABILITY of old state.
    // We can time travel to let us go back to previous moves.
    // We have a record of changes that are made.
    // Our components are pure / frozen in time.
    const squares = current.squares.slice();

    // Return if someone's already won or square is already filled.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // If X is next, then play X.
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // Concatenate new game board entries into history.
      history: history.concat([{
        squares: squares,
      }]),

      stepNumber: history.length,
      // Set the opposite boolean state for X.
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // Let X be next if step is even.
      xIsNext: (step % 2) === 0,
    });
  }


  render() {

    // Use current iteration of Board in history to determine winner.
    // Let current be current move of step number.
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Mapping the history of the game
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        // Use move as key to differentiate them from one another.
        // Typically, keys are used to maintain state between re-renders.
        // So, pick a key that identifies that particular state.
        // Move is a good key in this case. since after a move is made, it's set in stone
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      // Calculate who has next turn
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
