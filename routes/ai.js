const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const callGroq = async (systemPrompt, userPrompt) => {
  const response = await axios.post(
    GROQ_URL,
    {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content;
};

// POST /api/ai/summarize
router.post('/summarize', async (req, res) => {
  const { noticeText } = req.body;
  if (!noticeText) return res.status(400).json({ error: 'noticeText is required' });

  try {
    const systemPrompt = 'You summarize college notices into exactly 3 short bullet points. Be concise. Only output the 3 bullets, nothing else.';
    const summary = await callGroq(systemPrompt, noticeText);
    res.json({ summary });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'AI summarize failed' });
  }
});

// POST /api/ai/flashcards
router.post('/flashcards', async (req, res) => {
  const { notesText } = req.body;
  if (!notesText) return res.status(400).json({ error: 'notesText is required' });

  try {
    const systemPrompt = 'You convert study notes into flashcards. Output ONLY valid JSON, an array of objects like [{"question": "...", "answer": "..."}]. Generate 5 flashcards. No extra text, no markdown formatting, just the raw JSON array.';
    const raw = await callGroq(systemPrompt, notesText);

    // Strip markdown code fences if Groq adds them anyway
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const flashcards = JSON.parse(cleaned);

    res.json({ flashcards });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'AI flashcards failed' });
  }
});

module.exports = router;