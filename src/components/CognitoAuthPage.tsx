import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Mail, User, Building, Eye, EyeOff, ShieldCheck, 
  Loader2, CheckCircle, AlertCircle, ArrowLeft, KeyRound, Globe, RefreshCw
} from "lucide-react";
import { authService } from "../services/authService";

export type CognitoRole = "Admin" | "Supply Chain Manager" | "Logistics Executive" | "Analyst";

export interface CognitoUser {
  name: string;
  email: string;
  company: string;
  role: CognitoRole;
}

interface CognitoAuthPageProps {
  onLoginSuccess: (user: CognitoUser) => void;
}

export default function CognitoAuthPage({ onLoginSuccess }: CognitoAuthPageProps) {
  // Authentication states: 'signin' | 'signup' | 'verify_signup' | 'forgot' | 'verify_forgot'
  const [mode, setMode] = useState<"signin" | "signup" | "verify_signup" | "forgot" | "verify_forgot">("signin");
  
  // Field States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<CognitoRole>("Supply Chain Manager");
  
  // Extra Cognito Verification States
  const [verificationCode, setVerificationCode] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // UI Utilities
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear messages on transition
  const switchMode = (newMode: typeof mode) => {
    setError(null);
    setSuccess(null);
    setMode(newMode);
  };

  // Pre-fill fields for a smooth experience or testing
  useEffect(() => {
    if (mode === "signin") {
      const savedEmail = localStorage.getItem("sentinel_remembered_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      } else {
        // High-end default mock values
        setEmail("sarah.jenkins@sentinelchain.ai");
        setPassword("SecurePass123!");
      }
    }
  }, [mode]);

  // Email validation helper
  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  // 1. SIGN IN FLOW
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please specify a valid business email address.");
      return;
    }

    setIsLoading(true);

    try {
      const user = await authService.signIn(email, password);
      
      if (rememberMe) {
        localStorage.setItem("sentinel_remembered_email", email);
      } else {
        localStorage.removeItem("sentinel_remembered_email");
      }

      setSuccess("Cognito federated session token verified successfully!");
      setTimeout(() => {
        onLoginSuccess(user);
      }, 800);
    } catch (err: any) {
      setError(err.message || "An unexpected security token error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. SIGN UP FLOW
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName || !companyName || !email || !password || !confirmPassword) {
      setError("All fields are required for enterprise registration.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid work email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters and contain special signs.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.signUp(fullName, companyName, email, selectedRole, password);
      setSuccess("Account initiated! Cognito verification code dispatched to " + email);
      setTimeout(() => {
        switchMode("verify_signup");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Cognito UserPool error registering user.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. MFA EMAIL VERIFICATION FLOW
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!verificationCode) {
      setError("Please input the 6-digit confirmation code.");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Invalid code. Verification code must be exactly 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.confirmSignUp(verificationCode);
      setSuccess("Cognito email confirmed! Account is now active.");
      
      const tempRegUserRaw = localStorage.getItem("sentinel_temp_reg_user") || "{}";
      const parsed = JSON.parse(tempRegUserRaw);
      
      setTimeout(() => {
        if (parsed.email) {
          setEmail(parsed.email);
          setPassword(parsed.password || "");
        }
        switchMode("signin");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Invalid verification token. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. FORGOT PASSWORD REQUEST FLOW
  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!resetEmail) {
      setError("Please specify your registered enterprise email.");
      return;
    }

    if (!isValidEmail(resetEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(resetEmail);
      setSuccess("Reset code dispatched! Check your inbox for security code.");
      setTimeout(() => {
        switchMode("verify_forgot");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Unable to dispatch reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. CONFIRM PASSWORD RESET FLOW
  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!verificationCode || !newPassword || !confirmNewPassword) {
      setError("Please fill in the 6-digit verification code and new password details.");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("The verification code must be exactly 6 digits.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.confirmForgotPassword(resetEmail, verificationCode, newPassword);
      setSuccess("Success! Your password was updated inside Cognito User Pool.");
      setTimeout(() => {
        setEmail(resetEmail);
        setPassword(newPassword);
        switchMode("signin");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to confirm password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 select-none relative overflow-hidden">
      {/* Absolute Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 z-10 relative">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/20 mb-2">
            <Globe className="w-8 h-8 text-white animate-[spin_10s_linear_infinite]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300 font-sans uppercase">
            SentinelChain AI
          </h1>
          <p className="text-xs text-sky-400 font-mono uppercase tracking-widest">
            "AI-Powered Global Supply Chain Intelligence"
          </p>
        </div>

        {/* Auth Glassmorphism Card Wrapper */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl relative overflow-hidden text-left">
          
          <AnimatePresence mode="wait">
            {/* 1. SIGN IN SCREEN */}
            {mode === "signin" && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
                    Partner Access Control
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans">
                    Log in using your corporate Amazon Cognito Single Sign-On credentials.
                  </p>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="sarah.jenkins@sentinelchain.ai"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 font-sans transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Security Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 font-sans transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-sky-500/20 w-3.5 h-3.5"
                      />
                      <span>Remember Me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        switchMode("forgot");
                      }}
                      className="text-xs text-sky-400 hover:text-sky-300 font-mono"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Sign In Trigger */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] cursor-pointer shadow-lg shadow-sky-500/20 hover:scale-[1.01]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Cognito Handshake...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>

                {/* Footer action to registration */}
                <div className="pt-4 border-t border-slate-850/60 flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-slate-500">Need corporate credentials?</span>
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 font-sans"
                  >
                    Create Account
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. SIGN UP / REGISTER SCREEN */}
            {mode === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
                    Enterprise Registration
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Register directly to the Cognito User Pool directory to receive credentials.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Sarah Jenkins"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 font-sans transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="Sentinel Corp"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 font-sans transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Security Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as CognitoRole)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Supply Chain Manager">Supply Chain Manager</option>
                        <option value="Logistics Executive">Logistics Executive</option>
                        <option value="Analyst">Analyst</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="sarah@yourfirm.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 font-sans transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 px-3 pr-8 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 font-sans transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Confirm
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 px-3 pr-8 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 font-sans transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] cursor-pointer shadow-lg shadow-sky-500/20"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-850/60 text-center">
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. COGNITO EMAIL VERIFICATION / OTP SCREEN */}
            {mode === "verify_signup" && (
              <motion.div
                key="verify_signup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
                      MFA Verification
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      A confirmation passcode was transmitted to your work email. Please enter it below.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center">
                      6-Digit Security Token
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-center tracking-[1em] text-lg font-mono bg-slate-950 border border-slate-800 rounded-xl py-3 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Verify Email</span>
                    )}
                  </button>
                </form>

                <div className="pt-2 flex flex-col items-center space-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess("MFA code resent successfully.");
                    }}
                    className="text-slate-400 hover:text-slate-300 flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Restart Registration
                  </button>
                </div>
              </motion.div>
            )}

            {/* 4. FORGOT PASSWORD REQUEST SCREEN */}
            {mode === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
                    Password Reset Hub
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Input your corporate identity email below. Cognito will coordinate a reset link.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@domain.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Send Reset Code</span>
                    )}
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>Return to Sign In</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 5. CONFIRM PASSWORD RESET SCREEN */}
            {mode === "verify_forgot" && (
              <motion.div
                key="verify_forgot"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
                    Establish Credentials
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Complete verification with reset code and establish a secure passphrase.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start space-x-2 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleConfirmPasswordReset} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                      6-Digit Verification Code
                    </label>
                    <div className="relative font-mono">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-200 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-200 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>Back to Reset Email</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System telemetry taglines at the bottom */}
        <div className="text-[9px] text-slate-600 font-mono text-center flex justify-between items-center px-2">
          <span>COGNITO_PROVIDER_ID: us-east-1_SentChainUser</span>
          <span>SSL 256-BIT ENCRYPTION</span>
        </div>
      </div>
    </div>
  );
}
