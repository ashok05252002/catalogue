import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Catalog Under Progress" />
            <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
                
                {/* Background decorative glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                {/* Header Navbar */}
                <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-10">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/30">
                            C
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            CatLog
                        </span>
                    </div>

                    <nav className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('admin.overview')}
                                className="px-4 py-2 text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-indigo-400 hover:text-indigo-300 transition duration-200"
                            >
                                Admin Panel
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white shadow-md shadow-indigo-600/20 transition duration-200"
                            >
                                Admin Login
                            </Link>
                        )}
                    </nav>
                </header>

                {/* Main Hero Card Container */}
                <main className="w-full max-w-4xl px-6 py-12 flex flex-col items-center text-center z-10 my-auto">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        <span>Development Mode Active</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Our Product Catalog is <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Under Progress
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
                        We are currently crafting a state-of-the-art catalog experience. Our team is building a beautiful showcase of premium collections, products, and insights.
                    </p>

                    {/* Progress Card (Responsive & Glassmorphic) */}
                    <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative">
                        <div className="absolute top-0 right-8 transform -translate-y-1/2 flex space-x-1 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                            V1.0.0-beta
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-slate-300">Overall Development</span>
                            <span className="text-sm font-mono font-bold text-indigo-400">75%</span>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: '75%' }}
                            ></div>
                        </div>

                        {/* Checklist */}
                        <div className="mt-6 space-y-3 text-left text-sm text-slate-400">
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>MySQL Database & Config</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Responsive Admin CRUD Panel</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 rounded-full border-2 border-indigo-500/50 flex items-center justify-center shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                                </div>
                                <span className="text-slate-300 font-medium">Public Catalog Showcase (In Progress)</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer Section */}
                <footer className="w-full max-w-7xl px-6 py-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-900 z-10 text-xs text-slate-500 gap-4">
                    <p>© {new Date().getFullYear()} CatLog Inc. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href={route('login')} className="hover:text-indigo-400 transition">
                            Admin Login
                        </Link>
                        <span className="text-slate-800">|</span>
                        <span>Designed with Passion</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
