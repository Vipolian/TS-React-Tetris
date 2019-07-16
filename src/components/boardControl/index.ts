import _ from 'lodash';
import { Blocks } from 'components/blocks';

export function makeBoad (rotation: number) {
  const arr = _.range(1, 6);
  return rotate(
    arr.map(row => arr.map(col => [row, col])),
    rotation
  ).flat();
}

export function getBoardPosition(rotation: number, ...position: number[])  {
  return position.map(index => {
    return makeBoad(rotation)[index];
  });
}

export function rotate90 (arr: any) {
  return _.zip(...arr.reverse());
}

export function rotate90s (arr: any) {
  return _.zip(...arr).reverse() ;
}

export function rotate180 (arr: any) {
  return rotate90s(rotate90s(arr));
}

export function rotate (arr: any, rotation: number) {
  switch ((rotation + 4) % 4) {
    case 0:
      return arr;
    case 1:
      return rotate90s(arr);
    case 2:
      return rotate180(arr);
    case 3:
      return rotate90(arr);
    default:
      return arr;
  }
}

export function getRotatedPosition (
  rotation: any,
  boardPosition: any,
  originalRotation: number,
  newRotation: number,
  move: number
) {
  const { move: originalMove } = rotation[originalRotation];
  const { move: newMove } = rotation[newRotation];
  const [row, col] = boardPosition;
  return [
    row + originalMove[move][0] - newMove[move][0],
    col + originalMove[move][1] - newMove[move][1]
  ];
}

export function getOriginalSell (
  rotation: any,
  boardPosition: number[],
  move: number
) {
  const { position } = rotation[move];
  const [row, col] = boardPosition;
  return position.map((cell: any) => [cell[0] + row, cell[1] + col]);
}

export function getRotation (
  rotation: any,
  originalRotation: number,
  newRotation: number,
  move: number
) {
  const { moves: fromOffsets } = rotation[originalRotation];
  const { moves: toOffsets } = rotation[newRotation];
  return [
    fromOffsets[move][0] - toOffsets[move][0],
    fromOffsets[move][1] - toOffsets[move][1]
  ];
}

export function getRotatedCells (
  rotation: any,
  boardPosition: number[],
  originalRotation: number,
  newRotation: number,
  move: number
) {
  const rotationMove = getRotation(
    rotation,
    originalRotation,
    newRotation,
    move
  );
  const { position } = rotation[newRotation];
  const [row, col] = boardPosition;
  return position.map((cell: any) => [
    cell[0] + rotationMove[0] + row,
    cell[1] + rotationMove[1] + col
  ]);
}

export function randomBlock () {
  return Object.keys(Blocks)[_.random(1000, false)! % 7] as any;
}

export function isPlace (cells: number[][], board: any) {
  return cells.every(
    ([cellRow, cellCol]) =>
      1 <= cellRow &&
      cellRow <= 24 &&
      1 <= cellCol &&
      cellCol <= 10 &&
      board[cellRow - 1] &&
      board[cellRow - 1][cellCol - 1] !== undefined &&
      board[cellRow - 1][cellCol - 1] === null
  );
}
