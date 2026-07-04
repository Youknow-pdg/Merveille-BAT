import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  loading: true,
  refreshProfile: async () => {} 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // Promise.race pour s'assurer que fetchProfile ne bloque pas indéfiniment
          await Promise.race([
            fetchProfile(currentUser.id, currentUser.email, currentUser.user_metadata?.display_name),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 15000))
          ]).catch(err => {
            console.warn('Initial profile fetch failed or timed out, using fallback:', err);
            // On définit un profil minimal si le fetch échoue/timeout pour débloquer l'UI
            setProfile({
              id: currentUser.id,
              email: currentUser.email,
              displayName: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'Utilisateur',
              role: (currentUser.email === 'admin@merveillebat.sn' || currentUser.email === 'youknowfeus@gmail.com') ? 'admin' : 'locataire',
              isGuest: true
            });
          });
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error in checkUser:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await Promise.race([
            fetchProfile(currentUser.id, currentUser.email, currentUser.user_metadata?.display_name),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 15000))
          ]).catch(err => {
            console.warn('Auth change profile fetch failed or timed out, using fallback:', err);
            setProfile({
              id: currentUser.id,
              email: currentUser.email,
              displayName: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'Utilisateur',
              role: (currentUser.email === 'admin@merveillebat.sn' || currentUser.email === 'youknowfeus@gmail.com') ? 'admin' : 'locataire',
              isGuest: true
            });
          });
        } else {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email?: string, displayName?: string) => {
    console.log('Fetching profile for user:', userId);
    
    // Create a fallback profile immediately available
    const fallbackProfile = {
      id: userId,
      email: email,
      displayName: displayName || email?.split('@')[0] || 'Utilisateur',
      role: (email === 'admin@merveillebat.sn' || email === 'youknowfeus@gmail.com') ? 'admin' : 'locataire',
      isGuest: true
    };

    try {
      // Set a strict timeout for the Supabase operation
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 12000)
      );

      const result: any = await Promise.race([profilePromise, timeoutPromise]);

      if (result === 'TIMEOUT' || (result instanceof Error && result.message === 'TIMEOUT')) {
        throw new Error('TIMEOUT');
      }

      const { data, error } = result;

      if (error) {
        console.warn('Supabase profile fetch error:', error);
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Profile missing, creating new one...');
          const newProfile = {
            id: userId,
            email: email,
            display_name: displayName || email?.split('@')[0] || 'Utilisateur',
            role: (email === 'admin@merveillebat.sn' || email === 'youknowfeus@gmail.com') ? 'admin' : 'locataire',
            created_at: new Date().toISOString()
          };
          
          try {
            // Profile creation also needs a timeout safeguard
            const createPromise = supabase
              .from('profiles')
              .insert([newProfile])
              .select()
              .single();
            
            const { data: createdData } = await Promise.race([
              createPromise,
              new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 10000))
            ]) as any;

            if (createdData) {
              setProfile({
                ...createdData,
                displayName: createdData.display_name,
                phone: createdData.phone || '+221 77 000 00 00'
              });
              return;
            }
          } catch (createErr) {
            console.error('Profile creation failed or timed out:', createErr);
          }
        }
        
        // Final fallback for any fetch error (RLS, table missing, etc)
        setProfile(fallbackProfile);
      } else if (data) {
        console.log('Profile loaded successfully');
        const role = (email === 'admin@merveillebat.sn' || email === 'youknowfeus@gmail.com') ? 'admin' : data.role;
        setProfile({
          ...data,
          role,
          displayName: data.display_name,
          phone: data.phone || '+221 77 000 00 00'
        });
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'TIMEOUT') {
        console.warn('Profile fetch timed out, falling back to guest profile');
      } else {
        console.error('Fetch profile error:', err);
      }
      setProfile(fallbackProfile);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email, user.user_metadata?.display_name);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
