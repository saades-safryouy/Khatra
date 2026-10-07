import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, useToast } from '../components/ui';
import { authApi } from '../services/authApi';
import Logo from '../../public/khatra_logo_new.png';
import BlackLogo from '../../public/khatra_logo_old.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const showToast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => { event.preventDefault(); setLoading(true); try { const data = await authApi.login(email, password); login(data.user, data.token); showToast('Connexion réussie.'); navigate('/admin/dashboard', { replace: true }); } catch (error) { showToast(error?.uiMessage || 'Identifiants invalides.', 'error'); } finally { setLoading(false); } };
  return <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
    <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg">
          <img src={Logo} alt="Logo Khatra" />
        </div>
        <div>
          <p className="font-semibold">Khatra</p>
          <p className="text-sm text-slate-400">Espace d’administration</p>
        </div>
      </div>
      <div>
        <p className="max-w-md text-4xl font-semibold leading-tight">Gérez votre catalogue et vos activités depuis un espace unique.</p>
        <p className="mt-5 max-w-md text-slate-400">Un espace dédié aux produits, points de vente, catégories et franchises.</p>
      </div>
      <p className="text-sm text-slate-500">Administration sécurisée</p>
    </div>
    <div className="flex items-center justify-center p-5 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="mb-8 lg:hidden">
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg text-white">
            <img src={BlackLogo} alt="Logo Khatra" />
          </div>
          <p className="text-xl font-semibold text-slate-950">Administration Khatra</p>
        </div>
        <div className="k-card p-6 sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Connexion</h1>
            <p className="mt-2 text-sm text-slate-500">Saisissez vos identifiants pour continuer.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Adresse e-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="nom@entreprise.ma" />
            <Input label="Mot de passe" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="••••••••" />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  </div>;
}
