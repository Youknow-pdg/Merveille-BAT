import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Home, FileText, CreditCard, Wrench, MessageSquare, Clock, Download, ExternalLink, User as UserIcon, Settings, Bell, Shield, Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export const TenantOverview = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [activeContract, setActiveContract] = useState<any>(null);
  const [latestIntervention, setLatestIntervention] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Fetch recent payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('tenantId', user.id)
          .order('date', { ascending: false })
          .limit(3);

        if (paymentsError) throw paymentsError;
        setPayments(paymentsData || []);

        // Fetch active contract for next rent info
        const { data: contractData, error: contractError } = await supabase
          .from('contracts')
          .select('*, properties!inner(title)')
          .eq('tenantId', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (contractError) throw contractError;
        setActiveContract(contractData);

        // Fetch latest intervention
        const { data: interventionData, error: interventionError } = await supabase
          .from('interventions')
          .select('*')
          .eq('requesterId', user.id)
          .order('createdAt', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (interventionError) throw interventionError;
        setLatestIntervention(interventionData);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getNextDueDate = () => {
    if (!activeContract?.startDate) return 'Non défini';
    
    const startDate = new Date(activeContract.startDate);
    const dayOfMonth = startDate.getDate();
    const today = new Date();
    
    let nextDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
    
    // If today is past the due day this month, move to next month
    if (today.getDate() > dayOfMonth) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    
    return nextDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-merveille-dark rounded-3xl p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Bienvenue, {profile?.displayName?.split(' ')[0] || 'Locataire'} !</h2>
          <p className="text-white/60 font-light max-w-sm text-sm">
            Gérez facilement vos paiements, téléchargez vos quittances et suivez vos demandes d'intervention.
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-start md:items-end md:text-right">
          <div className="text-[10px] uppercase font-black text-merveille-orange tracking-[0.2em] mb-2">Prochain Loyer</div>
          <div className="text-3xl md:text-4xl font-black">
            {activeContract ? `${activeContract.rentAmount.toLocaleString()} FCFA` : '--- FCFA'}
          </div>
          <div className="text-white/40 text-[10px] mt-2 uppercase tracking-widest font-bold">
            Dû le {activeContract ? getNextDueDate() : 'Aucun bail actif'}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-merveille-orange/10 -skew-x-12 translate-x-20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Card: Payments */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h3 className="text-lg font-black tracking-tight">Historique des Paiements</h3>
            <button 
              className="btn-primary py-2 px-6 text-xs flex items-center w-full sm:w-auto justify-center"
              onClick={() => navigate('/dashboard/locataire/payments')}
            >
              PAYER MAINTENANT <CreditCard className="ml-2 h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-6 w-6 border-2 border-merveille-orange border-t-transparent rounded-full"></div>
              </div>
            ) : payments.length > 0 ? (
              payments.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-merveille-orange/30 transition-all gap-4">
                  <div className="flex items-center">
                    <div className="bg-green-500/10 p-3 rounded-xl mr-4">
                      <Download className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-merveille-dark">{p.amount.toLocaleString()} FCFA</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                        {new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <p className="text-xs font-bold text-merveille-dark">{p.method}</p>
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">{p.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 italic text-gray-400 text-sm">
                Aucun paiement récent trouvé.
              </div>
            )}
          </div>
        </div>

        {/* Side Card: Maintenance */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black tracking-tight">Interventions</h3>
            <button className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-all">
              <Clock className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="flex-grow flex flex-col space-y-6">
            {latestIntervention && (
              <div className={`p-4 rounded-2xl border ${
                latestIntervention.status === 'pending' ? 'bg-blue-50 border-blue-100' :
                latestIntervention.status === 'in_progress' ? 'bg-orange-50 border-orange-100' :
                'bg-green-50 border-green-100'
              }`}>
                <div className={`flex items-center mb-2 ${
                  latestIntervention.status === 'pending' ? 'text-blue-600' :
                  latestIntervention.status === 'in_progress' ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  <Wrench className="h-4 w-4 mr-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {latestIntervention.status === 'pending' ? 'En Attente' : 
                     latestIntervention.status === 'in_progress' ? 'En Cours' : 'Terminé'}
                  </span>
                </div>
                <p className="text-sm font-bold mb-1">{latestIntervention.type || 'Intervention'}</p>
                <p className="text-[10px] text-gray-400 line-clamp-2">{latestIntervention.description}</p>
              </div>
            )}
            
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-sm text-gray-400 mb-6">Un souci technique dans votre bien ?</p>
              <button 
                onClick={() => navigate('/dashboard/locataire/maintenance')}
                className="w-full btn-secondary text-xs py-3"
              >
                SIGNALER UN PROBLÈME
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Info */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-10 items-center justify-between">
        <div className="flex items-center">
          <div className="bg-merveille-dark p-5 rounded-3xl mr-8">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-black">Mon Contrat de Bail</h4>
            <p className="text-sm text-gray-400">
              {activeContract 
                ? `Référence : ${activeContract.id.slice(0, 8).toUpperCase()} | ${activeContract.properties?.title || 'Propriété'}`
                : 'Aucun contrat de bail actif.'}
            </p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            disabled={!activeContract}
            className="flex-grow md:flex-grow-0 btn-secondary flex items-center justify-center py-3 px-8 text-xs disabled:opacity-50"
          >
            LIRE <ExternalLink className="ml-2 h-4 w-4" />
          </button>
          <button 
            disabled={!activeContract}
            className="flex-grow md:flex-grow-0 btn-primary flex items-center justify-center py-3 px-8 text-xs disabled:opacity-50"
          >
            TÉLÉCHARGER <Download className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TenantContractView = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('tenantId', user.id)
          .order('createdAt', { ascending: false });

        if (error) throw error;
        setContracts(data || []);
      } catch (err) {
        console.error('Error fetching tenant contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user]);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <h3 className="text-2xl font-black mb-8">Détails de mon Contrat</h3>
      
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
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-merveille-dark">{contract.title || 'Contrat de Location'}</h4>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Référence : {contract.reference || contract.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-[10px] text-gray-400 mt-1 italic">Signé le {new Date(contract.startDate || contract.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none btn-secondary py-3 px-6 text-[10px]">
                  CONSULTER <ExternalLink className="ml-2 h-3 w-3" />
                </button>
                <button className="flex-1 md:flex-none btn-primary py-3 px-6 text-[10px]">
                  TÉLÉCHARGER <Download className="ml-2 h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-light">Aucun contrat de bail actif n'a été trouvé.</p>
        </div>
      )}
    </div>
  );
};

export const TenantPaymentsView = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentAmount] = useState(250000);

  const fetchPayments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('tenantId', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const handleSimulatePayment = async () => {
    if (!user) return;
    setIsPaying(true);
    
    // Simulation d'un délai de passerelle de paiement
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const newPayment = {
        tenantId: user.id,
        amount: paymentAmount,
        date: new Date().toISOString(),
        method: 'Wave / Orange Money',
        status: 'paid',
        contractId: 'demo-contract-id' // Ideally we'd have the real one
      };

      const { error } = await supabase
        .from('payments')
        .insert([newPayment]);

      if (error) throw error;
      
      await fetchPayments();
      setShowPaymentModal(false);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Paiements et Factures</h3>
        <button 
          onClick={() => setShowPaymentModal(true)}
          className="btn-primary py-3 px-8 text-xs flex items-center"
        >
          EFFECTUER UN PAIEMENT <CreditCard className="ml-2 h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-merveille-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de vos transactions...</p>
        </div>
      ) : payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Méthode</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {payments.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-merveille-dark">{p.invoice_ref || `FAC-${p.id.slice(0,5)}`}</td>
                  <td className="px-6 py-4">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 font-bold">{p.amount.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-xs font-bold uppercase text-gray-400">{p.method}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-merveille-orange hover:text-merveille-dark transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-light">Aucune transaction trouvée.</p>
        </div>
      )}

      {/* Payment Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h4 className="text-xl font-black mb-6">Régler mon loyer</h4>
            <div className="bg-gray-50 p-6 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Montant à payer</span>
                <span className="text-lg font-black">{paymentAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="text-[10px] text-gray-400 leading-relaxed italic">
                * Le paiement sera simulé pour cette version de démonstration.
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <label className="flex items-center p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="method" defaultChecked className="mr-4 accent-merveille-orange" />
                <span className="text-sm font-bold">Wave / Orange Money</span>
              </label>
              <label className="flex items-center p-4 border border-gray-100 rounded-2xl opacity-50 cursor-not-allowed">
                <input type="radio" name="method" disabled className="mr-4" />
                <span className="text-sm font-bold">Carte Bancaire (Bientôt)</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 btn-secondary py-4 text-xs"
              >
                ANNULER
              </button>
              <button 
                onClick={handleSimulatePayment}
                disabled={isPaying}
                className="flex-1 btn-primary py-4 text-xs flex items-center justify-center disabled:opacity-50"
              >
                {isPaying ? 'TRAITEMENT...' : 'PAYER MAINTENANT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TenantMaintenanceView = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contract, setContract] = useState<any>(null);

  const fetchTenantContext = async () => {
    if (!user) return;
    try {
      // Get the active contract to find the propertyId
      const { data, error } = await supabase
        .from('contracts')
        .select('propertyId, id')
        .eq('tenantId', user.id)
        .eq('status', 'active')
        .single();
      
      if (!error && data) {
        setContract(data);
      }
    } catch (err) {
      console.error('Error fetching tenant context:', err);
    }
  };

  const fetchTickets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select('*')
        .eq('requesterId', user.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantContext();
    fetchTickets();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !description) return;
    
    // Check if we have a propertyId
    if (!contract?.propertyId) {
      alert('Aucun contrat de bail actif trouvé. Vous ne pouvez pas signaler d\'incident sans bail.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('interventions')
        .insert([{
          requesterId: user.id,
          propertyId: contract.propertyId,
          type: title,
          description: description,
          status: 'pending',
          createdAt: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      
      console.log('Intervention submitted:', data);
      setTitle('');
      setDescription('');
      setShowModal(false);
      await fetchTickets();
    } catch (err: any) {
      console.error('Submit error:', err);
      alert(`Erreur lors de l'envoi du signalement: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black">Interventions et Maintenance</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary py-3 px-8 text-xs flex items-center"
        >
          SIGNALER UN PROBLÈME <Wrench className="ml-2 h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-merveille-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de vos demandes...</p>
        </div>
      ) : tickets.length > 0 ? (
        <div className="space-y-6">
          {tickets.map((t, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start">
                <div className={`p-4 rounded-xl mr-5 ${
                  t.status === 'pending' ? 'bg-blue-50 text-blue-500' :
                  t.status === 'in_progress' ? 'bg-orange-50 text-orange-500' :
                  'bg-green-50 text-green-500'
                }`}>
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-merveille-dark">{t.type || 'Intervention'}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{t.description}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-mono uppercase tracking-widest">
                    Posté le {new Date(t.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  t.status === 'pending' ? 'bg-blue-100 text-blue-600' :
                  t.status === 'in_progress' ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {t.status === 'pending' ? 'En attente' : t.status === 'in_progress' ? 'En cours' : 'Terminé'}
                </span>
                <button className="text-gray-300 hover:text-merveille-orange">
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-light">Aucun incident signalé pour le moment.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl">
            <h4 className="text-xl font-black mb-8">Signaler un Incident</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Titre du problème</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Fuite d'eau, Panne électrique..."
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Description détaillée</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Décrivez précisément le souci rencontré..."
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary py-4 text-xs font-black"
                >
                  ANNULER
                </button>
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-1 btn-primary py-4 text-xs font-black disabled:opacity-50"
                >
                  {isSubmitting ? 'ENVOI...' : 'ENVOYER LE SIGNALEMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const TenantProfile = () => {
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
          phone: phone
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
      <h3 className="text-2xl font-black mb-8">Mon Profil</h3>
      
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Nom Complet</label>
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
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Téléphone</label>
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
        {isUpdating ? 'ENREGISTREMENT...' : 'ENREGISTRER LES MODIFICATIONS'}
      </button>
    </div>
  );
};

export const TenantSettingsView = () => {
  const [notifications, setNotifications] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 max-w-4xl">
      <h3 className="text-2xl font-black mb-8">Paramètres</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center">
            <div className="bg-merveille-orange/10 p-3 rounded-xl mr-4">
              <Bell className="h-6 w-6 text-merveille-orange" />
            </div>
            <div>
              <p className="font-bold text-merveille-dark">Notifications Email</p>
              <p className="text-xs text-gray-400">Recevez vos quittances et alertes par email.</p>
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
              <Smartphone className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-merveille-dark">Alertes Maintenance</p>
              <p className="text-xs text-gray-400">Notifications SMS pour les interventions prévues.</p>
            </div>
          </div>
          <button 
            onClick={() => setMaintenanceAlerts(!maintenanceAlerts)}
            className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceAlerts ? 'bg-merveille-orange' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${maintenanceAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center">
            <div className="bg-green-500/10 p-3 rounded-xl mr-4">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-merveille-dark">Sécurité du Compte</p>
              <p className="text-xs text-gray-400">Activer l'authentification à deux facteurs.</p>
            </div>
          </div>
          <button className="text-xs font-black uppercase text-merveille-orange tracking-widest hover:underline">
            CONFIGURER
          </button>
        </div>
      </div>
      
      <div className="mt-10 pt-10 border-t border-gray-100">
        <h4 className="text-sm font-black mb-4">ZONE DE DANGER</h4>
        <button className="text-xs font-black text-red-500 uppercase tracking-widest border border-red-100 px-6 py-3 rounded-xl hover:bg-red-50 transition-colors">
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

const TenantDashboard = () => {
  const sidebarItems = [
    { name: 'Mon Espace', path: '/dashboard/locataire', icon: Home },
    { name: 'Mon Profil', path: '/dashboard/locataire/profil', icon: UserIcon },
    { name: 'Maintenance', path: '/dashboard/locataire/maintenance', icon: Wrench },
    { name: 'Contrat', path: '/dashboard/locataire/contract', icon: FileText },
    { name: 'Paiements', path: '/dashboard/locataire/payments', icon: CreditCard },
    { name: 'Paramètres', path: '/dashboard/locataire/parametres', icon: Settings },
  ];

  return (
    <DashboardLayout items={sidebarItems}>
      <Outlet />
    </DashboardLayout>
  );
};

export default TenantDashboard;
