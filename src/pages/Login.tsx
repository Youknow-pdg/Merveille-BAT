import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Github, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SUPABASE_AUTH_SUCCESS') {
        navigate('/');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      console.error('Login Error:', err);
      setError('Identifiants invalides. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true
        }
      });
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, 'supabase_auth', 'width=600,height=700');
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setError('Erreur lors de la connexion Google : ' + (err.message || 'Erreur inconnue'));
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-merveille-gray/30 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full px-4"
      >
        <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-14 border border-gray-100 text-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black mb-2">Bon retour !</h2>
            <p className="text-gray-400 text-sm">Connectez-vous à votre espace MerveilleBAT</p>
          </div>

          {error && <div className="mb-6 bg-red-50 text-red-500 text-xs py-3 px-4 rounded-xl font-bold uppercase tracking-wider">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="Email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-merveille-orange/20 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="Mot de passe" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-merveille-orange/20 outline-none transition-all"
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" size="sm" className="text-xs font-bold text-gray-400 hover:text-merveille-orange transition-colors">Mot de passe oublié ?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full py-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'CONNEXION...' : 'CONNEXION'} <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>

          <div className="my-10 flex items-center">
            <div className="flex-grow h-px bg-gray-100"></div>
            <span className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-300">OU</span>
            <div className="flex-grow h-px bg-gray-100"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-2xl py-4 hover:bg-gray-100 transition-all font-bold text-sm"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3.09c-2.113-1.963-4.881-3.18-7.91-3.18C7.505 0 3.74 2.87 2.113 6.945l3.153 2.82z"/>
              <path fill="#FBBC05" d="M16.039 20.204c-1.121.651-2.433 1.03-3.839 1.03a7.077 7.077 0 0 1-6.931-4.909l-3.153 2.82C3.125 21.14 7.077 24 12 24c3.313 0 6.294-1.282 8.528-3.375l-2.489-0.421z"/>
              <path fill="#4285F4" d="M23.491 12.273c0-0.796-0.073-1.564-0.208-2.305H12v4.364h6.436c-0.277 1.459-1.096 2.695-2.327 3.523l2.489 0.421c2.113-1.963 3.393-4.836 3.393-8.003z"/>
              <path fill="#34A853" d="M5.266 14.235a7.077 7.077 0 0 1-0.154-1.47c0-.527.06-1.038.154-1.53l-3.153-2.82A11.962 11.962 0 0 0 1.091 12c0 1.34.225 2.628.628 3.826l3.547-1.59z"/>
            </svg>
            Continuer avec Google
          </button>

          <p className="mt-10 text-sm font-light text-gray-400">
            Pas encore de compte ? <Link to="/register" className="font-bold text-merveille-orange hover:underline">S'inscrire</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
