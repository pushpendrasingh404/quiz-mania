import React, { useState } from "react";
import logo from './logo.png';
import './App.css';
import QuizScreen from './quizScreen/quizScreen.js'

function App() {
  const [name, setName] = useState("");

  const setFirstName=(data)=>{
    setName(data)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="userName">
            <div className="userNameCircle">{name.charAt(0).toUpperCase()}</div>
            {name}
        </div>
      </header>
      
      <QuizScreen setName={setFirstName} />
    </div>
  );
}

export default App;
