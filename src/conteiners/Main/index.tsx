import React from 'react';

import Playground from 'conteiners/Playground'

import s from './Main.module.css';

const Main: React.FC = () => {
  return (
    <div className={s.main}>
      <Playground/>
    </div>
  );
};

export default Main;
