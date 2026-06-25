const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

router.post('/register', async (req, res) => {
  const { name, branch, year, phone, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, branch, year, phone, email, password: hashed }])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: data[0], token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !users) return res.status(400).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, users.password);
  if (!match) return res.status(400).json({ error: 'Wrong password' });

  const token = jwt.sign({ id: users.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: users, token });
});

module.exports = router;