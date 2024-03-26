import { useState } from 'react'
import './App.css'

function App() {

  const [playersList, setPlayersList] = useState([]);

  const [inputValue, setInputValue] = useState('');
  
  const addPlayerHandle = () => {
    if (inputValue.trim !== '') {
      
      setPlayersList([...playersList, { name: inputValue, delete: false }]);
      
      setInputValue('');
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="backDrawTeams">

      <h1 className='appName'>Random Teams Generator</h1>

      <div className="addPlayers">
        <h2>Player</h2>
        <input 
          type="text" 
          value={inputValue}
          onChange={handleInputChange} 
        />
        <button onClick={addPlayerHandle}>Add</button>
      </div>

      <div className="teams">
        <h2>Teams</h2>
        <label htmlFor="">number of teams</label>
        <select name="" id="">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="playerList">
        <h3>List of Players</h3>
        {playersList.map(player => {
          return (
            <div className="playerList">
              <p>- {player.name}</p>
              <button>X</button>
            </div>
          )
        })}
        {/* 
        - Mapear player state. ✔
        - Si delete es false, que se muestre. Si no, si delete es true que no se muetre.
        - "X" cambia la propiedad delete de false a true para eliminarlo de la lista.
        */}
      </div>

      <div className="draw">
        <button>Generate Teams</button>
      </div>


    </div>

  )
}

export default App
