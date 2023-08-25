import React, { useEffect, useState } from 'react';
import './App.css';
import { usePathStore } from './stores';
import Main from './views/Main';
import Enter from './views/Enter';

//          component: Root 컴포넌트          //
function App() {

  //          state: Path 전역 상태         //
  const { path } = usePathStore();

  //          render: Root 컴포넌트 렌더링         //
  return (
    <div>
      {
        path === '/' ? (<Main />) :
        path === '/enter' ? (<Enter />) :
        path === '/room' ? (<></>) :
        (<></>)
      }
    </div>
  );
}

export default App;
