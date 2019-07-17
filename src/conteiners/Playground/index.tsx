import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import Score from 'components/score'

import { Board, CellType, Block, BlockTypes, RowType } from 'types/types';


import {
  getRotatedCells,
  getOriginalSell,
  getRotatedPosition,
  isPlace,
  randomBlock
} from '../../components/boardControl';

import {Blocks, initialBoard} from 'components/blocks';

import s from './Playground.module.css';


const Playground: React.FC = () => {

  const initialDelay = 300;
  const initPosition = [0, 2];
  const initialLvl = 1;

  const [board, setBoard] = useState(initialBoard);
  const [delay, setDelay] = useState(initialDelay);
  const [[row, col], setPosition] = useState(initPosition);
  const [lvl, setLvl] = useState(initialLvl);
  const [onGame, setOnGame] = useState(false);
  const [score, setScore] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [nextBlock, setNextBlock] = useState(
    randomBlock()
  );
  const [currentBlock, setCurrentBlock] = useState(
    randomBlock()
  );

  const moveTo = (relRow: number, relCol: number) => {
    if (isPlace(getOriginalSell(
      Blocks[currentBlock].rotations,
      [row + relRow, col + relCol],
      rotation
      ),
      board
    )
    ) {
      setPosition(([row, col]) => [row + relRow, col + relCol]);
      return true;
    }
    return false;
  };

  const moveLeft = () => {
    moveTo(0, -1);
  };

  const moveRight = () => {
    moveTo(0, 1);
  };

  const rotateLeft = () => {
    rotateTo((rotation - 1 + 4) % 4);
  };
  const rotateRight = () => {
    rotateTo((rotation + 1) % 4);
  };

  const drop = () => {
    if (!moveTo(1, 0)) {
      land();
    }
  };

  const rotateTo = (newRotation: number) => {
    let move = 0;
    while (move < 5) {
      if (
        isPlace(
          getRotatedCells(
            Blocks[currentBlock].rotations,
            [row, col],
            rotation,
            newRotation,
            move
          ),
          board
        )
      ) {
        setPosition(([row, col]) =>
          getRotatedPosition(
            Blocks[currentBlock].rotations,
            [row, col],
            rotation,
            newRotation,
            move
          )
        );
        setRotation(newRotation);
        return;
      }
      move++;
    }
  };

  const land = () => {
    const newBoard = board.map(r => r.map(c => c));
    console.log(newBoard);
    getOriginalSell(
      Blocks[currentBlock].rotations,
      [row, col],
      rotation
    ).map(([cellRow, cellCol]: number[]) => {
      newBoard[cellRow - 1][cellCol - 1] = currentBlock;
    });
    setBoard(newBoard);
    setCurrentBlock(nextBlock);
    if (!onGame) {return null}
    setNextBlock(_.sample(Object.keys(Blocks)) as BlockTypes);
    setPosition([0, 2]);
    setRotation(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.keyCode) {
      case 37: // left
        moveLeft();
        break;
      case 39: // right
        moveRight();
        break;
      case 81: // z
        rotateLeft();
        break;
      case 69: // x
        rotateRight();
        break;
      case 40: // down
        drop();
        break;
      default:
        break;
    }
  };

  const addCell = () => {
    if (lvl < 2 ) return null;
    const row = Array(10).fill("I");
    row[_.random(0, 10)] = null;
    row[_.random(0, 10)] = null;

    setBoard([...board.filter((_, i) => i > 0), row]);
  };

  const reduceDelay = () => {
    if (delay < 50 ) return null;
    setDelay(delay - 30);
  };

  const useInterval = (callback: Function, delay: number | null) => {
    const savedCallback: { current: Function } = useRef(callback);

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useEffect(() => {
    boardRef.current!.focus();
  }, []);

  useEffect(() => {
    if (board[3].some((cell: CellType) => cell !== null)) {
      setOnGame(false);
    }
    const newBoard = board.filter((row: RowType) => row.some((cell: CellType) => cell === null));
    const newScore = score + (board.length - newBoard.length) * 50;
    const newLvl = (newScore % 100 > score % 100) ? lvl+1 : lvl;
    if (newLvl > lvl) {
      setLvl(newLvl);
      reduceDelay()
    }
    setScore(newScore);
    const emptyRows = Array(24 - newBoard.length)
      .fill(0)
      .map(() =>
        Array(10)
          .fill(0)
          .map(() => null)
      );
    if (emptyRows.length > 0) {
      setBoard([...emptyRows, ...newBoard]);
    }
  }, [board, lvl, score, reduceDelay]);

  useInterval(drop, onGame ? delay : null);
  useInterval(addCell, onGame ? 6000 : null);

  const start = () => {
    setOnGame(true);
    boardRef.current!.focus();
  };

  const activeCells = getOriginalSell(
    Blocks[currentBlock].rotations,
    [row, col],
    rotation
  );


  const Area = ( { board }: { board: Board } ) => (
    <>
      {board.map((row: RowType, rowIdx: number) =>
        row.map(
          (type: CellType, colIdx: number) =>
            type && (
              <Cell
                key={`${rowIdx}${colIdx}`}
                cell={[rowIdx + 1, colIdx + 1]}
              />
            )
        )
      )}
    </>
  );

  const AreaSells = ({cells}: {
    cells: number[][];
  }) => {
    return (
      <>
        {cells.map(cell => (
          <Cell
            key={`${cell[0]}${cell[1]}`}
            cell={cell}
          />
        ))}
      </>
    );
  };
  return (
    <div className={s.playground}>
      <div className={s.boardBlock} tabIndex={0} ref={boardRef} onKeyDown={handleKeyPress}>
        <div className={s.board}>
          <AreaSells
            cells={activeCells}
          />
          <Area board={board}/>
        </div>
        <div className={s.controlBlock}>
          <Score score={score} lvl={lvl}/>
          <button disabled={onGame} onClick={start} className={s.start}>
            START
          </button>
        </div>
      </div>
    </div>
  );
};

type CellProps = {
  cell: number[];
};
export const Cell = styled.div.attrs<CellProps>(p => ({
  style: {
    backgroundColor: 'blueviolet',
    gridRow: p.cell[0],
    gridColumn: p.cell[1]
  }
}))<CellProps>`
  border: 3px solid 'black';
`;


export default Playground;
