import _ from 'lodash';
import { getBoardPosition } from '../boardControl';

const rotate = [
  [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  [[0, 0], [0, 1], [1, -1], [-2, 0], [-2, 1]],
  [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  [[0, 0], [0, -1], [1, -1], [-2, 0], [-2, -1]]
];

export const Blocks: any = {
  I: {
    rotations: [
      {
        position: getBoardPosition(0, 11, 12, 13, 14),
        moves: [[0, 0], [0, -1], [0, 2], [0, -1], [0, 2]]
      },
      {
        position: getBoardPosition(1, 11, 12, 13, 14),
        moves: [[0, -1], [0, 0], [0, 0], [-1, 0], [2, 0]]
      },
      {
        position: getBoardPosition(2, 11, 12, 13, 14),
        moves: [[-1, -1], [-1, 1], [-1, -2], [0, 1], [0, -2]]
      },
      {
        position: getBoardPosition(3, 11, 12, 13, 14),
        moves: [[-1, 0], [-1, 0], [-1, 0], [1, 0], [-2, 0]]
      }
    ]
  },
  J: {
    rotations: _.range(4).map(rot => ({
      position: getBoardPosition(rot, 8, 11, 12, 13),
      moves: rotate[rot]
    }))
  },
  L: {
    rotations: _.range(4).map(rot => ({
      position: getBoardPosition(rot, 6, 11, 12, 13),
      moves: rotate[rot]
    }))
  },
  O: {
    rotations: [
      {
        position: getBoardPosition(0, 7, 8, 12, 13),
        moves: Array(5).fill([0, 0])
      },
      {
        position: getBoardPosition(1, 7, 8, 12, 13),
        moves: Array(5).fill([1, 0])
      },
      {
        position: getBoardPosition(2, 7, 8, 12, 13),
        moves: Array(5).fill([1, -1])
      },
      {
        position: getBoardPosition(3, 7, 8, 12, 13),
        moves: Array(5).fill([0, -1])
      }
    ]
  },
  S: {
    rotations: _.range(4).map(rot => ({
      position: getBoardPosition(rot, 7, 8, 11, 12),
      moves: rotate[rot]
    }))
  },
  T: {
    rotations: _.range(4).map(rot => ({
      position: getBoardPosition(rot, 7, 11, 12, 13),
      moves: rotate[rot]
    }))
  },
  Z: {
    rotations: _.range(4).map(rot => ({
      position: getBoardPosition(rot, 6, 7, 12, 13),
      moves: rotate[rot]
    }))
  }
};

export const initialBoard = Array(24)
  .fill(0)
  .map(row =>
    Array(10)
      .fill(0)
      .map(col => null)
  );

