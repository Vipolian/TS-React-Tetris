import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import _ from 'lodash';

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

  const delay = 30;
  const initPosition = [0, 2];

  const [onGame, setOnGame] = useState(false);
  const [board, setBoard] = useState(initialBoard);
  const [[row, col], setPosition] = useState(initPosition);
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
    getOriginalSell(
      Blocks[currentBlock].rotations,
      [row, col],
      rotation
    ).map(([cellRow, cellCol]: any) => {
      newBoard[cellRow - 1][cellCol - 1] = currentBlock;
    });
    setBoard(newBoard);
    setCurrentBlock(nextBlock);
    setNextBlock(_.sample(Object.keys(Blocks)) as any);
    setPosition([0, 2]);
    setRotation(0);
  };

  const handleKeyPress = (e: any) => {
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

  const useInterval = (callback: any, delay: number | null) => {
    const savedCallback: { current: any } = useRef(callback);

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
  }

  useEffect(() => {
    boardRef.current!.focus();
  }, []);

  useEffect(() => {
    if (board[3].some((cell: any) => cell !== null)) {
      setOnGame(false);
    }
    const newBoard = board.filter((row: any) => row.some((cell: any) => cell === null));
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
  }, [board]);

  useInterval(drop, onGame ? delay : null);

  const start = () => {
    setOnGame(true);
    boardRef.current!.focus();
  };

  const activeCells = getOriginalSell(
    Blocks[currentBlock].rotations,
    [row, col],
    rotation
  );

  const Area = (board: any) => (
    <div>
      {board.map((row: any, rowIdx: any) =>
        row.map(
          (type: any, colIdx: any) =>
            type && (
              <Cell
                key={`${rowIdx}${colIdx}`}
                cell={[rowIdx + 1, colIdx + 1]}
              />
            )
        )
      )}
    </div>
  );

  const AreaSells = ({cells}: {
    cells: any[];
  }) => {
    return (
      <div>
        {cells.map(cell => (
          <Cell
            key={`${cell[0]}${cell[1]}`}
            cell={cell}
          />
        ))}
      </div>
    );
  };
  return (
    <div className={s.playground}>
      <div className={s.boardControl} tabIndex={0} ref={boardRef} onKeyDown={handleKeyPress}>
        <div className={s.board}>
          <AreaSells
            cells={activeCells}
          />
          <Area board={board}/>
          <button disabled={onGame} onClick={start}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

type CellProps = {
  cell: any;
};
export const Cell = styled.div.attrs<any>(p => ({
  style: {
    backgroundColor: 'green',
    gridRow: p.cell[0],
    gridColumn: p.cell[1]
  }
}))<CellProps>`
  border: 1px solid '#888';
`;


export default Playground;
