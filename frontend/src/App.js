import React from "react";
import { Outlet } from "react-router-dom";
import './App.css';
const App = () => {
  return (
    <>
      <div>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
