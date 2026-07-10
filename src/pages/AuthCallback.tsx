import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [status, setStatus] = useState('Authentification en cours...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log('AuthCallback: Début de la vérification de session...');
        
        // Supabase client automatiquement échange le code ou le hash en arrière-plan
        // et établit la session. getSession() renvoie la session active après cet échange.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          // Attendre un tout petit peu au cas où l'échange de token prendrait plus de temps
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
          if (retryError) throw retryError;
          if (!retrySession) {
            throw new Error('Aucune session active n\'a pu être récupérée.');
          }
        }
        
        setStatus('Connexion réussie !');
        console.log('AuthCallback: Session récupérée avec succès.');
        
        if (window.opener) {
          window.opener.postMessage({ type: 'SUPABASE_AUTH_SUCCESS' }, '*');
          setTimeout(() => {
            window.close();
          }, 800);
        } else {
          window.location.href = '/';
        }
      } catch (err: any) {
        console.error('AuthCallback Error:', err);
        setError(err.message || 'Erreur lors de la récupération de la session.');
        
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            window.location.href = '/login';
          }
        }, 3000);
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <div className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-xl border border-gray-100">
        {!error ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-6"></div>
            <h1 className="text-xl font-bold mb-2 text-gray-900">{status}</h1>
            <p className="text-sm text-gray-400">Cette fenêtre se fermera automatiquement.</p>
          </>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6 text-xl font-bold">!</div>
            <h1 className="text-xl font-bold mb-2 text-red-600">Erreur d'authentification</h1>
            <p className="text-sm text-gray-400 mb-4">{error}</p>
            <p className="text-xs text-gray-300">Fermeture automatique...</p>
          </>
        )}
      </div>
    </div>
  );
}
