import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowLeft, Upload, FileText, User, Home, Building2, PencilRuler, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const steps = [
  { id: 1, title: 'Type de Projet' },
  { id: 2, title: 'Caractéristiques' },
  { id: 3, title: 'Coordonnées' },
  { id: 4, title: 'Récapitulatif' }
];

const projectTypes = [
  { id: 'construction', label: 'Construction', icon: Building2, desc: 'Bâtir une maison, un immeuble ou une villa.' },
  { id: 'architecture', label: 'Architecture', icon: PencilRuler, desc: 'Conception de plans 2D/3D et études techniques.' },
  { id: 'renovation', label: 'Rénovation', icon: Home, desc: 'Travaux de rénovation, extension ou ravalement.' },
];

const Devis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    surface: '',
    budget: '',
    details: '',
    name: '',
    email: '',
    phone: '',
  });

  const handleNext = () => {
    if (currentStep === 1 && !formData.type) {
      setError('Veuillez sélectionner un type de projet');
      return;
    }
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  const handlePrev = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    console.log('Tentative d\'envoi vers Supabase...', formData);
    
    // Protection contre le chargement infini
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TIMEOUT_LIMIT')), 15000)
    );

    try {
      // Conversion sécurisée de la surface
      const surfaceValue = formData.surface ? parseFloat(formData.surface.replace(',', '.')) : null;
      const finalSurface = isNaN(surfaceValue as number) ? null : surfaceValue;

      const submissionPromise = supabase
        .from('quotes')
        .insert([
          {
            type: formData.type,
            surface: finalSurface,
            budget: formData.budget,
            details: formData.details,
            client_name: formData.name,
            client_email: formData.email,
            client_phone: formData.phone,
            status: 'pending',
            created_at: new Date().toISOString(),
          }
        ]);

      // On attend soit la réponse de Supabase soit le timeout
      const result: any = await Promise.race([submissionPromise, timeoutPromise]);
      
      console.log('Résultat brut Supabase:', result);

      if (result && result.error) {
        throw result.error;
      }
      
      console.log('Envoi réussi');
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Erreur détaillée lors de la soumission:', err);
      
      let errorMessage = 'Impossible d\'envoyer votre demande. ';
      
      if (err.message === 'TIMEOUT_LIMIT') {
        errorMessage += 'Délai d\'attente dépassé (15s). Cela arrive souvent si vos clés Supabase sont incorrectes ou si la table "quotes" n\'est pas accessible.';
      } else if (err.code === '42P01') {
        errorMessage += 'La table "quotes" n\'existe pas dans votre base de données Supabase. Créez-la avec les bonnes colonnes.';
      } else if (err.code === 'PGRST301') {
        errorMessage += 'Erreur d\'authentification Supabase. Vérifiez votre clé anon.';
      } else if (err.message) {
        errorMessage += `Détails: ${err.message}`;
      } else {
        errorMessage += 'Veuillez vérifier votre connexion ou la configuration de la base de données.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = steps.length;

  if (isSuccess) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-merveille-gray/30 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black mb-4">Demande Envoyée !</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Merci {formData.name}, votre demande de devis pour un projet de {formData.type} a bien été enregistrée. Un conseiller vous recontactera très prochainement.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-primary w-full py-5"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-merveille-gray/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${currentStep >= step.id ? 'bg-merveille-orange text-white shadow-lg shadow-merveille-orange/30' : 'bg-white text-gray-300 border border-gray-200'}`}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span className={`text-[10px] mt-2 uppercase font-black tracking-widest ${currentStep >= step.id ? 'text-merveille-dark' : 'text-gray-400'}`}>{step.title}</span>
              </div>
            ))}
          </div>
          <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-merveille-orange transition-all duration-500"
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-12 border border-gray-100 min-h-[500px] flex flex-col relative overflow-hidden">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 text-sm font-bold"
            >
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-grow"
              >
                <h2 className="text-3xl font-black mb-4">Quel est votre projet ?</h2>
                <p className="text-gray-500 mb-10">Sélectionnez le service principal dont vous avez besoin.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projectTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setFormData({ ...formData, type: t.id });
                        setError(null);
                      }}
                      className={`p-8 rounded-3xl border-2 text-left transition-all group ${formData.type === t.id ? 'border-merveille-orange bg-merveille-orange/5' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <t.icon className={`h-10 w-10 mb-6 transition-colors ${formData.type === t.id ? 'text-merveille-orange' : 'text-gray-400 group-hover:text-merveille-dark'}`} />
                      <h4 className="font-black mb-2">{t.label}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-grow"
              >
                <h2 className="text-3xl font-black mb-4">Parlez-nous des détails</h2>
                <p className="text-gray-500 mb-10">Plus vous serez précis, plus notre estimation sera juste.</p>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Surface estimée (m²)</label>
                      <input 
                        type="number" 
                        value={formData.surface}
                        onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 transition-all outline-none" 
                        placeholder="Ex: 250"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget approximatif (FCFA)</label>
                      <input 
                        type="text" 
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 transition-all outline-none" 
                        placeholder="Ex: 50.000.000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description détaillée</label>
                    <textarea 
                      rows={4}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 transition-all outline-none resize-none" 
                      placeholder="Décrivez votre projet (emplacement, nombre de pièces, finitions souhaitées...)"
                    />
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <Upload className="h-10 w-10 text-gray-300 mx-auto mb-4 group-hover:text-merveille-orange transition-colors" />
                    <p className="text-sm font-bold text-gray-500">Glissez vos plans ou photos ici</p>
                    <p className="text-xs text-gray-400 mt-2">Formats acceptés : PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-grow"
              >
                <h2 className="text-3xl font-black mb-4">Comment vous recontacter ?</h2>
                <p className="text-gray-500 mb-10">Un conseiller MerveilleBAT vous appellera sous 48h.</p>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom Complet</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 transition-all outline-none" 
                      placeholder="Ex: Samba Diop"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 transition-all outline-none" 
                        placeholder="samba@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Téléphone (WhatsApp)</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-merveille-orange/20 transition-all outline-none" 
                        placeholder="+221 ..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-grow text-center flex flex-col items-center justify-center"
              >
                <div className="bg-merveille-orange/10 p-6 rounded-full mb-8">
                  <FileText className="h-16 w-16 text-merveille-orange" />
                </div>
                <h2 className="text-3xl font-black mb-4">Presque terminé !</h2>
                <p className="text-gray-500 mb-10 max-w-md">Vérifiez vos informations avant de soumettre votre demande.</p>
                <div className="w-full bg-gray-50 rounded-3xl p-8 space-y-4 text-left border border-gray-100 mb-10">
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-xs uppercase font-bold text-gray-400">Service</span>
                    <span className="font-bold text-merveille-dark capitalize">{formData.type || 'Non spécifié'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-xs uppercase font-bold text-gray-400">Client</span>
                    <span className="font-bold text-merveille-dark">{formData.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs uppercase font-bold text-gray-400">Contact</span>
                    <span className="font-bold text-merveille-dark tracking-tighter">{formData.phone || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-auto pt-10 flex justify-between gap-6">
            {currentStep > 1 && (
              <button 
                onClick={handlePrev}
                disabled={isSubmitting}
                className="flex items-center text-gray-400 font-black uppercase tracking-widest text-xs hover:text-merveille-dark transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" /> Retour
              </button>
            )}
            <div className="ml-auto flex gap-4 w-full md:w-auto">
              {currentStep < 4 ? (
                <button 
                  onClick={handleNext}
                  className="btn-primary flex items-center justify-center w-full md:w-auto px-12 py-5"
                >
                  Continuer <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center justify-center w-full md:w-auto px-12 py-5 bg-merveille-dark hover:bg-black disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>Envoyer la Demande <Check className="ml-2 h-5 w-5" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devis;
