import { useState } from 'react'
import './App.css'

function App() {

  const [playersList, setPlayersList] = useState([]);

  const [inputValue, setInputValue] = useState('');

  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(5);

  const [numbers, setNumbers] = useState([...Array(end - start + 1).keys()].map((index) => start + index));

  const [selectedNumbers, setSelectedNumbers] = useState([1]);
  const [availableNumbers, setAvailableNumbers] = useState([...Array(5).keys()].map((index) => index + 1));

  const [numberOfTeams, setNumberOfTeams] = useState(1); // Para almacenar el número de equipos
  const [teams, setTeams] = useState([]); // Para almacenar los equipos generados


  const addPlayerHandle = () => {
    if (inputValue.trim !== '') {

      setPlayersList([...playersList, { name: inputValue, delete: false }]);

      setInputValue('');
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // console.log(playersList);

  const toggleDeleteStatus = (index) => {
    const newPlayerList = [...playersList];
    newPlayerList[index].delete = !newPlayerList[index].delete;
    setPlayersList(newPlayerList); // cambia la propiedad "delete" a false.
  }

  const handleSumNum = (event) => {
    const selectedNumber = parseInt(event.target.value);
    setNumberOfTeams(selectedNumber);

    if (selectedNumber === end) {
      // Si el usuario selecciona el último número del rango actual, se actualiza el rango
      setStart(end + 1);
      setEnd(end + 5);

      // Generar un nuevo conjunto de números basado en el nuevo rango
      const newNumbers = [];
      for (let i = start + 1; i <= end + 5; i++) {
        newNumbers.push(i);
      }
      setNumbers(newNumbers);

    } else {
      // Si el usuario selecciona otro número, no se cambia el rango
      console.log("Selected number:", selectedNumber);
    }

    if (!selectedNumbers.includes(selectedNumber)) {
      const newSelectedNumbers = [...selectedNumbers, selectedNumber];
      setSelectedNumbers(newSelectedNumbers);
    }

    if (selectedNumber === availableNumbers[availableNumbers.length - 1]) {
      const nextNumber = availableNumbers[availableNumbers.length - 1] + 1;
      const newAvailableNumbers = [...availableNumbers, nextNumber];
      setAvailableNumbers(newAvailableNumbers);
    }

  }

  const generateTeams = () => {
    // Filtrar jugadores que no tienen delete: true
    const activePlayers = playersList.filter(player => !player.delete);

    // Mezclar jugadores aleatoriamente
    const shuffledPlayers = activePlayers.sort(() => 0.5 - Math.random());

    // Crear equipos vacíos
    const newTeams = Array.from({ length: numberOfTeams }, () => []);

    // Distribuir jugadores en equipos
    shuffledPlayers.forEach((player, index) => {
      newTeams[index % numberOfTeams].push(player);
    });

    setTeams(newTeams);
  }

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

        <select onChange={handleSumNum}>
          {availableNumbers.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>

      <div className="playerList">
        <h3>List of Players</h3>
        {playersList.map((player, index) => (
          !player.delete && (
            <div className="playerList" key={index}>
              <p>- {player.name}</p>
              <button onClick={() => toggleDeleteStatus(index)}>X</button>
            </div>
          )
        ))}
        {/* 
        - Mapear player state. ✔
        - Si delete es false, que se muestre. Si no, si delete es true que no se muetre. ✔
        - "X" cambia la propiedad delete de false a true para eliminarlo de la lista. ✔
        - Hacer la lógica para generar la cantidad de equipos seleccionados de acuerdo a los jugadores cargados. ✔
        */}
      </div>

      <div className="draw">
        <button onClick={generateTeams}>Generate Teams</button>
      </div>

      <div className="generatedTeams">
        <h3>Generated Teams</h3>
        {teams.map((team, index) => (
          <div key={index}>
            <h4>Team {index + 1}</h4>
            <ul>
              {team.map((player, playerIndex) => (
                <li key={playerIndex}>{player.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>


    </div>

  )
}

export default App
