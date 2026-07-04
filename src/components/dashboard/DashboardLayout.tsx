import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Home, 
  Users, 
  FileText, 
  Wrench, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  MessageSquare,
  PlusCircle,
  Bell,
  Building2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const DashboardLayout = ({ children, items }: { children: React.ReactNode, items: SidebarItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsQuickActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardRoot = () => {
    if (!profile) return '/dashboard';
    switch (profile.role) {
      case 'admin': return '/dashboard/admin';
      case 'locataire': return '/dashboard/locataire';
      case 'proprietaire': return '/dashboard/proprietaire';
      default: return '/dashboard';
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getQuickActions = () => {
    const root = getDashboardRoot();
    if (profile?.role === 'admin') {
      return [
        { name: 'Nouvel Utilisateur', icon: Users, path: `${root}/users` },
        { name: 'Ajouter Propriété', icon: Building2, path: `${root}/properties` },
        { name: 'Générer Contrat', icon: FileText, path: `${root}/contracts` },
      ];
    }
    if (profile?.role === 'proprietaire') {
      return [
        { name: 'Ajouter un Bien', icon: Home, path: `${root}/properties` },
        { name: 'Demander Contrat', icon: FileText, path: `${root}/contracts` },
        { name: 'Voir Finance', icon: CreditCard, path: `${root}/finance` },
      ];
    }
    return [
      { name: 'Payer Loyer', icon: CreditCard, path: `${root}/payments` },
      { name: 'Signaler Problème', icon: Wrench, path: `${root}/maintenance` },
      { name: 'Voir Contrat', icon: FileText, path: `${root}/contract` },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden bg-black/50 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)} />
      
      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-merveille-dark text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/10">
            <Link to="/" className="flex items-center bg-white p-1 rounded-lg shadow-sm">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.jpg`} 
                alt="MERVEILLEBAT" 
                className="h-10 w-auto relative z-10" 
                referrerPolicy="no-referrer" 
              />
            </Link>
          </div>

          <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto">
            {items.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${
                  location.pathname === item.path || (item.path !== getDashboardRoot() && location.pathname.startsWith(item.path))
                    ? 'bg-merveille-orange text-white shadow-lg' 
                    : 'hover:bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="flex items-center px-4 py-3 bg-white/5 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-merveille-orange flex items-center justify-center font-black text-white mr-4">
                {profile?.displayName?.[0] || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{profile?.displayName || 'Utilisateur'}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{profile?.role || 'Rôle'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
            >
              <LogOut className="h-5 w-5" /> <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-full relative">
        <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsOpen(true)} className="text-merveille-dark p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <h2 className="text-lg lg:text-xl font-black truncate max-w-[200px] lg:max-w-none">
            {items.find(i => i.path === location.pathname)?.name || 
             items.find(i => location.pathname.startsWith(i.path) && i.path !== getDashboardRoot())?.name || 
             'Tableau de bord'}
          </h2>
          <div className="flex items-center space-x-4 lg:space-x-8 text-gray-400">
            <button 
              onClick={() => {
                const root = getDashboardRoot();
                if (profile?.role === 'locataire') navigate(`${root}/contract`);
                else navigate(`${root}/finance`);
              }}
              title="Notifications"
              className="relative group p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <Bell className="h-5 w-5 group-hover:text-merveille-orange transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <button 
              onClick={() => {
                const root = getDashboardRoot();
                navigate(`${root}/parametres`);
              }}
              title="Paramètres"
              className="p-2 hover:bg-gray-100 rounded-full transition-all group"
            >
              <Settings className="h-5 w-5 group-hover:text-merveille-orange transition-colors" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                className={`h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center rounded-2xl cursor-pointer transition-all shadow-lg group ${
                  isQuickActionOpen ? 'bg-merveille-orange shadow-merveille-orange/20 rotate-45' : 'bg-merveille-dark shadow-merveille-dark/10 hover:bg-merveille-orange'
                }`}
              >
                <Plus className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </button>

              <AnimatePresence>
                {isQuickActionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                  >
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Actions Rapides</span>
                      <button onClick={() => setIsQuickActionOpen(false)} className="text-gray-300 hover:text-gray-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      {quickActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            navigate(action.path);
                            setIsQuickActionOpen(false);
                          }}
                          className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all text-left group"
                        >
                          <div className="bg-merveille-orange/10 p-3 rounded-xl group-hover:bg-merveille-orange group-hover:text-white transition-all">
                            <action.icon className="h-4 w-4 text-merveille-orange group-hover:text-white transition-all" />
                          </div>
                          <span className="text-sm font-bold text-merveille-dark tracking-tight">{action.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
