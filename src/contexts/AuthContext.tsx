/* eslint-disable react-refresh/only-export-components */
import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import type { AuthError, Session, User } from "@supabase/supabase-js";

// Definisikan tipe baru untuk context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan true untuk cek sesi awal

  useEffect(() => {
    // Cek sesi yang aktif saat aplikasi dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listener ini akan aktif saat ada perubahan state otentikasi (login, logout, dll)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Bersihkan listener saat komponen tidak lagi digunakan
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fungsi login sekarang memanggil Supabase secara langsung
  const login = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  // Fungsi logout juga memanggil Supabase
  const logout = async () => {
    return supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    isLoading,
    login,
    logout,
  };

  // Tampilkan children hanya setelah pengecekan sesi awal selesai
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
