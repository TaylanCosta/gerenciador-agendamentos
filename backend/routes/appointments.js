
const express = require('express');
const router = express.Router();
const knexConfig = require('../db/knexfile');
const knex = require('knex')(knexConfig.development);

//Obter todos os agendamentos
router.get('/', async (req, res) => {
  try {
    const appointments = await knex('appointments').select('*').orderBy('scheduled_date', 'asc');
    res.json(appointments);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ error: 'Erro Interno do Servidor ao buscar agendamentos.' });
  }
});

//Obter um agendamento específico por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await knex('appointments').where({ id }).first();
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }
    res.json(appointment);
  } catch (err) {
    console.error('Erro ao buscar agendamento por ID:', err);
    res.status(500).json({ error: 'Erro Interno do Servidor ao buscar agendamento.' });
  }
});

//Criar um novo agendamento
router.post('/', async (req, res) => {
  try {
    const { title, scheduled_date, client_name, notes } = req.body;
    if (!title || !scheduled_date || !client_name) {
      return res.status(400).json({ error: 'Título, Data/Hora e Nome do Cliente são obrigatórios.' });
    }
    
    const [id] = await knex('appointments').insert({ title, scheduled_date, client_name, notes });
    const newAppointment = await knex('appointments').where({ id }).first();
    res.status(201).json(newAppointment); // 201 Created
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    res.status(500).json({ error: 'Erro Interno do Servidor ao criar agendamento.' });
  }
});

//Atualizar um agendamento existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, scheduled_date, client_name, notes } = req.body;
    
    if (!title && !scheduled_date && !client_name && !notes) {
        return res.status(400).json({ error: 'Nenhum dado para atualização fornecido.' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (scheduled_date) updateData.scheduled_date = scheduled_date;
    if (client_name) updateData.client_name = client_name;
    if (notes) updateData.notes = notes;

    const updatedCount = await knex('appointments').where({ id }).update(updateData);
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }
    const updatedAppointment = await knex('appointments').where({ id }).first();
    res.json(updatedAppointment);
  } catch (err) {
    console.error('Erro ao atualizar agendamento:', err);
    res.status(500).json({ error: 'Erro Interno do Servidor ao atualizar agendamento.' });
  }
});

//Excluir um agendamento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await knex('appointments').where({ id }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao excluir agendamento:', err);
    res.status(500).json({ error: 'Erro Interno do Servidor ao excluir agendamento.' });
  }
});

module.exports = router;