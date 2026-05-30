"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react';
import { z } from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate minor network delay for premium feel (cyber security check)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const success = login(data.email, data.password);
    
    if (success) {
      router.replace('/dashboard');
    } else {
      setError('Invalid system credentials. Access denied.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0F0F0F]"
      style={{ background: 'radial-gradient(circle at center, #151a10 0%, #0c0f09 60%, #000000 100%)' }}
    >
      {/* Decorative Neon Circles */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 rounded-full bg-[#9EFF00]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 rounded-full bg-[#00BFFF]/5 blur-[150px] pointer-events-none" />

      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center bg-black border border-[#9EFF00]/30 shadow-lg shadow-[#9EFF00]/5 mb-4 relative group overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-[#9EFF00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <Image
              src="/log.png"
              alt="AL HIKMATH Logo"
              width={96}
              height={96}
              className="relative z-10 w-20 h-20 object-contain"
              priority
            />
          </div>
          <h2 className="text-xl font-bold tracking-widest text-white uppercase">
            AL HIKMATH
          </h2>
          <p className="text-xs uppercase tracking-widest font-semibold mt-1" style={{ color: 'var(--text-secondary)' }}>
            Enterprise Security Gateway
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 border border-white/5 shadow-2xl glow-green relative">
          <h1 className="text-2xl font-bold text-white mb-2">
            System Authentication
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Enter administrative credentials to gain server access.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-lg border bg-red-500/10 border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2.5"
              >
                <ShieldAlert size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  className="admin-input pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Security Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="admin-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 accent-[#9EFF00] cursor-pointer"
                />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Persist session
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#9EFF00]/10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Decrypting...</span>
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Bottom helper credentials */}
          <div className="mt-8 text-center text-[10px] uppercase tracking-wider font-semibold opacity-60 text-gray-400 border-t border-white/5 pt-4">
            Authorized admin credentials: <br/>
            <span className="text-[#9EFF00]">admin@gmail.com</span> / <span className="text-[#9EFF00]">admin@123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
