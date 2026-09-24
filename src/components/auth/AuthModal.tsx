import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'forgot';
  onSuccessRoleRedirect?: (role: 'HOUSEHOLD' | 'KABADIWALA' | 'ADMIN') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccessRoleRedirect
}) => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(defaultMode);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'HOUSEHOLD' | 'KABADIWALA'>('HOUSEHOLD');
  const [businessName, setBusinessName] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedResetToken, setGeneratedResetToken] = useState('');

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await login(identifier, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      if (onSuccessRoleRedirect) {
        onSuccessRoleRedirect(res.user.role);
      }
      onClose();
    } else {
      setErrorMessage(res.error || 'Invalid email/phone or password.');
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setIsSubmitting(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setIsSubmitting(false);
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const payload: any = {
      name,
      email,
      phone,
      password,
      role,
    };

    if (role === 'KABADIWALA' && businessName) {
      payload.businessName = businessName;
    }

    const res = await register(payload);
    setIsSubmitting(false);

    if (res.success && res.user) {
      if (res.user.role === 'KABADIWALA') {
        setSuccessMessage('Registration submitted! Your Kabadiwala account is awaiting verification by the Platform Admin.');
      } else {
        if (onSuccessRoleRedirect) {
          onSuccessRoleRedirect(res.user.role);
        }
        onClose();
      }
    } else {
      setErrorMessage(res.error || 'Registration failed. Please check your information.');
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setSuccessMessage(data.message || 'Reset token generated.');
        if (data.data?.resetToken) {
          setGeneratedResetToken(data.data.resetToken);
          setResetToken(data.data.resetToken);
        }
      } else {
        setErrorMessage(data.error || 'Unable to process reset request.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Network error while requesting password reset.');
    }
  };

  // Handle Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setSuccessMessage('Password successfully changed! You can now log in.');
        setTimeout(() => setMode('login'), 2000);
      } else {
        setErrorMessage(data.error || 'Password reset failed.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Network error during password reset.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="satoshi-auth-modal bg-white rounded-3xl max-w-lg w-full border border-[#E0D5C3] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="auth-modal-header bg-[#240A39] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="font-display font-black text-2xl text-white tracking-tight">
            {mode === 'login' && 'Log In to Your Account'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset' && 'Enter New Password'}
          </h2>
          <p className="text-xs text-purple-200 mt-1 max-w-md">
            {mode === 'login' && 'Access verified rates, doorstep scrap bookings, and dashboard records.'}
            {mode === 'register' && 'Register as a household resident or request verified Kabadiwala onboarding.'}
            {mode === 'forgot' && 'Enter your registered email address or phone number to receive a secure token.'}
            {mode === 'reset' && 'Create a fresh secure password to restore access.'}
          </p>
          <div className="auth-modal-accent" aria-hidden="true" />
        </div>

        {/* Modal Form Content */}
        <div className="auth-modal-content p-6 space-y-5 bg-[#FAF8F5]">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs flex items-start gap-2.5 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-start gap-2.5 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* ----------------- LOGIN FORM ----------------- */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. rahul.sharma@example.com or 9876543210"
                    required
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-[#240A39] hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-[#240A39] hover:bg-[#340f52] disabled:opacity-60 text-amber-400 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with Cloud SQL...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[#240A39] font-bold hover:underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {/* ----------------- REGISTRATION FORM ----------------- */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Account Type Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  How do you want to use the platform?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('HOUSEHOLD')}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                      role === 'HOUSEHOLD'
                        ? 'border-[#240A39] bg-white ring-2 ring-[#240A39]/10 shadow-xs'
                        : 'border-[#E0D5C3] bg-white/60 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-2xl">🏠</span>
                    <div>
                      <strong className="block text-xs text-slate-900">Household</strong>
                      <span className="text-[10px] text-slate-500">Sell scrap</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('KABADIWALA')}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                      role === 'KABADIWALA'
                        ? 'border-[#240A39] bg-white ring-2 ring-[#240A39]/10 shadow-xs'
                        : 'border-[#E0D5C3] bg-white/60 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-2xl">♻️</span>
                    <div>
                      <strong className="block text-xs text-slate-900">Kabadiwala</strong>
                      <span className="text-[10px] text-slate-500">Scrap Buyer</span>
                    </div>
                  </button>
                </div>
              </div>

              {role === 'KABADIWALA' && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  ⚠️ Note: Kabadiwala accounts require verification by the Platform Admin before appearing in local searches.
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    required
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>
              </div>

              {role === 'KABADIWALA' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Scrap Centre / Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Maa Tara Scrap Traders"
                    required
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      required
                      className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98000 12345"
                      required
                      className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 chars"
                      required
                      className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-1 rounded-xl bg-[#240A39] hover:bg-[#340f52] disabled:opacity-60 text-amber-400 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating PostgreSQL User...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[#240A39] font-bold hover:underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {/* ----------------- FORGOT PASSWORD FORM ----------------- */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Registered Email or Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. rahul.sharma@example.com"
                    required
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>
              </div>

              {generatedResetToken && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-purple-700" />
                    <span>One-Time Reset Token:</span>
                  </div>
                  <div className="font-mono text-[11px] bg-white p-2 rounded-lg border border-purple-200 break-all select-all">
                    {generatedResetToken}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs font-bold text-[#240A39] underline block"
                  >
                    Proceed to enter new password →
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-[#240A39] hover:bg-[#340f52] disabled:opacity-60 text-amber-400 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Security Token...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Reset Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-slate-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[#240A39] font-bold hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* ----------------- RESET PASSWORD FORM ----------------- */}
          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Reset Token
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter reset token"
                    required
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-[#240A39] hover:bg-[#340f52] disabled:opacity-60 text-amber-400 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating in Cloud SQL...</span>
                  </>
                ) : (
                  <>
                    <span>Set New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[#240A39] font-bold hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
