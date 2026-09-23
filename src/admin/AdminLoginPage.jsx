import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Lock } from '../components/Icons';
import SEO from '../components/SEO';

export function AdminLoginPage() {
  const { login, user } = useData();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!lockedUntil) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const isLocked = Boolean(lockedUntil && now < lockedUntil);
  const remaining = isLocked ? Math.ceil((lockedUntil - now) / 1000) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      setError(`Trop de tentatives échouées. Veuillez patienter ${remaining} secondes.`);
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      const nextAtt = attempts + 1;
      setAttempts(nextAtt);
      if (nextAtt >= 5) {
        setLockedUntil(Date.now() + 60000);
        setError('5 tentatives échouées. Compte temporairement verrouillé pendant 60s.');
      } else {
        setError(err.message || `Identifiants invalides (${nextAtt}/5 tentatives).`);
      }
    }
  };

  return (
    <div className="admin-login-page">
      <SEO title="Connexion Administration" />

      <div className="admin-login-box">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link to="/" className="logo" style={{ justifyContent: 'center', fontSize: '1.6rem', marginBottom: '8px' }}>
            KHATRA<sup>®</sup>
          </Link>
          <span style={{ fontSize: '0.7rem', color: 'var(--caramel)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
            Espace d’Administration
          </span>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Identifiant</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ex: khatra"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isLocked}
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLocked}
            />
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          >
            <Lock s={16} /> {isLocked ? `Verrouillé (${remaining}s)` : 'Se connecter à l’administration'}
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(42,30,23,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--toffee)', margin: 0 }}>
            Identifiants par défaut : <code>khatra</code> / <code>khatra2026</code>
          </p>
          <Link to="/" style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.8rem', color: 'var(--bordeaux)' }}>
            ← Retourner sur le site public
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
