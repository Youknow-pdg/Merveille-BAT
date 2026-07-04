import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Users, Building2, FileText, CreditCard, BarChart3, Clock, TrendingUp, User as UserIcon, Settings as SettingsIcon, Bell, Shield, Database, Lock, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const data = [
  { name: 'Jan', revenue: 4000, projects: 24 },
  { name: 'Fév', revenue: 3000, projects: 13 },
  { name: 'Mar', revenue: 2000, projects: 98 },
  { name: 'Avr', revenue: 2780, projects: 39 },
  { name: 'Mai', revenue: 1890, projects: 48 },
  { name: 'Jun', revenue: 2390, projects: 38 },
];

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    monthlyRevenue: '0 FCFA',
    activeUsers: '0',
    ongoingProjects: '18',
    interventions: '32'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const { data: payments } = await supabase.from('payments').select('amount');
        const total = (payments || []).reduce((acc, curr) => acc + curr.amount, 0);
        
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        
        setStats(prev => ({
          ...prev,
          monthlyRevenue: `${total.toLocaleString()} FCFA`,
          activeUsers: (usersCount || 0).toString()
        }));
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Revenus Mensuels', val: stats.monthlyRevenue, icon: CreditCard, color: 'text-green-500', trend: '+14%' },
          { label: 'Utilisateurs Actifs', val: stats.activeUsers, icon: Users, color: 'text-blue-500', trend: '+5%' },
          { label: 'Projets en Cours', val: stats.ongoingProjects, icon: Building2, color: 'text-orange-500', trend: '+2' },
          { label: 'Interventions', val: stats.interventions, icon: Clock, color: 'text-red-500', trend: '-8%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</h4>
              <p className="text-2xl font-black text-merveille-dark">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black tracking-tight">Performance Financière</h3>
          <select className="text-xs font-bold bg-gray-50 border-none rounded-lg px-3 py-2 outline-none">
            <option>6 derniers mois</option>
            <option>Année complète</option>
          </select>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F57C00" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#F57C00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
              <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F57C00" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-merveille-dark rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
        <div className="relative z-10">
          <TrendingUp className="h-10 w-10 text-merveille-orange mb-6" />
          <h3 className="text-2xl font-black mb-4">Objectif Global</h3>
          <p className="text-white/60 text-sm font-light leading-relaxed mb-8">
            Vous avez atteint 85% de votre objectif de croissance annuelle. Continuez ainsi !
          </p>
        </div>
        <div className="relative z-10 w-full bg-white/10 h-3 rounded-full overflow-hidden">
          <div className="h-full bg-merveille-orange w-[85%]" />
        </div>
        <p className="relative z-10 mt-4 text-xs font-bold uppercase tracking-widest text-right">85% Complété</p>
        
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-32 -mt-32 rounded-full blur-[80px]" />
      </div>
    </div>

    {/* Recent Activity Section */}
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-black tracking-tight">Dernières Activités</h3>
        <button className="text-xs font-bold text-merveille-orange uppercase tracking-widest hover:underline">Voir Tout</button>
      </div>

      {/* Table Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <th className="px-8 py-4">Utilisateur</th>
              <th className="px-8 py-4">Action</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { user: 'Samba Diop', action: 'Nouveau Devis Construction', date: 'Aujourd\'hui, 10:45', status: 'En attente', sColor: 'text-orange-500 bg-orange-50' },
              { user: 'Fatou Ndiaye', action: 'Paiement Loyer Villa Oasis', date: 'Aujourd\'hui, 09:12', status: 'Validé', sColor: 'text-green-500 bg-green-50' },
              { user: 'Moussa Gueye', action: 'Demande Interv. Sanitaire', date: 'Hier, 16:30', status: 'En cours', sColor: 'text-blue-500 bg-blue-50' },
              { user: 'Binta Fall', action: 'Inscription Propriétaire', date: 'Hier, 14:20', status: 'Nouveau', sColor: 'text-purple-500 bg-purple-50' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5 text-sm font-bold text-merveille-dark">{row.user}</td>
                <td className="px-8 py-5 text-sm font-light text-gray-500">{row.action}</td>
                <td className="px-8 py-5 text-xs text-gray-400">{row.date}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.sColor}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View Mobile */}
      <div className="md:hidden divide-y divide-gray-50">
        {[
          { user: 'Samba Diop', action: 'Nouveau Devis Construction', date: 'Aujourd\'hui, 10:45', status: 'En attente', sColor: 'text-orange-500 bg-orange-50' },
          { user: 'Fatou Ndiaye', action: 'Paiement Loyer Villa Oasis', date: 'Aujourd\'hui, 09:12', status: 'Validé', sColor: 'text-green-500 bg-green-50' },
          { user: 'Moussa Gueye', action: 'Demande Interv. Sanitaire', date: 'Hier, 16:30', status: 'En cours', sColor: 'text-blue-500 bg-blue-50' },
          { user: 'Binta Fall', action: 'Inscription Propriétaire', date: 'Hier, 14:20', status: 'Nouveau', sColor: 'text-purple-500 bg-purple-50' },
        ].map((row, i) => (
          <div key={i} className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-merveille-dark">{row.user}</span>
              <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${row.sColor}`}>
                {row.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-light">{row.action}</p>
            <p className="text-[10px] text-gray-400 font-medium">{row.date}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export const AdminUsersView = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Gestion des Utilisateurs</h3>
        <button className="btn-primary py-2 px-6 text-xs shadow-lg shadow-merveille-orange/20">NOUVEL UTILISATEUR</button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-merveille-orange border-t-transparent rounded-full"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Date d'inscription</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-merveille-dark">{u.display_name || 'Utilisateur'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                      u.role === 'proprietaire' ? 'bg-blue-50 text-blue-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {u.role || 'Locataire'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.phone || '-'}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <button className="text-[10px] font-black text-merveille-orange uppercase tracking-widest hover:underline">Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-light">Aucun utilisateur trouvé sur la plateforme.</p>
        </div>
      )}
    </div>
  );
};

export const AdminPropertiesView = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Parc Immobilier</h3>
        <button className="btn-primary py-2 px-6 text-xs">NOUVEAU BIEN</button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-merveille-orange border-t-transparent rounded-full"></div>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((p, i) => (
            <div key={i} className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:border-merveille-orange/30 transition-all">
              <div className="relative h-48">
                <img 
                  src={p.image_url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"} 
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-merveille-dark">
                    {p.status || 'Disponible'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-merveille-dark mb-1">{p.title}</h4>
                <p className="text-xs text-gray-400 mb-4">{p.location}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-sm font-black text-merveille-orange">{p.price?.toLocaleString()} FCFA</span>
                  <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-merveille-dark">Gérer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-light">Aucune propriété répertoriée pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export const AdminContractsView = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllContracts = async () => {
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select('*, profiles(display_name)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setContracts(data || []);
      } catch (err) {
        console.error('Error fetching admin contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContracts();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Contrats de Gestion et Baux</h3>
        <button className="btn-primary py-2 px-6 text-xs">GÉNÉRER UN CONTRAT</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-merveille-orange border-t-transparent rounded-full"></div>
        </div>
      ) : contracts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Titre / Réf</th>
                <th className="px-6 py-4">Partie Prenante</th>
                <th className="px-6 py-4">Date de Signature</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contracts.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-merveille-dark">{c.title}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{c.reference || c.id.slice(0, 8).toUpperCase()}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.profiles?.display_name || 'Utilisateur'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.signed_at || c.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
                      Validé
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-gray-400 hover:text-merveille-orange">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-merveille-orange">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-light">Aucun contrat enregistré dans la base de données.</p>
        </div>
      )}
    </div>
  );
};

export const AdminFinanceView = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPayments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*, profiles(display_name)')
          .order('date', { ascending: false });

        if (error) throw error;
        setPayments(data || []);
      } catch (err) {
        console.error('Error fetching admin payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPayments();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Rapports Financiers Globaux</h3>
        <button className="btn-primary py-2 px-6 text-xs flex items-center">
          EXPORTER TOUT <Download className="ml-2 h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-merveille-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Génération du rapport financier...</p>
        </div>
      ) : payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Méthode</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">ID Trans.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {payments.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-merveille-dark">{p.profiles?.display_name || 'Inconnu'}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{p.tenant_id?.slice(0, 8)}...</p>
                  </td>
                  <td className="px-6 py-4">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 font-black">{p.amount.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-xs font-bold uppercase text-gray-400">{p.method}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{p.invoice_ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-light">Aucune transaction enregistrée sur la plateforme.</p>
        </div>
      )}
    </div>
  );
};

export const AdminProfile = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleUpdate = async () => {
    if (!user) return;
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await refreshProfile();
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
    } catch (err: any) {
      console.error('Update error:', err);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour : ' + err.message });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 max-w-4xl">
      <h3 className="text-2xl font-black mb-8">Profil Administrateur</h3>
      
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Nom de l'administrateur</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Email</label>
            <input type="email" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold opacity-70" defaultValue={user?.email || ''} disabled />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Niveau d'Accès</label>
            <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold opacity-50 uppercase" defaultValue={profile?.role || 'Admin'} disabled />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Dernière Connexion</label>
            <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold opacity-50" defaultValue="Aujourd'hui, 08:00" disabled />
          </div>
        </div>
      </div>
      <button 
        onClick={handleUpdate}
        disabled={isUpdating}
        className="btn-primary py-4 px-10 text-xs mt-10 disabled:opacity-50"
      >
        {isUpdating ? 'ENREGISTREMENT...' : 'SAUVEGARDER LES MODIFICATIONS'}
      </button>
    </div>
  );
};

export const AdminSettingsView = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 max-w-4xl">
      <h3 className="text-2xl font-black mb-8">Paramètres Système</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center">
            <div className="bg-merveille-orange/10 p-3 rounded-xl mr-4">
              <SettingsIcon className="h-6 w-6 text-merveille-orange" />
            </div>
            <div>
              <p className="font-bold text-merveille-dark">Mode Maintenance</p>
              <p className="text-xs text-gray-400">Rendre le site inaccessible pour travaux.</p>
            </div>
          </div>
          <button 
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-merveille-orange' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center">
            <div className="bg-blue-500/10 p-3 rounded-xl mr-4">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-merveille-dark">Inscriptions Ouvertes</p>
              <p className="text-xs text-gray-400">Permettre aux nouveaux utilisateurs de s'inscrire.</p>
            </div>
          </div>
          <button 
            onClick={() => setAllowRegistration(!allowRegistration)}
            className={`w-12 h-6 rounded-full transition-colors relative ${allowRegistration ? 'bg-merveille-orange' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${allowRegistration ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <button className="flex items-center justify-center p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-widest text-merveille-dark">
            <Database className="h-4 w-4 mr-2 text-gray-400" /> Sauvegarde DB
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-widest text-merveille-dark">
            <Lock className="h-4 w-4 mr-2 text-gray-400" /> Logs Sécurité
          </button>
        </div>
      </div>
      
      <div className="mt-10 pt-10 border-t border-gray-100 flex justify-between items-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Version v1.0.4 - Mer'Veille Real Estate</p>
        <button className="text-[10px] font-black text-merveille-orange uppercase tracking-widest hover:underline">Vérifier mises à jour</button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const sidebarItems = [
    { name: 'Vue d\'ensemble', path: '/dashboard/admin', icon: BarChart3 },
    { name: 'Profil Admin', path: '/dashboard/admin/profil', icon: UserIcon },
    { name: 'Utilisateurs', path: '/dashboard/admin/users', icon: Users },
    { name: 'Propriétés', path: '/dashboard/admin/properties', icon: Building2 },
    { name: 'Contrats', path: '/dashboard/admin/contracts', icon: FileText },
    { name: 'Finance', path: '/dashboard/admin/finance', icon: CreditCard },
    { name: 'Paramètres', path: '/dashboard/admin/parametres', icon: SettingsIcon },
  ];

  return (
    <DashboardLayout items={sidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
