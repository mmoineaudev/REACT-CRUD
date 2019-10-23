import React from "react";
import "./App.css";
import Restaurants from "./components/restaurants";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TD web, implémentation en react d'un crud sur la base locale</h1>
      </header>
      <Restaurants></Restaurants>
    </div>
  );
}

export default App;
