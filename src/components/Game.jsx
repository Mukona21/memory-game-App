import Board from "./Board";
import { useState, useEffect, useRef } from "react";

function Game(props) {
    let [iconArr, SetIconArr] = useState([[1, 2, 3, 4], [5, 6, 7, 8], [1, 2, 3, 4], [5, 6, 7, 8]]);
    let [time, setTime] = useState(0);
    let [move, setMove] = useState(0);
    let [score, setScore] = useState(0);
    let [flippedArr, setFlippedArr] = useState([]);
    let [won, setWon] = useState(false);

    let selectTwo = useRef('');

    let intervalID = useRef();
    let timeOutID = useRef();

    useEffect(() => {
        createRandom();

        return () => {
            clearInterval(intervalID.current);
        };
    }, [])

    function createRandom() {
        clearInterval(intervalID.current);
        intervalID.current = setInterval(function () {
            setTime((time) => time + 1);
        }, 1000)

        let iconsObj = {
            '1': 2,
            '2': 2,
            '3': 2,
            '4': 2,
            '5': 2,
            '6': 2,
            '7': 2,
            '8': 2,
        }
        let newArr = new Array(4).fill(0).map((elm) => new Array(4).fill(0));
        for (let i = 0; i < newArr.length; i++) {
            for (let j = 0; j < newArr[i].length; j++) {
                let randomNum = Math.ceil(Math.random() * 8);
                while (iconsObj[randomNum] <= 0) {
                    randomNum = Math.ceil(Math.random() * 8);
                }
                newArr[i][j] = randomNum;
                iconsObj[randomNum]--;
            }
        }
        SetIconArr(newArr);
        setTime(0);
        setMove(0);
        setScore(0);
        setWon(false);
        setFlippedArr([]);
        selectTwo.current = '';
    }

    function handleClick(id) {
        let row = Number(id[0]);
        let col = Number(id[2]);
        console.log([row, col]);
        if (selectTwo.current.length === 0) {
            selectTwo.current = (iconArr[row][col]).toString();
            setFlippedArr((arr) => arr.concat([id]));
            console.log(selectTwo);
        }
        else if (selectTwo.current.length === 1) {
            setMove((prev) => prev + 1);
            selectTwo.current += (iconArr[row][col]).toString();
            setFlippedArr((arr) => arr.concat([id]));
            console.log(selectTwo);

            timeOutID.current = setTimeout(function () {
                if (selectTwo.current[0] === selectTwo.current[1]) {
                    setScore((score) => score + 1);
                } else {
                    setFlippedArr((arr) => arr.slice(0, -2));
                }

                if (flippedArr.length >= 15) {
                    clearInterval(intervalID.current);
                    setWon(true);
                }
                selectTwo.current = '';
            }, 700)
        }
    }

    return (
        <div className="container">
            <p className="heading">Memory Game</p>
            <div className="stats">
                <p className="time">Time: <b>{time}</b>s</p>
                <p className="moves"><b>{move}</b> Moves</p>
                <p className="score">Score: <b>{score}</b></p>
                <button onClick={createRandom} className="restart">Restart</button>
            </div>
            {won ? <h2 className="won-text">🏆Congratulations🏆
                <br />
                <br />
                🏅You won in <b>{move} moves</b>🏅
                <br />
                <br />
                🔰You took <b>{time} seconds</b>🔰
            </h2>
                : <Board flippedArr={flippedArr} icons={iconArr} handleClick={handleClick} />}
        </div>
    )
}

export default Game;