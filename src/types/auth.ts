export type AdminRole = 'super_admin' | 'store_manager' | 'catalog_specialist';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  avatar?: string;
  lastLogin?: string;
}

export interface AdminAccountRecord extends AdminUser {
  passwordHash: string; // Plaintext or hashed for local validation
  resetPin: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  loginTime: string;
  rememberMe: boolean;
}
