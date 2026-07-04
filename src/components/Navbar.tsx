import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, User, LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Location', path: '/location' },
    { name: 'Construction', path: '/construction' },
    { name: 'Architecture', path: '/architecture' },
    { name: 'Réalisations', path: '/realisations' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardLink = () => {
    if (!profile) return '#';
    switch (profile.role) {
      case 'admin': return '/dashboard/admin';
      case 'locataire': return '/dashboard/locataire';
      case 'proprietaire': return '/dashboard/proprietaire';
      default: return '/';
    }
  };

  const isHomePage = location.pathname === '/';
  const showBackground = scrolled || !isHomePage;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${showBackground ? 'bg-merveille-dark shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center bg-white p-1 rounded-lg shadow-sm">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo.jpg`} 
              alt="MERVEILLEBAT" 
              className="h-10 md:h-12 w-auto relative z-10" 
              referrerPolicy="no-referrer" 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-merveille-orange ${location.pathname === link.path ? 'text-merveille-orange' : 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/devis" className="btn-primary py-2 px-4 text-xs">DEVIS GRATUIT</Link>
            
            {user ? (
              <div className="relative group">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-white hover:text-merveille-orange flex items-center bg-white/10 px-4 py-2 rounded-full transition-all border border-white/10 hover:border-merveille-orange/50"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">{profile?.displayName?.split(' ')[0] || 'Compte'}</span>
                  <ChevronDown className={`ml-2 h-3 w-3 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-merveille-dark rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/5 bg-white/5">
                        <p className="text-xs font-black text-merveille-orange uppercase tracking-widest mb-1">Connecté en tant que</p>
                        <p className="text-sm font-bold text-white truncate">{profile?.displayName || user.email}</p>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter mt-1">{profile?.role || 'Membre'}</p>
                      </div>
                      
                      <div className="p-2">
                        {profile ? (
                          profile.role === 'admin' ? (
                            <>
                              <Link 
                                to="/dashboard/admin/profil" 
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-white transition-all text-xs font-bold uppercase tracking-wider"
                              >
                                <User className="h-4 w-4 text-merveille-orange" />
                                <span>Profil Admin</span>
                              </Link>
                              <Link 
                                to="/dashboard/admin/parametres" 
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-white transition-all text-xs font-bold uppercase tracking-wider"
                              >
                                <Settings className="h-4 w-4 text-merveille-orange" />
                                <span>Paramètres</span>
                              </Link>
                              <Link 
                                to="/dashboard/admin" 
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-white transition-all text-xs font-bold uppercase tracking-wider"
                              >
                                <LayoutDashboard className="h-4 w-4 text-merveille-orange" />
                                <span>Dashboard Admin</span>
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link 
                                to={getDashboardLink() + '/profil'} 
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-white transition-all text-xs font-bold uppercase tracking-wider"
                              >
                                <User className="h-4 w-4 text-merveille-orange" />
                                <span>Mon Profil</span>
                              </Link>
                              <Link 
                                to={getDashboardLink() + '/parametres'} 
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-white transition-all text-xs font-bold uppercase tracking-wider"
                              >
                                <Settings className="h-4 w-4 text-merveille-orange" />
                                <span>Paramètres</span>
                              </Link>
                              <Link 
                                to={getDashboardLink()} 
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-white transition-all text-xs font-bold uppercase tracking-wider"
                              >
                                <LayoutDashboard className="h-4 w-4 text-merveille-orange" />
                                <span>Mon Espace</span>
                              </Link>
                            </>
                          )
                        ) : user ? (
                          <div className="p-3 text-white/60 text-[10px] font-bold uppercase tracking-widest text-center italic">
                            Session active... <br/>Chargement profil
                          </div>
                        ) : (
                          <div className="p-3 text-white/40 text-[10px] font-bold uppercase tracking-widest text-center">
                            Non connecté
                          </div>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all text-xs font-bold uppercase tracking-wider mt-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="text-white hover:text-merveille-orange">
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-merveille-orange focus:outline-none"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-merveille-dark border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-white hover:text-merveille-orange"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/devis"
                onClick={() => setIsOpen(false)}
                className="block btn-primary text-center"
              >
                DEVIS GRATUIT
              </Link>
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 px-2 py-2 border-b border-white/5 pb-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-merveille-orange flex items-center justify-center font-black text-white text-lg">
                      {profile?.displayName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{profile?.displayName || user.email}</p>
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{profile?.role || 'Membre'}</p>
                    </div>
                  </div>
                  
                  {profile ? (
                    profile.role === 'admin' ? (
                      <>
                        <Link
                          to="/dashboard/admin/profil"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-white text-lg font-medium hover:text-merveille-orange"
                        >
                          <User className="h-5 w-5 mr-3 text-merveille-orange" /> Profil Admin
                        </Link>
                        <Link
                          to="/dashboard/admin/parametres"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-white text-lg font-medium hover:text-merveille-orange"
                        >
                          <Settings className="h-5 w-5 mr-3 text-merveille-orange" /> Paramètres
                        </Link>
                        <Link
                          to="/dashboard/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-white text-lg font-medium hover:text-merveille-orange"
                        >
                          <LayoutDashboard className="h-5 w-5 mr-3 text-merveille-orange" /> Tableau de Bord
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to={getDashboardLink() + '/profil'}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-white text-lg font-medium hover:text-merveille-orange"
                        >
                          <User className="h-5 w-5 mr-3 text-merveille-orange" /> Mon Profil
                        </Link>
                        <Link
                          to={getDashboardLink() + '/parametres'}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-white text-lg font-medium hover:text-merveille-orange"
                        >
                          <Settings className="h-5 w-5 mr-3 text-merveille-orange" /> Paramètres
                        </Link>
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-white text-lg font-medium hover:text-merveille-orange"
                        >
                          <LayoutDashboard className="h-5 w-5 mr-3 text-merveille-orange" /> Mon Espace
                        </Link>
                      </>
                    )
                  ) : (
                    <div className="px-2 py-4 text-white/40 text-sm italic">
                      Session active (Chargement profil)...
                    </div>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center text-red-400 text-lg font-medium w-full text-left pt-4 border-t border-white/5"
                  >
                    <LogOut className="h-5 w-5 mr-3" /> Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-white text-lg font-medium"
                >
                  <User className="h-5 w-5 mr-3" /> Connexion
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
