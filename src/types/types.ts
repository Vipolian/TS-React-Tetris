export type BlockTypes = 'I' | 'O' | 'T' | 'Z' | 'S' | 'J' | 'L' ;
export type Rotations = {
  position: number[][];
  move: number[][];
};
export type Block = {
  rotationDatam: Rotations[];
};

export type Board = (null | BlockTypes)[][];

export type CellType = BlockTypes | null;

export type RowType = CellType[];
