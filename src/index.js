import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
        <button
            className="square"
            onClick={() => props.onClick()} >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        return (
            <div>
                {[0, 1, 2].map((x) =>
                    <div key={x} className="board-row">
                        {[0, 1, 2].map((y) =>
                            <span key={y}>{this.renderSquare(x * 3 + y)}</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
                xMove: null,
                yMove: null
            }],
            historyStepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(
            0, this.state.historyStepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares,
                xMove: Math.ceil((i + 1) / 3),
                yMove: (i % 3) + 1,
            }]),
            xIsNext: !this.state.xIsNext,
            historyStepNumber: history.length,
        });
    }

    jumpTo(historyStep) {
        this.setState({
            historyStepNumber: historyStep,
            xIsNext: (historyStep % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.historyStepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((value, index) => {
            const desc = index ?
                `Go to move # ${index}` :
                'Go to game start';

            const location = index ?
                `location: (${value.xMove}, ${value.yMove})` :
                ''

            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>
                        {desc}
                    </button>
                    <div className="location">{location}</div>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${winner}`
        } else {
            status = `
                Next player: 
                ${this.state.xIsNext ? 'X' : 'O'}
            `;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>

                <div className="example">
                    <Example />
                </div>

            </div>
        );
    }
}

const calculateWinner = (squares) => {
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

function Example() {
    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} times`;
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
        </button>
        </div>
    );
}

// ========================================

ReactDOM.render(
    <Game />,
    // <h1>Hola</h1>,
    document.getElementById('root')
);
