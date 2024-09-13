// import logo from './logo.svg';
import './App.css'
import { useState } from 'react'

//方格
function Square({ valObj, winLines, ind, onSquareClick }) {
  // 突出显示致使获胜的三个方块
  let isChangeColor = false

  winLines.some(lineChild => {
    if (ind === lineChild) {
      isChangeColor = true
    }

    return isChangeColor
  })
  return (
    <button className={`square ${isChangeColor ? 'active' : ''}`} onClick={onSquareClick}>
      {valObj ? valObj.value : ''}
    </button>
  )
}

//面板
function Board({ xIsNext, squares, onPlay }) {
  let status,
    winLines = []
  if (calculateWinner(squares)) {
    const { name, line } = calculateWinner(squares)
    if (name === 9) {
      status = 'a dead heat'
    } else if (name) {
      status = 'Winner: ' + name
      winLines = line
    }
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  // 方格点击事件
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return
    }
    let row = parseInt(i / 3)
    let col = parseInt(i % 3)

    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? { value: 'X', row: row + 1, col: col + 1 } : { value: 'O', row: row + 1, col: col + 1 }

    onPlay(nextSquares, i)
  }

  // 制作方块
  let boardEleArr = [{ boardRows: [0, 1, 2] }, { boardRows: [3, 4, 5] }, { boardRows: [6, 7, 8] }].map((ele, index) => {
    let item = ele.boardRows.map(child => {
      return <Square key={child} valObj={squares[child]} ind={child} winLines={winLines} onSquareClick={() => handleClick(child)} />
    })
    return (
      <div className="board-row" key={index}>
        {item}
      </div>
    )
  })

  return (
    <>
      <div className="status">{status}</div>
      {boardEleArr}
    </>
  )
}

function Game() {
  // 跟踪落子历史
  const [history, setHistory] = useState([Array(9).fill(null)])

  // 跟踪用户当前正在查看的步骤
  const [currentMove, setCurrentMove] = useState(0)

  const [sortHistory, setSortHistory] = useState([null])

  //方格默认展示的值
  let currentSquares = history[currentMove]

  // 跟踪下一个玩家
  const xIsNext = currentMove % 2 === 0

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    const sortHistorys = [...sortHistory.slice(0, currentMove + 1), nextSquares[i]]
    setSortHistory(sortHistorys)

    console.log('handlePlay>>>>>>>>', i)
    console.log('currentSquares>>>>>>>>', currentSquares)

    console.log('nextSquares>>>>>>>>', nextSquares)
    console.log('nextHistory>>>>>>>>', nextHistory)
  }

  function jumpTo({ target }) {
    let { dataset } = target
    setCurrentMove(parseInt(dataset.id))
    console.log('currentSquares>>>>>>>>', currentSquares)
  }

  //对每次点击方格，排序右侧历史列表
  let moves = [],
    count = 1,
    description
  moves = sortHistory.map((square, move) => {
    if (move > 0) {
      count++
      description = 'You are at move #' + count + '(' + square.row + ',' + square.col + ')'
      return (
        <li key={move} onClick={e => jumpTo(e)} data-id={count - 1}>
          {description}
        </li>
      )
    }
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          <li onClick={e => jumpTo(e)} data-id={0}>
            Go to game start
          </li>
          {moves}
        </ol>
      </div>
    </div>
  )
}

//宣布获胜者
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //横线
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], //横线
    [0, 4, 8],
    [2, 4, 6] //斜线
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]

    // 找出获胜者
    if (squares && squares[a] && squares[b] && squares[c]) {
      if (squares[a]['value'] === squares[b]['value'] && squares[a]['value'] === squares[c]['value']) {
        return {
          name: squares[a]['value'],
          line: lines[i]
        }
      }
    }
  }

  //平局
  let count = 0
  squares.map(ele => {
    if (ele) {
      count++
    }
    return ''
  })

  if (count === 9) {
    return {
      name: count
    }
  }

  //双方正在对战
  return null
}

function App() {
  return <Game />
}

export default App
