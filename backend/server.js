
require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 
const appointmentRoutes = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 3000; // Porta do servidor


app.use(cors());
app.use(express.json()); 


app.use('/api/appointments', appointmentRoutes);


app.get('/', (req, res) => {
  res.send('API de Gerenciamento de Agendamentos está no ar!');
});


app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});