import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Plus, Search, Edit2, Trash2, X, ImageIcon } from 'lucide-react';

// ─── Reusable premium image uploader ───────────────────────────────────────
function ImageUpload({ label, hint, currentSrc, onChange }) {
    const [preview, setPreview] = useState(null);
    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        onChange(file);
    };
    const displaySrc = preview || currentSrc;
    return (
        <div className="space-y-1.5">
            {label && <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>}
            <label className="block cursor-pointer group">
                <div className={`relative border-2 border-dashed rounded-xl transition-all overflow-hidden
                    ${displaySrc ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-[#F5F5F7] hover:border-slate-400'}`}>
                    {displaySrc ? (
                        <div className="relative">
                            <img src={displaySrc} alt="preview" className="w-full h-32 object-contain p-2" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <ImageIcon size={16} className="text-white" />
                                <span className="text-white text-xs font-bold">Change Logo</span>
                            </div>
                        </div>
                    ) : (
                        <div className="py-5 flex flex-col items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                                <ImageIcon size={16} className="text-slate-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-semibold text-indigo-600">Click to upload</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{hint || 'PNG, JPG, WEBP up to 2MB'}</p>
                            </div>
                        </div>
                    )}
                </div>
                <input type="file" accept="image/*" className="sr-only" onChange={handleChange} />
            </label>
            {preview && <p className="text-[10px] text-green-600 font-semibold">✓ New logo selected</p>}
        </div>
    );
}
// ───────────────────────────────────────────────────────────────────────────

export default function Brands({ auth, brands = [], categories = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('All');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  // Add Brand Form
  const {
    data: addData,
    setData: setAddData,
    post: submitAdd,
    processing: addProcessing,
    errors: addErrors,
    reset: resetAdd
  } = useForm({
    name: '',
    description: '',
    logo: null,
    gender: 'men',
    category_id: '',
  });

  // Edit Brand Form
  const {
    data: editData,
    setData: setEditData,
    post: submitEdit,
    processing: editProcessing,
    errors: editErrors,
    reset: resetEdit
  } = useForm({
    name: '',
    description: '',
    logo: null,
    gender: 'men',
    category_id: '',
  });

  // Derive categories filtered by the selected gender (for add form)
  const addCategoryOptions = useMemo(() => {
    if (!addData.gender) return categories;
    return categories.filter(c => c.gender === addData.gender);
  }, [addData.gender, categories]);

  // Derive categories filtered by the selected gender (for edit form)
  const editCategoryOptions = useMemo(() => {
    if (!editData.gender) return categories;
    return categories.filter(c => c.gender === editData.gender);
  }, [editData.gender, categories]);

  const filteredBrands = useMemo(() => {
    return brands.filter(b =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [brands, searchTerm]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    submitAdd(route('admin.brands.store'), {
      onSuccess: () => {
        setIsAddOpen(false);
        resetAdd();
      }
    });
  };

  const handleEditClick = (brand) => {
    setEditingBrand(brand);
    setEditData({
      name: brand.name,
      description: brand.description || '',
      logo: null,
      gender: brand.gender || 'men',
      category_id: brand.category_id ? String(brand.category_id) : '',
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    submitEdit(route('admin.brands.update', editingBrand.id), {
      onSuccess: () => {
        setEditingBrand(null);
        resetEdit();
      }
    });
  };

  const { delete: destroyBrand, processing: deleteProcessing } = useForm();
  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const executeDelete = () => {
    if (!deleteModal.id) return;
    destroyBrand(route('admin.brands.destroy', deleteModal.id), {
      onSuccess: () => setDeleteModal({ isOpen: false, id: null }),
      preserveScroll: true
    });
  };

  const GenderToggle = ({ value, onChange }) => (
    <div className="grid grid-cols-2 gap-2">
      {['men', 'women'].map(g => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
            value === g ? 'bg-[#1D1D1F] text-white shadow-sm' : 'bg-[#F5F5F7] text-[#86868B]'
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  );

  return (
    <AdminLayout>
      <Head title="Admin Brands Management" />

      <div className="space-y-8 font-sans text-slate-900">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Brands.</h1>
            <p className="text-sm font-medium text-[#86868B] mt-2">Manage your brand identities.</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-[#1D1D1F] hover:opacity-90 rounded-full transition shadow-sm active:scale-95 text-center shrink-0 self-start sm:self-auto"
          >
            <Plus size={16} className="mr-2" />
            Add Brand
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search brands..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl text-sm outline-none text-slate-800 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
          {filteredBrands.length === 0 ? (
            <div className="text-center py-16 bg-white">
              <Search className="w-12 h-12 text-slate-350 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-800">No Brands Found</h3>
              <p className="text-xs text-[#86868B] mt-1">Add a new brand or clear your search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-[#F5F5F7] text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Collection</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBrands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 p-1 flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
                            {brand.logo ? (
                              <img src={brand.logo} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-xs font-extrabold text-slate-400">
                                {brand.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-sm text-slate-900">{brand.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600 capitalize">
                          {brand.gender || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-medium">
                        {brand.category?.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate font-medium">
                        {brand.description || 'No description provided'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs space-x-3">
                        <button
                          onClick={() => handleEditClick(brand)}
                          className="inline-flex items-center font-bold text-indigo-650 hover:text-indigo-800 transition"
                        >
                          <Edit2 size={13} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="inline-flex items-center font-bold text-rose-655 hover:text-rose-800 transition"
                        >
                          <Trash2 size={13} className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* ── Confirm Delete Modal ── */}
        <ConfirmDeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, id: null })}
            onConfirm={executeDelete}
            isProcessing={deleteProcessing}
            title="Delete Brand"
            message="Are you sure you want to delete this brand? This action cannot be undone."
        />
      </div>

      {/* Modal: Add Brand */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setIsAddOpen(false); resetAdd(); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Create New Brand</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Brand Name</label>
                <input
                  type="text"
                  required
                  value={addData.name}
                  onChange={(e) => setAddData('name', e.target.value)}
                  placeholder="e.g. Rolex"
                  className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-850 transition"
                />
                {addErrors.name && <p className="text-xs text-rose-500 mt-1">{addErrors.name}</p>}
              </div>

              {/* Gender Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Gender Collection</label>
                <GenderToggle
                  value={addData.gender}
                  onChange={(g) => { setAddData('gender', g); setAddData('category_id', ''); }}
                />
                {addErrors.gender && <p className="text-xs text-rose-500 mt-1">{addErrors.gender}</p>}
              </div>

              {/* Category – filtered by gender */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Category <span className="normal-case text-slate-400">(filtered by {addData.gender})</span>
                </label>
                <select
                  value={addData.category_id}
                  onChange={(e) => setAddData('category_id', e.target.value)}
                  className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-850 transition"
                >
                  <option value="">— Select a category —</option>
                  {addCategoryOptions.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {addCategoryOptions.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No categories for {addData.gender}. Add some in Categories first.</p>
                )}
                {addErrors.category_id && <p className="text-xs text-rose-500 mt-1">{addErrors.category_id}</p>}
              </div>

              <div>
                <ImageUpload
                  label="Brand Logo"
                  hint="Square logo recommended"
                  onChange={(file) => setAddData('logo', file)}
                />
                {addErrors.logo && <p className="text-xs text-rose-500 mt-1">{addErrors.logo}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                <textarea
                  value={addData.description}
                  onChange={(e) => setAddData('description', e.target.value)}
                  rows="3"
                  placeholder="Tell us about this brand..."
                  className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-855 transition resize-none font-sans"
                />
                {addErrors.description && <p className="text-xs text-rose-500 mt-1">{addErrors.description}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); resetAdd(); }}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addProcessing}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#1D1D1F] hover:opacity-90 text-white transition active:scale-95 disabled:opacity-50"
                >
                  {addProcessing ? 'Creating...' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Brand */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setEditingBrand(null); resetEdit(); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Edit Brand</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Brand Name</label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData('name', e.target.value)}
                  className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-855 transition"
                />
                {editErrors.name && <p className="text-xs text-rose-500 mt-1">{editErrors.name}</p>}
              </div>

              {/* Gender Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Gender Collection</label>
                <GenderToggle
                  value={editData.gender}
                  onChange={(g) => { setEditData('gender', g); setEditData('category_id', ''); }}
                />
                {editErrors.gender && <p className="text-xs text-rose-500 mt-1">{editErrors.gender}</p>}
              </div>

              {/* Category – filtered by gender */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Category <span className="normal-case text-slate-400">(filtered by {editData.gender})</span>
                </label>
                <select
                  value={editData.category_id}
                  onChange={(e) => setEditData('category_id', e.target.value)}
                  className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-850 transition"
                >
                  <option value="">— Select a category —</option>
                  {editCategoryOptions.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {editCategoryOptions.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No categories for {editData.gender}. Add some in Categories first.</p>
                )}
                {editErrors.category_id && <p className="text-xs text-rose-500 mt-1">{editErrors.category_id}</p>}
              </div>

              <div>
                <ImageUpload
                  label="Brand Logo (Leave empty to keep current)"
                  hint="Square logo recommended"
                  currentSrc={editingBrand?.logo}
                  onChange={(file) => setEditData('logo', file)}
                />
                {editErrors.logo && <p className="text-xs text-rose-500 mt-1">{editErrors.logo}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData('description', e.target.value)}
                  rows="3"
                  className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-855 transition resize-none font-sans"
                />
                {editErrors.description && <p className="text-xs text-rose-500 mt-1">{editErrors.description}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingBrand(null); resetEdit(); }}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editProcessing}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#1D1D1F] hover:opacity-90 text-white transition active:scale-95 disabled:opacity-50"
                >
                  {editProcessing ? 'Saving...' : 'Update Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
