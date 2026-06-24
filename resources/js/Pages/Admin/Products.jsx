import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Search, Plus, Trash2, Edit2, X, Upload, ImageIcon } from 'lucide-react';

// ─── Reusable premium image uploader ───────────────────────────────────────
function ImageUpload({ label, hint, value, onChange, currentSrc, multiple = false }) {
    const [preview, setPreview] = useState(null);
    const [accumulatedFiles, setAccumulatedFiles] = useState([]);

    const handleChange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if (multiple) {
            const newFilesArray = Array.from(files);
            const updatedFiles = [...accumulatedFiles, ...newFilesArray];
            setAccumulatedFiles(updatedFiles);
            const urls = updatedFiles.map(f => URL.createObjectURL(f));
            setPreview(urls);
            onChange(updatedFiles);
        } else {
            setPreview(URL.createObjectURL(files[0]));
            onChange(files[0]);
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPreview(null);
        if (multiple) {
            setAccumulatedFiles([]);
            onChange(null);
        } else {
            onChange(null);
        }
    };

    const displaySrc = multiple
        ? (preview && preview.length > 0 ? preview[0] : null)
        : (preview || currentSrc);

    return (
        <div className="space-y-1.5">
            {label && (
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
                    {displaySrc && (
                        <button type="button" onClick={handleClear} className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition flex items-center gap-1">
                            <X size={12} /> Clear
                        </button>
                    )}
                </div>
            )}
            <label className="block cursor-pointer group">
                <div className={`relative border-2 border-dashed rounded-xl transition-all overflow-hidden
                    ${displaySrc ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-[#F5F5F7] hover:border-slate-400'}`}
                >
                    {displaySrc ? (
                        // Image preview
                        <div className="relative">
                            <img
                                src={displaySrc}
                                alt="preview"
                                className="w-full h-36 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Upload size={18} className="text-white" />
                                <span className="text-white text-xs font-bold">{multiple ? "Add More Images" : "Change Image"}</span>
                            </div>
                            {multiple && preview && preview.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                                    +{preview.length - 1} more
                                </div>
                            )}
                        </div>
                    ) : (
                        // Upload placeholder
                        <div className="py-6 flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                                <ImageIcon size={18} className="text-slate-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-semibold text-indigo-600">Click to upload</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{hint || 'PNG, JPG, WEBP up to 2MB'}</p>
                            </div>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    className="sr-only"
                    onChange={handleChange}
                />
            </label>
            {multiple && preview && preview.length > 0 && (
                <p className="text-[10px] text-green-600 font-semibold">✓ {preview.length} file(s) selected</p>
            )}
            {!multiple && preview && (
                <p className="text-[10px] text-green-600 font-semibold">✓ New image selected</p>
            )}
        </div>
    );
}
// ───────────────────────────────────────────────────────────────────────────

// Shared form fields component for DRY modal content
const FormFields = ({ data, setData, errors, categories, brands, editingProduct }) => {
    const availableCategories = categories.filter(c => c.gender === data.gender);
    const availableBrands = brands.filter(b => b.gender === data.gender && Number(b.category_id) === Number(data.category_id));

    // Handle cascading resets
    const handleGenderChange = (g) => {
        setData(prev => ({ ...prev, gender: g, category_id: '', brand_id: '' }));
    };

    const handleCategoryChange = (e) => {
        setData(prev => ({ ...prev, category_id: e.target.value, brand_id: '' }));
    };

    return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Product Name</label>
                <input
                    type="text" required value={data.name} onChange={(e) => setData('name', e.target.value)}
                    className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 transition outline-none"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">SKU Number</label>
                <input
                    type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)}
                    className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 transition outline-none"
                />
                {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Price (₹)</label>
                <input
                    type="number" step="0.01" required min="0" value={data.price} onChange={(e) => setData('price', e.target.value)}
                    className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 transition outline-none"
                />
                {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Collection (Gender)</label>
                <div className="grid grid-cols-2 gap-2">
                    {['men', 'women'].map(g => (
                        <button key={g} type="button" onClick={() => handleGenderChange(g)}
                            className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                                data.gender === g ? 'bg-[#1D1D1F] text-white shadow-sm' : 'bg-[#F5F5F7] text-[#86868B] hover:bg-slate-200'
                            }`}
                        >{g}</button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
                <select value={data.category_id} required onChange={handleCategoryChange}
                    className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 transition outline-none cursor-pointer"
                >
                    <option value="">Select Category...</option>
                    {availableCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.category_id && <p className="text-xs text-rose-500 mt-1">{errors.category_id}</p>}
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Brand</label>
                <select value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value)} disabled={!data.category_id}
                    className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 transition outline-none cursor-pointer disabled:opacity-50"
                >
                    <option value="">{data.category_id ? "Select Brand..." : "Select Category First"}</option>
                    {availableBrands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>
        </div>

        <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
            <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows="3"
                className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-900 transition resize-none font-sans outline-none"
            />
        </div>

        {/* ── Image Uploaders ── */}
        <div className="grid grid-cols-2 gap-3">
            <ImageUpload
                label="Cover Image"
                hint="Main product photo"
                currentSrc={editingProduct?.image_path}
                onChange={(file) => setData('image', file)}
            />
            <ImageUpload
                label="Gallery"
                hint="Multiple photos"
                multiple
                onChange={(files) => setData('images', files)}
            />
        </div>
        {errors.image  && <p className="text-xs text-rose-500 -mt-2">{errors.image}</p>}
        {errors.images && <p className="text-xs text-rose-500 -mt-2">{errors.images}</p>}

        <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data.in_stock}
                    onChange={(e) => setData('in_stock', e.target.checked)}
                    className="w-4 h-4 rounded accent-[#1D1D1F]" />
                <span className="text-xs font-semibold text-slate-600">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                    className="w-4 h-4 rounded accent-[#1D1D1F]" />
                <span className="text-xs font-semibold text-slate-600">Show on Catalog</span>
            </label>
        </div>
    </div>
    );
};

export default function Products({ auth, products = [], brands = [], categories = [] }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
    const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, processing: false });

    // Add Product Form
    const { 
        data: addData, 
        setData: setAddData, 
        post: submitAdd, 
        processing: addProcessing, 
        errors: addErrors, 
        reset: resetAdd 
    } = useForm({
        name: '',
        sku: '',
        description: '',
        price: '',
        category: '',
        brand_id: '',
        category_id: '',
        gender: 'men',
        image: null,
        images: null,
        in_stock: true,
        is_active: true,
    });

    // Edit Product Form
    const { 
        data: editData, 
        setData: setEditData, 
        post: submitEdit, 
        processing: editProcessing, 
        errors: editErrors, 
        reset: resetEdit 
    } = useForm({
        name: '',
        sku: '',
        description: '',
        price: '',
        category: '',
        brand_id: '',
        category_id: '',
        gender: 'men',
        image: null,
        images: null,
        in_stock: true,
        is_active: true,
    });

    const categoryFilterOptions = useMemo(() => ['All', ...categories.map(c => c.name)], [categories]);
    const brandFilterOptions    = useMemo(() => ['All', ...brands.map(b => b.name)], [brands]);

    const stats = useMemo(() => {
        const total  = products.length;
        const active = products.filter(p => p.is_active).length;
        const value  = products.reduce((acc, p) => acc + parseFloat(p.price || 0), 0);
        return { total, active, value: value.toFixed(2) };
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch    = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const categoryName     = product.category_relationship?.name || product.category;
            const matchesCategory  = selectedCategoryFilter === 'All' || categoryName === selectedCategoryFilter;
            const brandName        = product.brand?.name;
            const matchesBrand     = selectedBrandFilter === 'All' || brandName === selectedBrandFilter;
            return matchesSearch && matchesCategory && matchesBrand;
        });
    }, [products, searchQuery, selectedCategoryFilter, selectedBrandFilter]);

    const handleAddSubmit = (e) => {
        e.preventDefault();
        submitAdd(route('admin.products.store'), {
            onSuccess: () => { setIsAddOpen(false); resetAdd(); }
        });
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditData({
            name: product.name,
            sku: product.sku || '',
            description: product.description || '',
            price: product.price,
            category: product.category || '',
            brand_id: product.brand_id || '',
            category_id: product.category_id || '',
            gender: product.gender || 'men',
            image: null,
            images: null,
            in_stock: !!product.in_stock,
            is_active: !!product.is_active,
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        submitEdit(route('admin.products.update', editingProduct.id), {
            onSuccess: () => { setEditingProduct(null); resetEdit(); }
        });
    };

    const handleDeleteProduct = (id) => {
        setDeleteModal({ isOpen: true, id: id, processing: false });
    };

    const executeDelete = () => {
        if (!deleteModal.id) return;
        setDeleteModal(prev => ({ ...prev, processing: true }));
        router.delete(route('admin.products.destroy', deleteModal.id), {
            onSuccess: () => setDeleteModal({ isOpen: false, id: null, processing: false }),
            onFinish: () => setDeleteModal(prev => ({ ...prev, processing: false })),
            preserveScroll: true
        });
    };



    return (
        <AdminLayout>
            <Head title="Admin Product Inventory" />

            <div className="space-y-8 font-sans text-slate-900">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Products.</h1>
                        <p className="text-sm font-medium text-[#86868B] mt-2">Manage your inventory items.</p>
                    </div>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-[#1D1D1F] hover:opacity-90 rounded-full transition shadow-sm active:scale-95 shrink-0 self-start sm:self-auto"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Product
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Products</p>
                        <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Showcase</p>
                        <p className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.active}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Value</p>
                        <p className="text-3xl font-extrabold text-slate-900 mt-2">₹{stats.value}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category:</label>
                            <select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                className="bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none transition cursor-pointer"
                            >
                                {categoryFilterOptions.map(cat => (
                                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Brand:</label>
                            <select value={selectedBrandFilter} onChange={(e) => setSelectedBrandFilter(e.target.value)}
                                className="bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 outline-none transition cursor-pointer"
                            >
                                {brandFilterOptions.map(b => (
                                    <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
                        <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-slate-800 mb-1">No products found</h3>
                        <p className="text-slate-500 text-sm">Add a new product to populate the inventory.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left">
                                <thead className="bg-[#F5F5F7] text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Brand</th>
                                        <th className="px-6 py-4">Collection</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                        {product.image_path ? (
                                                            <img src={product.image_path} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon size={18} className="text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">{product.name}</div>
                                                        <div className="text-xs text-slate-500 truncate max-w-xs">{product.description || 'No description'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600">
                                                    {product.category_relationship?.name || product.category || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                                                {product.brand?.name || 'Generic'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-bold uppercase text-slate-500">
                                                {product.gender}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                                                ₹{product.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.in_stock ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {product.in_stock ? 'In Stock' : 'Ordered'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    <span>{product.is_active ? 'Active' : 'Draft'}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                                                <button onClick={() => handleEditClick(product)}
                                                    className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:opacity-70 transition">
                                                    <Edit2 size={13} /> Edit
                                                </button>
                                                <button onClick={() => handleDeleteProduct(product.id)}
                                                    className="inline-flex items-center gap-1 font-bold text-rose-600 hover:opacity-70 transition">
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modal: Add Product ── */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative">
                        <button onClick={() => { setIsAddOpen(false); resetAdd(); }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition">
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Add New Catalog Item</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <FormFields data={addData} setData={setAddData} errors={addErrors} categories={categories} brands={brands} editingProduct={null} />
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => { setIsAddOpen(false); resetAdd(); }}
                                    className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700">
                                    Cancel
                                </button>
                                <button type="submit" disabled={addProcessing}
                                    className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#1D1D1F] hover:opacity-90 text-white transition active:scale-95 disabled:opacity-50">
                                    {addProcessing ? 'Saving...' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Modal: Edit Product ── */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative">
                        <button onClick={() => { setEditingProduct(null); resetEdit(); }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition">
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Edit Catalog Item</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <FormFields data={editData} setData={setEditData} errors={editErrors} categories={categories} brands={brands} editingProduct={editingProduct} />
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => { setEditingProduct(null); resetEdit(); }}
                                    className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700">
                                    Cancel
                                </button>
                                <button type="submit" disabled={editProcessing}
                                    className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#1D1D1F] hover:opacity-90 text-white transition active:scale-95 disabled:opacity-50">
                                    {editProcessing ? 'Saving...' : 'Update Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Confirm Delete Modal ── */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null, processing: false })}
                onConfirm={executeDelete}
                isProcessing={deleteModal.processing}
                title="Delete Product"
                message="Are you sure you want to delete this catalog item? This action cannot be undone."
            />
        </AdminLayout>
    );
}
