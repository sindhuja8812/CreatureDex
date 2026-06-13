export async function generateAIContent(
  species: string,
  rarity: string,
  ability: string,
  habitat: string
): Promise<{ lore: string; taunt: string }> {
  const res = await fetch('http://localhost:3001/api/generate-lore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ species, rarity, ability, habitat }),
  });

  if (!res.ok) throw new Error('AI generation failed');

  const data = await res.json();
  return { lore: data.lore, taunt: data.taunt };
}