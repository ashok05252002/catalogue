import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';

import { 
  Search, 
  MessageCircle, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = "https://images.dualite.app/4e051f18-beff-4443-9a4f-e3d066da5891/asset-eee2e6f2-58fc-4432-ab2d-1f8fbc28e213.webp";

// ---------- URL helpers ----------
function readParamsFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    g: params.get('g'),          // gender key
    c: params.get('c'),          // category id
    b: params.get('b'),          // brand id
    p: params.get('p'),          // product id
  };
}

function pushURL(gender, categoryId, brandId, productId) {
  const params = new URLSearchParams();
  if (gender)     params.set('g', gender);
  if (categoryId) params.set('c', categoryId);
  if (brandId)    params.set('b', brandId);
  if (productId)  params.set('p', productId);
  const qs = params.toString();
  const url = qs ? `/?${qs}` : '/';
  window.history.pushState({}, '', url);
}

function replaceURL(gender, categoryId, brandId, productId) {
  const params = new URLSearchParams();
  if (gender)     params.set('g', gender);
  if (categoryId) params.set('c', categoryId);
  if (brandId)    params.set('b', brandId);
  if (productId)  params.set('p', productId);
  const qs = params.toString();
  const url = qs ? `/?${qs}` : '/';
  window.history.replaceState({}, '', url);
}
// ---------------------------------

export default function Catalog({ auth, products = [], brands = [], categories = [], genders = [] }) {
  const [view, setView] = useState('gender');
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // ---- Restore state from URL on initial load ----
  useEffect(() => {
    const { g, c, b, p } = readParamsFromURL();
    if (!g) return; // nothing in URL → default gender view

    setSelectedGender(g);

    if (c) {
      const catId = Number(c);
      setSelectedCategory(catId);

      if (b) {
        const brandId = Number(b);
        setSelectedBrand(brandId);

        if (p) {
          const prod = products.find(x => x.id === Number(p));
          if (prod) {
            setSelectedProduct(prod);
            setView('detail');
          } else {
            setView('products');
          }
        } else {
          setView('products');
        }
      } else {
        setView('brands');
      }
    } else {
      setView('categories');
    }
  // Only run on mount — products won't change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Browser back/forward button support ----
  useEffect(() => {
    const onPopState = () => {
      const { g, c, b, p } = readParamsFromURL();
      if (!g) {
        setView('gender');
        setSelectedGender(null);
        setSelectedCategory(null);
        setSelectedBrand(null);
        setSelectedProduct(null);
        return;
      }
      setSelectedGender(g);
      if (!c) { setView('categories'); setSelectedCategory(null); setSelectedBrand(null); setSelectedProduct(null); return; }
      const catId = Number(c);
      setSelectedCategory(catId);
      if (!b) { setView('brands'); setSelectedBrand(null); setSelectedProduct(null); return; }
      const brandId = Number(b);
      setSelectedBrand(brandId);
      if (!p) { setView('products'); setSelectedProduct(null); return; }
      const prod = products.find(x => x.id === Number(p));
      if (prod) { setSelectedProduct(prod); setView('detail'); }
      else      { setView('products'); }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // ---- Derived data ----
  const availableCategories = useMemo(() => {
    if (!selectedGender) return [];
    return categories.filter(c => c.gender === selectedGender);
  }, [selectedGender, categories]);

  const availableBrands = useMemo(() => {
    if (!selectedCategory || !selectedGender) return [];
    
    // Get all brand IDs that have products in this category/gender
    const brandIdsFromProducts = new Set(
      products
        .filter(p => Number(p.category_id) === Number(selectedCategory) && p.gender === selectedGender)
        .map(p => Number(p.brand_id))
    );

    return brands.filter(b => {
      // Show brand if it is explicitly assigned to this category AND gender in the admin panel
      if (Number(b.category_id) === Number(selectedCategory) && b.gender === selectedGender) {
        return true;
      }
      // Fallback: also show brand if there are products under this brand for this category/gender
      return brandIdsFromProducts.has(Number(b.id));
    });
  }, [selectedCategory, selectedGender, products, brands]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesGender   = p.gender === selectedGender;
      const matchesCategory = Number(p.category_id) === Number(selectedCategory);
      const matchesBrand    = Number(p.brand_id) === Number(selectedBrand);
      const matchesSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGender && matchesCategory && matchesBrand && matchesSearch;
    });
  }, [selectedGender, selectedCategory, selectedBrand, searchTerm, products]);

  // ---- Navigation handlers ----
  const handleGenderClick = useCallback((gender) => {
    setSelectedGender(gender);
    setView('categories');
    pushURL(gender, null, null, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategoryClick = useCallback((id) => {
    setSelectedCategory(id);
    setView('brands');
    pushURL(selectedGender, id, null, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGender]);

  const handleBrandClick = useCallback((id) => {
    setSelectedBrand(id);
    setView('products');
    pushURL(selectedGender, selectedCategory, id, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGender, selectedCategory]);

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setView('detail');
    pushURL(selectedGender, selectedCategory, selectedBrand, product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGender, selectedCategory, selectedBrand]);

  const handleBack = useCallback(() => {
    if (view === 'detail') {
      setView('products');
      setSelectedProduct(null);
      pushURL(selectedGender, selectedCategory, selectedBrand, null);
    } else if (view === 'products') {
      setView('brands');
      setSelectedBrand(null);
      pushURL(selectedGender, selectedCategory, null, null);
    } else if (view === 'brands') {
      setView('categories');
      setSelectedCategory(null);
      pushURL(selectedGender, null, null, null);
    } else if (view === 'categories') {
      setView('gender');
      setSelectedGender(null);
      replaceURL(null, null, null, null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedGender, selectedCategory, selectedBrand]);

  const handleLogoClick = useCallback(() => {
    setView('gender');
    setSelectedGender(null);
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedProduct(null);
    replaceURL(null, null, null, null);
  }, []);

  const handleWhatsAppShare = (product) => {
    const bName = product.brand?.name || brands.find(b => b.id === product.brand_id)?.name || '';
    const whatsappNum = '9149600366747'; // Hardcoded as requested
    const text = `Hello, I'm interested in the ${product.name} ${bName ? `(${bName})` : ''}. Is it available? \n\nLink: ${window.location.href}`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentBrand    = brands.find(b => b.id === selectedBrand);

  const productImages = useMemo(() => {
    if (!selectedProduct) return [];
    const imgs = selectedProduct.images;
    if (Array.isArray(imgs) && imgs.length > 0) return imgs;
    return selectedProduct.image_path ? [selectedProduct.image_path] : [];
  }, [selectedProduct]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col font-sans">
      <Head title="Premium Product Catalog" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 h-14 flex items-center bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-[1200px] mx-auto w-full px-4 flex items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer h-7"
            onClick={handleLogoClick}
          >
            <img src={LOGO_URL} alt="1000 VIBES" className="h-full w-auto object-contain" />
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-4 pt-4 pb-12 flex-1 w-full">
        <AnimatePresence mode="wait">

          {/* STEP 1: GENDER */}
          {view === 'gender' && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-bold tracking-tight pt-2">Collection.</h1>
              <div className="grid grid-cols-2 gap-3 max-w-2xl">
                {['men', 'women'].map((genderKey) => {
                  const genderData = genders.find(g => g.name === genderKey);
                  const fallback = genderKey === 'men'
                    ? 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop'
                    : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop';
                  const imgSrc = genderData?.image || fallback;
                  return (
                    <motion.button
                      key={genderKey}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleGenderClick(genderKey)}
                      className="group relative aspect-square bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <img
                        src={imgSrc}
                        alt={genderKey === 'men' ? 'Men' : 'Women'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold tracking-tight capitalize">
                          {genderKey === 'men' ? 'Men' : 'Women'}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: CATEGORIES */}
          {view === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1 pt-2">
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#0071E3] hover:opacity-70 transition-opacity"
                >
                  <ArrowLeft size={10} /> Back
                </button>
                <h1 className="text-3xl font-bold tracking-tight">Categories.</h1>
              </div>

              {availableCategories.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm bg-white rounded-3xl border border-black/5 shadow-sm">
                  No categories found in this collection.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {availableCategories.map((cat, idx) => (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="group relative aspect-square bg-white rounded-[1.2rem] overflow-hidden shadow-sm hover:shadow-md transition-all text-left"
                    >
                      <img 
                        src={cat.image || 'https://via.placeholder.com/400'} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <p className="text-[14px] sm:text-base font-bold text-white tracking-tight">{cat.name}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: BRANDS */}
          {view === 'brands' && (
            <motion.div
              key="brands"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1 pt-2">
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#0071E3] hover:opacity-70 transition-opacity"
                >
                  <ArrowLeft size={10} /> {currentCategory?.name}
                </button>
                <h2 className="text-3xl font-bold tracking-tight">Brands.</h2>
              </div>

              {availableBrands.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm bg-white rounded-3xl border border-black/5 shadow-sm">
                  No brands found for this category and gender.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {availableBrands.map((brand, idx) => (
                    <motion.button
                      key={brand.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleBrandClick(brand.id)}
                      className="aspect-square bg-white rounded-[1.2rem] flex flex-col items-center justify-center p-4 group hover:shadow-md transition-all text-center"
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-3">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center font-bold text-sm text-slate-400">
                            {brand.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-[14px] sm:text-base font-bold tracking-tight text-[#1D1D1F]">{brand.name}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: PRODUCTS GRID */}
          {view === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-3 pt-2">
                <div className="space-y-1">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#0071E3] hover:opacity-70 transition-opacity"
                  >
                    <ArrowLeft size={10} /> {currentBrand?.name}
                  </button>
                  <h2 className="text-3xl font-bold tracking-tight">Products.</h2>
                </div>
                
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" size={14} />
                  <input
                    type="text"
                    placeholder="Search collection..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-full border-none shadow-sm focus:shadow-md outline-none text-[11px] font-medium transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm bg-white rounded-3xl border border-black/5 shadow-sm">
                  No products match your search.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {filteredProducts.map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleProductClick(product)}
                      className="bg-white rounded-[1.2rem] overflow-hidden group flex flex-col h-full shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                    >
                      <div className="aspect-square bg-[#FBFBFD] relative overflow-hidden">
                        <img 
                          src={product.image_path || 'https://via.placeholder.com/600'} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppShare(product);
                          }}
                          className="absolute bottom-2 right-2 w-8 h-8 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all z-10"
                        >
                          <MessageCircle size={16} fill="currentColor" />
                        </button>
                      </div>
                      <div className="p-2.5">
                        <h3 className="text-[11px] font-bold leading-tight tracking-tight text-[#1D1D1F] line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-[10px] font-extrabold text-indigo-650 mt-1">${product.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 5: PRODUCT DETAIL PAGE */}
          {view === 'detail' && selectedProduct && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4 pt-2"
            >
              <button 
                onClick={handleBack}
                className="flex items-center gap-1 text-[10px] font-bold text-[#0071E3] hover:opacity-70 transition-opacity"
              >
                <ArrowLeft size={10} /> Back to Products
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                <div className="space-y-3">
                  <div className="aspect-square bg-white rounded-[1.5rem] overflow-hidden shadow-sm relative group">
                    <AnimatePresence mode="wait">
                      {productImages.length > 0 ? (
                        <motion.img
                          key={activeImageIndex}
                          src={productImages[activeImageIndex]}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-350">
                          No Image
                        </div>
                      )}
                    </AnimatePresence>
                    
                    {productImages.length > 1 && (
                      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1);
                          }}
                          className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1);
                          }}
                          className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                          activeImageIndex === idx ? 'border-[#0071E3]' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between py-1">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-1">
                        {selectedProduct.brand?.name || brands.find(b => b.id === selectedProduct.brand_id)?.name}
                      </p>
                      <h1 className="text-2xl font-bold tracking-tight leading-tight">
                        {selectedProduct.name}
                      </h1>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-lg font-extrabold text-indigo-600">₹{selectedProduct.price}</p>
                        {selectedProduct.sku && (
                          <p className="text-[11px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-md">
                            SKU: {selectedProduct.sku}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[12px] font-bold">Description.</h3>
                      <p className="text-[13px] leading-relaxed text-[#424245] font-medium whitespace-pre-line">
                        {selectedProduct.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-[1rem] border border-black/5 space-y-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedProduct.in_stock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[12px] font-bold text-[#1D1D1F]">
                          {selectedProduct.in_stock ? 'In Stock & Ready' : 'Out of Stock / Direct Order'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#86868B] font-medium leading-relaxed">
                        Direct inquiry via WhatsApp for availability and personalized service. Our team will assist you with pricing, custom options, and delivery details.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={() => handleWhatsAppShare(selectedProduct)}
                      className="w-full rounded-xl py-4 gap-3 text-[14px] font-bold bg-[#25D366] hover:bg-[#22c35e] text-white shadow-xl shadow-green-150 flex items-center justify-center transition-all"
                    >
                      <MessageCircle size={18} fill="currentColor" />
                      Inquire on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-6 border-t border-[#D2D2D7]/30 bg-white mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-2">
          <img src={LOGO_URL} alt="1000 VIBES" className="h-5 w-auto object-contain self-start" />
          <div className="flex flex-col gap-0.5">
            <p className="text-[9px] font-bold text-[#1D1D1F]">© 2025 1000 VIBES. All rights reserved.</p>
            <p className="text-[8px] font-medium text-[#86868B]">Premium Catalog Software & Inventory Management.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
