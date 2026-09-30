import { Head, useForm } from '@inertiajs/react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

const LOGO_URL = "https://images.dualite.app/4e051f18-beff-4443-9a4f-e3d066da5891/asset-eee2e6f2-58fc-4432-ab2d-1f8fbc28e213.webp";

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4 font-sans">
            <Head title="Admin Login — 1000 VIBES" />

            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img src={LOGO_URL} alt="1000 VIBES" className="h-8 w-auto object-contain" />
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8">
                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#1D1D1F] flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Lock size={22} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-center text-[#1D1D1F] tracking-tight">Admin Access</h1>
                        <p className="text-xs text-center text-[#86868B] mt-1.5 font-medium">Sign in to manage your catalog</p>
                    </div>

                    {status && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-xs font-semibold text-green-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="admin@gmail.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] rounded-xl border-none focus:ring-2 focus:ring-slate-200 text-sm text-slate-900 outline-none transition placeholder:text-slate-400"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-rose-500 font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-10 pr-11 py-3 bg-[#F5F5F7] rounded-xl border-none focus:ring-2 focus:ring-slate-200 text-sm text-slate-900 outline-none transition placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-rose-500 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded accent-[#1D1D1F] cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                                Remember me
                            </span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 mt-2 rounded-xl bg-[#1D1D1F] hover:opacity-90 active:scale-[0.98] text-white text-sm font-bold tracking-wide transition-all shadow-lg shadow-slate-300/50 disabled:opacity-50"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-slate-400 font-medium mt-6">
                    © 2025 1000 VIBES. Restricted access.
                </p>
            </div>
        </div>
    );
}
