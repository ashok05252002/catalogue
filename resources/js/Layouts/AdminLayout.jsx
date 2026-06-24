import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Tag, 
  Layers, 
  Package, 
  ChevronLeft, 
  ExternalLink,
  Menu,
  Bell,
  User,
  Users2,
  LogOut
} from 'lucide-react';

const LOGO_URL = "https://images.dualite.app/4e051f18-beff-4443-9a4f-e3d066da5891/asset-eee2e6f2-58fc-4432-ab2d-1f8fbc28e213.webp";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { url, props } = usePage();
  const user = props.auth?.user;

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin', exact: true },
    { icon: Users2, label: 'Genders', path: '/admin/genders' },
    { icon: Layers, label: 'Categories', path: '/admin/categories' },
    { icon: Tag, label: 'Brands', path: '/admin/brands' },
    { icon: Package, label: 'Products', path: '/admin/products' },
  ];

  const isRouteActive = (item) => {
    if (item.exact) {
      return url === item.path;
    }
    return url.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 bg-white border-r border-slate-200 w-64 shadow-2xl shadow-slate-200/50 lg:shadow-none lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 h-6">
            <img src={LOGO_URL} alt="1000 VIBES" className="h-full w-auto object-contain" />
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Admin Dashboard</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isRouteActive(item);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                    active 
                      ? "bg-[#1D1D1F] text-white shadow-lg shadow-slate-200" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-slate-50/50">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-3 text-slate-600 hover:text-black transition-colors font-bold text-sm bg-white border border-slate-200 rounded-xl shadow-sm"
          >
            <span className="flex items-center gap-3">Live Catalog</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8 sticky top-0 z-20">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 mr-2 text-slate-600 lg:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-8 w-[1px] bg-slate-200 mx-1" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{user?.email || 'Super Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#1D1D1F] flex items-center justify-center text-white shadow-lg">
                <User size={20} />
              </div>
            </div>
            <Link
              href={route('logout')}
              method="post"
              as="button"
              title="Sign out"
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut size={18} />
            </Link>
          </div>
        </header>

        {/* Child Views */}
        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
