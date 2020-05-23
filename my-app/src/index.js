import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

//child
function Square(props) {
  return (

        //on click, Square's onClick is called, which was
        //specified as a prop by Board's onClick. props sends it up the chain to Board
        //don't need "this" since it's a class
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//parent
class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square

        //props sends it up the chain to Game to handle
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

    //store game state in parent (Game). Have Game
    //pass information down to child (Game), then down to
    //Game's child (Square)
  constructor(props) {
    super(props);
    this.state = {

      //Game as access to game history
      //history is an array of game boards
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true, //first move: X
    };
  }

  //means to handle the onClick
  //use "handle" to handle "on" events 
  handleClick(i) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1); //duplicate state of history
    const current = history[history.length - 1];

    //call slice to copy the squares array to keep IMMUTABILITY of old state
    //we can time travel to let us go back to previous moves
    //we have a record of changes that are made
    //our components are pure / frozen in time
    const squares = current.squares.slice();

    //return if someone's already won or square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'; //if x is next, then play X
    this.setState({
        history: history.concat([{
        squares: squares, //concatenate new game board entries into history
      }]),

      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, //set opposite boolean state
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step, //update step number
      xIsNext: (step % 2) === 0, //let X be next if step is even
    });
  }


  render() {

    //use current iteration of Board in history to determine winner
    const history = this.state.history;
    const current = history[this.state.stepNumber]; //let current be current move of step number

    //calculate the winner 
    const winner = calculateWinner(current.squares);

    //mapping the history of the game
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        //use move as key to differentiate them from one another
        //typically, keys are used to maintain state between re-renders
        //so pick a key that identifies that particular state
        //move is a good key in this case. since after a move is made, it's set in stone
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {

      //calculate who has next turn
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
