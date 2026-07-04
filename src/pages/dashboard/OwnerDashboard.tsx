import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Home, Users, CreditCard, FileText, BarChart3, PlusCircle, ArrowUpRight, TrendingUp, Download, Building2, User as UserIcon, Settings, Bell, Smartphone, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export const OwnerOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: '0 F',
    occupancyRate: '0%',
    pendingRents: '0 F',
    maintenanceRequests: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        // Fetch all payments for this owner
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('amount')
          .eq('owner_id', user.id);
        
        const total = (paymentsData || []).reduce((acc, curr) => acc + curr.amount, 0);
        
        setStats({
          totalRevenue: `${total.toLocaleString()} F`,
          occupancyRate: '92%', // Mocked for now
          pendingRents: '450,000 F', // Mocked for now
          maintenanceRequests: '3' // Mocked for now
        });
      } catch (err) {
        console.error('Error fetching owner stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Finance Recap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Revenus Totaux', val: stats.totalRevenue, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
          { label: 'Taux d\'Occupation', val: stats.occupancyRate, icon: Home, color: 'bg-blue-100 text-blue-600' },
          { label: 'Loyers en Attente', val: stats.pendingRents, icon: CreditCard, color: 'bg-orange-100 text-orange-600' },
          { label: 'Demandes Maintenance', val: stats.maintenanceRequests, icon: Users, color: 'bg-red-100 text-red-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <button className="text-gray-300 hover:text-merveille-orange">
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</h4>
            <p className="text-2xl font-black text-merveille-dark">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property List Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-black tracking-tight">Mes Propriétés</h3>
            <button className="btn-primary py-2 px-6 text-xs flex items-center w-full sm:w-auto justify-center">
              AJOUTER UN BIEN <PlusCircle className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Table Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-6 md:px-8 py-4">Désignation</th>
                  <th className="px-6 md:px-8 py-4">Statut</th>
                  <th className="px-6 md:px-8 py-4">Revenu Brut</th>
                  <th className="px-6 md:px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {[
                  { name: 'Villa Oasis (Saly)', status: 'Occupé', rent: '450,000 F', tenant: 'Samba Diop' },
                  { name: 'Appart. Diamond 2', status: 'Occupé', rent: '300,000 F', tenant: 'Fatou Ndiaye' },
                  { name: 'Studio Plateau', status: 'Vacant', rent: '150,000 F', tenant: '-' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 md:px-8 py-5">
                      <p className="font-bold text-merveille-dark">{row.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Locataire : {row.tenant}</p>
                    </td>
                    <td className="px-6 md:px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.status === 'Occupé' ? 'text-green-500 bg-green-50' : 'text-orange-500 bg-orange-50'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-5 font-bold text-merveille-dark">{row.rent}</td>
                    <td className="px-6 md:px-8 py-5">
                      <button className="text-gray-300 hover:text-merveille-blue transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card View Mobile */}
          <div className="md:hidden divide-y divide-gray-50">
            {[
              { name: 'Villa Oasis (Saly)', status: 'Occupé', rent: '450,000 F', tenant: 'Samba Diop' },
              { name: 'Appart. Diamond 2', status: 'Occupé', rent: '300,000 F', tenant: 'Fatou Ndiaye' },
              { name: 'Studio Plateau', status: 'Vacant', rent: '150,000 F', tenant: '-' },
            ].map((row, i) => (
              <div key={i} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-merveille-dark">{row.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Locataire : {row.tenant}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${row.status === 'Occupé' ? 'text-green-500 bg-green-50' : 'text-orange-500 bg-orange-50'}`}>
                    {row.status}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Revenu Brut</span>
                  <span className="text-sm font-black text-merveille-dark">{row.rent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Info: Analytics Summary */}
        <div className="bg-merveille-dark rounded-3xl p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="h-8 w-8 text-merveille-orange" />
              <h3 className="text-2xl font-black">Patrimoine</h3>
            </div>
            <p className="text-white/60 font-light text-sm leading-relaxed mb-10">
              L'ensemble de vos biens est valorisé à environ <span className="text-white font-bold">120M FCFA</span>. Votre rentabilité moyenne est de 8.2% annuelle.
            </p>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40 uppercase tracking-widest">Entretien Prévu</span>
                <span className="font-bold">15 Juin</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40 uppercase tracking-widest">Taxes à Payer</span>
                <span className="font-bold text-orange-400">En retard</span>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 py-4 rounded-2xl text-xs font-bold transition-all uppercase tracking-widest mt-12">
            Télécharger Rapport
          </button>
        </div>
      </div>
    </div>
  );
};

export const OwnerPropertiesView = () => (
  <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-2xl font-black">Mon Patrimoine</h3>
      <button className="btn-primary py-2 px-6 text-xs">AJOUTER UN BIEN</button>
    </div>
    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
      <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-400 font-light">Détails de vos propriétés en cours de chargement...</p>
    </div>
  </div>
);

export const OwnerTenantsView = () => (
  <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
    <h3 className="text-2xl font-black mb-8">Mes Locataires</h3>
    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-400 font-light">Liste de vos locataires et baux actifs en attente...</p>
    </div>
  </div>
);

export const OwnerFinanceView = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOwnerPayments = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*, profiles(display_name)')
          .eq('owner_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;
        setPayments(data || []);
      } catch (err) {
        console.error('Error fetching owner payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOwnerPayments();
  }, [user]);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Gestion Financière</h3>
        <button className="btn-primary py-2 px-6 text-xs flex items-center">
          EXPORTER RAPPORT <Download className="ml-2 h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-merveille-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Veuillez patienter...</p>
        </div>
      ) : payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Locataire</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Référence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {payments.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-merveille-dark">{p.profiles?.display_name || 'Locataire'}</td>
                  <td className="px-6 py-4">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 font-bold">{p.amount.toLocaleString()} FCFA</td>
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
          <p className="text-gray-400 font-light">Aucun revenu enregistré pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export const OwnerContractsView = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerContracts = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select('*, profiles(display_name)')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setContracts(data || []);
      } catch (err) {
        console.error('Error fetching owner contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerContracts();
  }, [user]);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Mes Contrats de Gestion</h3>
        <button className="btn-primary py-2 px-6 text-xs shadow-lg shadow-merveille-orange/20">
          DEMANDER UN NOUVEAU CONTRAT
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-merveille-orange border-t-transparent rounded-full"></div>
        </div>
      ) : contracts.length > 0 ? (
        <div className="space-y-6">
          {contracts.map((contract, i) => (
            <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-merveille-orange/30 transition-all gap-6">
              <div className="flex items-center">
                <div className="bg-merveille-dark p-4 rounded-2xl mr-6">
                  <FileText className="h-8 text-white w-8" />
                </div>
                <div>
                  <h4 className="font-bold text-merveille-dark">{contract.title || 'Contrat de Gestion'}</h4>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                    Locataire : {contract.profiles?.display_name || 'En attente'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                    Réf : {contract.reference || contract.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none btn-secondary py-3 px-6 text-[10px]">
                  CONSULTER
                </button>
                <button className="flex-1 md:flex-none btn-primary py-3 px-6 text-[10px]">
                  TÉLÉCHARGER
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-light">Aucun contrat n'a été trouvé pour vos biens.</p>
        </div>
      )}
    </div>
  );
};

export const OwnerProfile = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
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
          phone: phone,
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
      <h3 className="text-2xl font-black mb-8">Mon Profil Propriétaire</h3>
      
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Nom / Entreprise</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Email</label>
            <input 
              type="email" 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold opacity-70" 
              defaultValue={user?.email || ''} 
              disabled 
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Téléphone Professionnel</label>
            <input 
              type="tel" 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Rôle</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold opacity-70 capitalize" 
              defaultValue={profile?.role || ''} 
              disabled 
            />
          </div>
        </div>
      </div>
      <button 
        onClick={handleUpdate}
        disabled={isUpdating}
        className="btn-primary py-4 px-10 text-xs mt-10 disabled:opacity-50"
      >
        {isUpdating ? 'ENREGISTREMENT...' : 'METTRE À JOUR LE PROFIL'}
      </button>
    </div>
  );
};

export const OwnerSettingsView = () => {
  const [notifications, setNotifications] = useState(true);
  const [financeAlerts, setFinanceAlerts] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 max-w-4xl">
      <h3 className="text-2xl font-black mb-8">Paramètres de Gestion</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center">
            <div className="bg-merveille-orange/10 p-3 rounded-xl mr-4">
              <Bell className="h-6 w-6 text-merveille-orange" />
            </div>
            <div>
              <p className="font-bold text-merveille-dark">Notifications de Paiement</p>
              <p className="text-xs text-gray-400">Alertes temps réel lors de la réception d'un loyer.</p>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-merveille-orange' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center">
            <div className="bg-blue-500/10 p-3 rounded-xl mr-4">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-merveille-dark">Rapports Automatiques</p>
              <p className="text-xs text-gray-400">Synthèse mensuelle par email de votre patrimoine.</p>
            </div>
          </div>
          <button 
            onClick={() => setFinanceAlerts(!financeAlerts)}
            className={`w-12 h-6 rounded-full transition-colors relative ${financeAlerts ? 'bg-merveille-orange' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${financeAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center">
            <div className="bg-green-500/10 p-3 rounded-xl mr-4">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-merveille-dark">Visibilité Publique</p>
              <p className="text-xs text-gray-400">Afficher vos biens sur la plateforme Location.</p>
            </div>
          </div>
          <button className="text-xs font-black uppercase text-merveille-orange tracking-widest hover:underline">
            GÉRER
          </button>
        </div>
      </div>
    </div>
  );
};

const OwnerDashboard = () => {
  const sidebarItems = [
    { name: 'Vue d\'ensemble', path: '/dashboard/proprietaire', icon: BarChart3 },
    { name: 'Mon Profil', path: '/dashboard/proprietaire/profil', icon: UserIcon },
    { name: 'Mes Biens', path: '/dashboard/proprietaire/properties', icon: Home },
    { name: 'Contrats', path: '/dashboard/proprietaire/contracts', icon: FileText },
    { name: 'Locataires', path: '/dashboard/proprietaire/tenants', icon: Users },
    { name: 'Finance', path: '/dashboard/proprietaire/finance', icon: CreditCard },
    { name: 'Paramètres', path: '/dashboard/proprietaire/parametres', icon: Settings },
  ];

  return (
    <DashboardLayout items={sidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default OwnerDashboard;
