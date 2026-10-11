import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Crown,
  KeyRound,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BootaLogo } from './BootaLogo';

export const AdminLoginView: React.FC = () => {
  const { login, isLoading, resetPasswordWithPin } = useAuth();

  const [email, setEmail] = useState('admin@boota.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPin, setResetPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    const res = await login(email, password, rememberMe);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);

    if (!resetEmail || !resetPin || !newPassword) {
      setResetError('All fields are required.');
      return;
    }

    const res = resetPasswordWithPin(resetEmail, resetPin, newPassword);
    if (res.success) {
      setResetSuccess('Password has been successfully updated! You can now log in.');
      setPassword(newPassword);
      setEmail(resetEmail);
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccess(null);
      }, 1800);
    } else {
      setResetError(res.error || 'Reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Decorative luxury background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#962949]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F3D0D9]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#F3D0D9] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-[#962949] to-[#7E1F3B] p-6 text-white text-center relative">
          <div className="flex justify-center mb-3">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 shadow-inner">
              <BootaLogo variant="horizontal" size="md" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-[11px] font-medium tracking-wider uppercase mb-1">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Executive Atelier Administration</span>
          </div>
          <p className="text-rose-100 text-xs">
            Operations &bull; Inventory Matrix &bull; Orders &bull; Patrons
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Workstation Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@boota.com"
                  autoComplete="email"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#962949] focus:ring-1 focus:ring-[#962949] outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Admin Passkey
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-[#962949] hover:underline font-semibold cursor-pointer"
                >
                  Forgot passkey?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#962949] focus:ring-1 focus:ring-[#962949] outline-none transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-[#962949] focus:ring-[#962949] w-3.5 h-3.5"
                />
                <span className="text-xs text-stone-600">Remember this browser session</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#962949] hover:bg-[#7E1F3B] disabled:bg-stone-300 text-white rounded-xl text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Demo Logins for Easy Evaluation */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                1-Click Preset Roles
              </span>
              <span className="text-[10px] text-stone-400">Click to fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@boota.com', 'admin123')}
                className="p-2 text-left bg-stone-50 hover:bg-[#FDF2F4] border border-stone-200 hover:border-[#F3D0D9] rounded-lg transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-stone-800 group-hover:text-[#962949]">
                  Super Admin
                </div>
                <div className="text-[10px] text-stone-500 font-mono">admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('manager@boota.com', 'manager123')}
                className="p-2 text-left bg-stone-50 hover:bg-[#FDF2F4] border border-stone-200 hover:border-[#F3D0D9] rounded-lg transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-stone-800 group-hover:text-[#962949]">
                  Store Manager
                </div>
                <div className="text-[10px] text-stone-500 font-mono">manager123</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Atelier Console</span>
          </div>
          <a
            href="https://boota-luxury-indian-festive-kidswea-eight.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="text-[#962949] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Security PIN Reset Modal (Forgot Password) */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#962949]" />
                <span className="font-bold text-xs">Security Passkey Recovery</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetSubmit} className="p-5 space-y-4">
              <p className="text-xs text-stone-600">
                Enter your admin account email, security master PIN (<span className="font-mono font-bold text-[#962949]">2026</span>), and your desired new passkey.
              </p>

              {resetError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                  {resetError}
                </div>
              )}

              {resetSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Account Email
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="admin@boota.com"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:border-[#962949]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Recovery PIN (Default: 2026)
                </label>
                <input
                  type="password"
                  value={resetPin}
                  onChange={e => setResetPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:border-[#962949]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  New Passkey (min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:border-[#962949]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#962949] hover:bg-[#7E1F3B] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Update Passkey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
