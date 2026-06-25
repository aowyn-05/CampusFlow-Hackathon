const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
  const { user_id, title, subject, deadline, reminder_time, add_to_calendar, phone, student_name } = req.body;

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ user_id, title, subject, deadline, reminder_time, add_to_calendar, phone, student_name }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  // n8n webhook trigger goes here in the 1:45–2:15 block — leave a TODO
  // TODO: axios.post(process.env.N8N_DEADLINE_WEBHOOK, {...})

  res.json(data[0]);
});

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;