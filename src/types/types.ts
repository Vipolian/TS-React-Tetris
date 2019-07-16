export type Blocks = 'I' | 'O' | 'T' | 'Z' | 'S' | 'J' | 'L';
export type Rotations = {
  position: number[][];
  move: number[][];
};
export type Block = {
  rotationDatam: Rotations[];
};

export type Board = (null | Blocks)[][];

