import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Tag, Layers, Package, TrendingUp, ArrowUpRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Overview({ auth, brandsCount = 0, categoriesCount = 0, productsCount = 0, recentProducts = [] }) {
  const stats = [
    { label: 'Total Brands', value: brandsCount, icon: Tag },
    { label: 'Categories', value: categoriesCount, icon: Layers },
    { label: 'Products', value: productsCount, icon: Package },
    { label: 'Total Views', value: '1.2k', icon: TrendingUp },
  ];

  return (
    <AdminLayout>
      <Head title="Admin Dashboard Overview" />
      <div className="space-y-12 font-sans text-slate-900">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard.</h1>
            <p className="text-[#86868B] mt-2 font-medium">Overview of your catalog performance.</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-[#1D1D1F]">Live Dashboard</p>
            <p className="text-xs text-[#86868B]">Last updated 5m ago</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-200/80 rounded-[1.5rem] p-8 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 bg-[#F5F5F7] rounded-lg">
                  <stat.icon size={20} className="text-slate-800" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-green-500 flex items-center gap-0.5">
                  +12% <ArrowUpRight size={12} />
                </span>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-none">{stat.value}</p>
                <p className="text-xs font-semibold text-[#86868B] uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200/80 rounded-[1.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Recent Additions</h2>
            
            {recentProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-450 text-sm">
                No products found in the catalog.
              </div>
            ) : (
              <div className="space-y-6">
                {recentProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    href={route('admin.products')}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#F5F5F7] border border-slate-100 flex items-center justify-center shrink-0">
                        {product.image_path ? (
                          <img src={product.image_path} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-slate-350" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 group-hover:text-[#0071E3] transition-colors">{product.name}</p>
                        <p className="text-xs text-[#86868B]">${product.price}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#D2D2D7] group-hover:text-slate-800 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#1D1D1F] text-white rounded-[1.5rem] p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Pro Tip.</h2>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">High-quality images increase WhatsApp inquiries by up to 40%.</p>
            </div>
            <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Next Step</p>
              <p className="font-bold mb-4">Connect real products and categories to see them live instantly in the catalog.</p>
              <Link href={route('admin.products')} className="text-sm font-bold text-[#0071E3] hover:underline flex items-center gap-1">
                Go to products directory <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
