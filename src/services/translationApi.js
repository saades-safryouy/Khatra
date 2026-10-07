import api from './api';

export async function translateTexts(texts, target = 'ar', source = 'fr') {
  const res = await api.post('/translate', { texts, target, source });
  return res?.data?.translations || res?.translations || texts;
}

export default { translateTexts };
