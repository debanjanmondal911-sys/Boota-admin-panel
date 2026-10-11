import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminAccountRecord, AuthSession, AdminRole } from '../types/auth';

interface AuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };
  resetPasswordWithPin: (email: string, pin: string, newPassword: string) => { success: boolean; error?: string };
  updateProfile: (name: string, email: string) => { success: boolean; error?: string };
  accountsList: { email: string; roleLabel: string; name: string }[];
}

const STORAGE_SESSION_KEY = 'boota_admin_auth_session_v1';
const STORAGE_ACCOUNTS_KEY = 'boota_admin_auth_accounts_v1';

const INITIAL_ACCOUNTS: AdminAccountRecord[] = [
  {
    id: 'usr-admin-1',
    name: 'Debanjan Mondal',
    email: 'admin@boota.com',
    role: 'super_admin',
    roleLabel: 'Super Administrator',
    passwordHash: 'admin123',
    resetPin: '2026',
    lastLogin: 'Today, 10:30 AM'
  },
  {
    id: 'usr-manager-2',
    name: 'Pooja Sharma',
    email: 'manager@boota.com',
    role: 'store_manager',
    roleLabel: 'Operations Manager',
    passwordHash: 'manager123',
    resetPin: '2026',
    lastLogin: 'Yesterday, 04:15 PM'
  },
  {
    id: 'usr-catalog-3',
    name: 'Rahul Verma',
    email: 'catalog@boota.com',
    role: 'catalog_specialist',
    roleLabel: 'Catalog Specialist',
    passwordHash: 'catalog123',
    resetPin: '2026',
    lastLogin: '3 days ago'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<AdminAccountRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse admin accounts', e);
    }
    return INITIAL_ACCOUNTS;
  });

  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      if (saved) {
        const parsed: AuthSession = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse admin session', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync accounts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save admin accounts', e);
    }
  }, [accounts]);

  // Sync session to localStorage
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to save session', e);
    }
  }, [session]);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate authenticating for realistic feel & security cadence
    await new Promise(resolve => setTimeout(resolve, 600));

    const normalizedEmail = email.trim().toLowerCase();
    const matchedAccount = accounts.find(
      acc => acc.email.toLowerCase() === normalizedEmail
    );

    if (!matchedAccount) {
      setIsLoading(false);
      return {
        success: false,
        error: 'No administrator account found with this email address.'
      };
    }

    if (matchedAccount.passwordHash !== password.trim()) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Incorrect credentials. Please verify your password.'
      };
    }

    const nowFormatted = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const updatedAccount: AdminAccountRecord = {
      ...matchedAccount,
      lastLogin: `Today, ${nowFormatted}`
    };

    // Update account with new login time
    setAccounts(prev =>
      prev.map(acc => (acc.id === updatedAccount.id ? updatedAccount : acc))
    );

    const newSession: AuthSession = {
      user: {
        id: updatedAccount.id,
        name: updatedAccount.name,
        email: updatedAccount.email,
        role: updatedAccount.role,
        roleLabel: updatedAccount.roleLabel,
        lastLogin: updatedAccount.lastLogin
      },
      token: `bta_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      loginTime: new Date().toISOString(),
      rememberMe
    };

    setSession(newSession);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setSession(null);
  };

  const changePassword = (
    oldPassword: string,
    newPassword: string
  ): { success: boolean; error?: string } => {
    if (!session?.user) {
      return { success: false, error: 'No active admin session found.' };
    }

    const account = accounts.find(a => a.id === session.user.id);
    if (!account) {
      return { success: false, error: 'Account record missing.' };
    }

    if (account.passwordHash !== oldPassword) {
      return { success: false, error: 'Current password does not match our records.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    setAccounts(prev =>
      prev.map(a =>
        a.id === account.id ? { ...a, passwordHash: newPassword } : a
      )
    );

    return { success: true };
  };

  const resetPasswordWithPin = (
    email: string,
    pin: string,
    newPassword: string
  ): { success: boolean; error?: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = accounts.find(a => a.email.toLowerCase() === normalizedEmail);

    if (!account) {
      return { success: false, error: 'Account not found with this email.' };
    }

    if (account.resetPin !== pin.trim()) {
      return { success: false, error: 'Invalid security recovery PIN.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    setAccounts(prev =>
      prev.map(a =>
        a.id === account.id ? { ...a, passwordHash: newPassword } : a
      )
    );

    return { success: true };
  };

  const updateProfile = (name: string, email: string): { success: boolean; error?: string } => {
    if (!session?.user) {
      return { success: false, error: 'No active session.' };
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      return { success: false, error: 'Name and email are required.' };
    }

    setAccounts(prev =>
      prev.map(a =>
        a.id === session.user.id
          ? { ...a, name: trimmedName, email: trimmedEmail }
          : a
      )
    );

    setSession(prev =>
      prev
        ? {
            ...prev,
            user: { ...prev.user, name: trimmedName, email: trimmedEmail }
          }
        : null
    );

    return { success: true };
  };

  const accountsList = accounts.map(a => ({
    email: a.email,
    roleLabel: a.roleLabel,
    name: a.name
  }));

  return (
    <AuthContext.Provider
      value={{
        currentUser: session?.user || null,
        isAuthenticated: !!session?.user,
        isLoading,
        login,
        logout,
        changePassword,
        resetPasswordWithPin,
        updateProfile,
        accountsList
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
