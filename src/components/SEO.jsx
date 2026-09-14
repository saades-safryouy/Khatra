import { useEffect } from 'react';

export function SEO({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | Khatra — Coffee & Retail Partner` : 'Khatra — Coffee & Retail Partner au Maroc';
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}

export default SEO;
