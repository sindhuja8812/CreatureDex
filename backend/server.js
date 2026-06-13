import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/api/generate-lore', async (req, res) => {
  const { species, rarity, ability, habitat } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          {
            role: 'user',
            content: `You are a fantasy creature lore writer. You must respond with ONLY a JSON object, no markdown, no backticks, no explanation.

Generate for a ${rarity} ${species} with ability "${ability}" in "${habitat}":
- lore: one mysterious epic sentence, max 30 words
- taunt: one battle cry the creature says, max 12 words

Respond with this exact format:
{"lore": "your lore here", "taunt": "your taunt here"}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Raw response:', JSON.stringify(data));

    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT}`);
});