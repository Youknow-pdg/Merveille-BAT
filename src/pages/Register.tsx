import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserPlus, Mail, Lock, User, UserCheck, ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('locataire');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          }
        }
      });

      if (authError) throw authError;
      const user = authData.user;
      
      if (user) {
        // Profil selection will be handled by AuthContext on session change,
        // but we want to make sure the role is set correctly.
        // Profiles table might have a trigger or we insert it now.
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: email,
            display_name: displayName,
            role: role,
            created_at: new Date().toISOString()
          });
        
        if (profileError) throw profileError;
      }
      
      navigate('/');
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError('Erreur lors de la création du compte. ' + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-merveille-gray/30 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full px-4"
      >
        <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-14 border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">Créer un compte</h2>
            <p className="text-gray-400 text-sm">Rejoignez l'excellence MerveilleBAT</p>
          </div>

          {error && <div className="mb-6 bg-red-50 text-red-500 text-xs py-3 px-4 rounded-xl font-bold uppercase tracking-wider">{error}</div>}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Nom Complet" 
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-merveille-orange/20 outline-none transition-all"
                />
              </div>
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
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Je suis un :</label>
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('locataire')}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all ${role === 'locataire' ? 'border-merveille-orange bg-merveille-orange/5' : 'border-gray-100'}`}
                >
                  <User className={`h-10 w-10 mr-4 ${role === 'locataire' ? 'text-merveille-orange' : 'text-gray-300'}`} />
                  <div className="text-left">
                    <h4 className="font-bold text-sm">Locataire</h4>
                    <p className="text-[10px] text-gray-400">Je cherche un bien à louer</p>
                  </div>
                  {role === 'locataire' && <UserCheck className="ml-auto h-5 w-5 text-merveille-orange" />}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('proprietaire')}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all ${role === 'proprietaire' ? 'border-merveille-orange bg-merveille-orange/5' : 'border-gray-100'}`}
                >
                  <Building2 className={`h-10 w-10 mr-4 ${role === 'proprietaire' ? 'text-merveille-orange' : 'text-gray-300'}`} />
                  <div className="text-left">
                    <h4 className="font-bold text-sm">Propriétaire</h4>
                    <p className="text-[10px] text-gray-400">Je souhaite faire gérer mon bien</p>
                  </div>
                  {role === 'proprietaire' && <UserCheck className="ml-auto h-5 w-5 text-merveille-orange" />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full py-4 mt-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'CRÉATION EN COURS...' : 'S\'INSCRIRE'} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm font-light text-gray-400">
            Déjà inscrit ? <Link to="/login" className="font-bold text-merveille-orange hover:underline">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
