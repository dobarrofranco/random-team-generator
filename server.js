import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/randomTeamGenerator';

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const teamSchema = new mongoose.Schema({
    teams: Array,
    createdAt: { type: Date, default: Date.now }
})

// Crear un modelo basado en el esquema
const Team = mongoose.model('Team', teamSchema);

// Ruta para guardar equipos generados
app.post('/api/teams', async (req, res) => {
    try {
        const newTeam = new Team({teams: req.body.teams});
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        console.error('Error saving team:', error);
        res.status(500).json({ message: 'Error saving team' });
    }
})

// Ruta para obtener todos los equipos generados
app.get('/api/teams', async (req, res) => {
    try {
        const teams = await Team.find().sort({ createdAt: -1 });
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ message: 'Error fetching teams' });
    }
});

// Ruta para eliminar un equipo por ID
app.delete('/api/teams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeam = await Team.findByIdAndDelete(id);
        if (!deletedTeam) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ message: 'Error deleting team' });
    }
});

// Ruta para eliminar todos los equipos
app.delete('/api/teams', async (req, res) => {
    try {
        await Team.deleteMany({});
        res.status(200).json({ message: 'All teams deleted successfully' });
    } catch (error) {
        console.error('Error deleting all teams:', error);
        res.status(500).json({ message: 'Error deleting all teams' });
    }
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});