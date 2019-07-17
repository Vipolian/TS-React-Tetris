import React from 'react';
import s from './Score.module.css';

interface Props {
  score: number,
  lvl: number,
}

const Score: React.FC<Props> = (props) => {
  return (
    <div className={s.score}>
      <div className={s.scoreBlock}>
        Scores: {props.score}
      </div>
      <div className={s.scoreBlock}>
        Level: {props.lvl}
      </div>
    </div>
  );
};

export default Score;
