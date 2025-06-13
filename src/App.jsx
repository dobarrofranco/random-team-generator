import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [playersList, setPlayersList] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(5);

  const [, setNumbers] = useState(
    [...Array(end - start + 1).keys()].map((index) => start + index)
  );

  const [selectedNumbers, setSelectedNumbers] = useState([1]);
  const [availableNumbers, setAvailableNumbers] = useState(
    [...Array(5).keys()].map((index) => index + 1)
  );

  const [numberOfTeams, setNumberOfTeams] = useState(1); // Para almacenar el número de equipos
  const [teams, setTeams] = useState([]); // Para almacenar los equipos generados
  const [savedTeams, setSavedTeams] = useState([]); // Para almacenar los equipos guardados

  // Función para guardar equipos generados en MongoDB
  const saveTeamsToDB = async (teams) => {
    try {
      await axios.post("http://localhost:5000/api/teams", { teams });
      console.log("Equipos guardados en la base de datos");
    } catch (err) {
      console.error("Error al guardar los equipos:", err);
    }
  };

  const clearTeams = () => {
    setTeams([]); // Vacía el estado de los equipos generados
  };

  const addPlayerHandle = () => {
    if (inputValue.trim !== "") {
      setPlayersList([...playersList, { name: inputValue, delete: false }]);

      setInputValue("");
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const activePlayersCount = playersList.filter(
    (player) => !player.delete
  ).length;

  const toggleDeleteStatus = (index) => {
    const newPlayerList = [...playersList];
    newPlayerList[index].delete = !newPlayerList[index].delete;
    setPlayersList(newPlayerList); // cambia la propiedad "delete" a false.
  };

  const handleSumNum = (event) => {
    const selectedNumber = parseInt(event.target.value);
    setNumberOfTeams(selectedNumber);

    if (selectedNumber === end) {
      // Si el usuario selecciona el último número del rango actual, se actualiza el rango
      setStart(end + 1); // 6 / 10..
      setEnd(end + 5); // 10 / 20..

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
  };

  const generateTeams = () => {
    // Filtrar jugadores que no tienen delete: true
    const activePlayers = playersList.filter((player) => !player.delete);

    // Mezclar jugadores aleatoriamente
    const shuffledPlayers = activePlayers.sort(() => 0.5 - Math.random());

    // Crear equipos vacíos
    const newTeams = Array.from({ length: numberOfTeams }, () => []);

    // Distribuir jugadores en equipos
    shuffledPlayers.forEach((player, index) => {
      newTeams[index % numberOfTeams].push(player);
    });

    setTeams(newTeams);
    saveTeamsToDB(newTeams);
  };

  return (
    <div className="backDrawTeams">
      <h1 className="appName">Random Teams Generator</h1>

      <div className="selectionMode">
        <div className="addPlayers">
          <h2>Players Name</h2>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <button onClick={addPlayerHandle}>Add</button>

          <div className="generateSection">
            <div className="draw">
              <button className="generateButton" onClick={generateTeams}>
                Generate Teams
              </button>
            </div>

            <h3>Generated Teams:</h3>

            <button onClick={clearTeams} className="clearButton">
              Clear Teams
            </button>

            <div className="generatedTeams">
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
        </div>

        <div className="teams">
          <h2>Teams</h2>
          <div className="teamsNumber">
            <label htmlFor="">amount</label>

            <select onChange={handleSumNum}>
              {availableNumbers.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="playerListContainer">
          <h3 className="listOfPlayerTittle">
            List of Players ({activePlayersCount})
          </h3>
          <div className="playerList">
            {playersList.map(
              (player, index) =>
                !player.delete && (
                  <div className="playerItems" key={index}>
                    <p>- {player.name}</p>
                    <button onClick={() => toggleDeleteStatus(index)}>X</button>
                  </div>
                )
            )}
          </div>
        </div>
        <div>
          <h3>Saved Teams from MongoDB</h3>
          <button
            onClick={async () => {
              try {
                const response = await axios.get(
                  "http://localhost:5000/api/teams"
                );
                const fetchedTeams = response.data;
                setSavedTeams(fetchedTeams); // Guardar los equipos completos en el estado
                console.log(fetchedTeams);
              } catch (error) {
                console.error("Error fetching saved teams:", error);
              }
            }}
          >
            Ver equipos
          </button>
        </div>
        <div className="savedTeams">
    {savedTeams.map((savedTeam, index) => (
      <div key={index} className="savedTeam">
        <h4>{new Date(savedTeam.createdAt).toLocaleString()}</h4> {/* Mostrar la fecha */}
        {savedTeam.teams.map((team, teamIndex) => (
          <div key={teamIndex} className="team">
            <h5>Team {teamIndex + 1}</h5>
            <ul>
              {team.map((player, playerIndex) => (
                <li key={playerIndex}>{player.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ))}
  </div>
      </div>
    </div>
  );
}

export default App;
