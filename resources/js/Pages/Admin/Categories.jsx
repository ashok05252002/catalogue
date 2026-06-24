import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

export default function Categories({ auth, categories = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Add Form
  const {
    data: addData,
    setData: setAddData,
    post: submitAdd,
    processing: addProcessing,
    errors: addErrors,
    reset: resetAdd
  } = useForm({
    name: '',
    gender: 'men',
    image: null
  });

  // Edit Form
  const {
    data: editData,
    setData: setEditData,
    post: submitEdit,
    processing: editProcessing,
    errors: editErrors,
    reset: resetEdit
  } = useForm({
    name: '',
    gender: 'men',
    image: null
  });

  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gender.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    submitAdd(route('admin.categories.store'), {
      onSuccess: () => {
        setIsAddOpen(false);
        resetAdd();
      }
    });
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setEditData({
      name: cat.name,
      gender: cat.gender,
      image: null
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    submitEdit(route('admin.categories.update', editingCategory.id), {
      onSuccess: () => {
        setEditingCategory(null);
        resetEdit();
      }
    });
  };

  const { delete: destroyCategory, processing: deleteProcessing } = useForm();
  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const executeDelete = () => {
    if (!deleteModal.id) return;
    destroyCategory(route('admin.categories.destroy', deleteModal.id), {
      onSuccess: () => setDeleteModal({ isOpen: false, id: null }),
      preserveScroll: true
    });
  };

  return (
    <AdminLayout>
      <Head title="Admin Categories Management" />

      <div className="space-y-8 font-sans text-slate-900">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Categories.</h1>
            <p className="text-sm font-medium text-[#86868B] mt-2">Organize your catalog by type.</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-[#1D1D1F] hover:opacity-90 rounded-full transition shadow-sm active:scale-95 text-center shrink-0 self-start sm:self-auto"
          >
            <Plus size={16} className="mr-2" />
            Add Category
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl text-sm outline-none text-slate-800 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 bg-white">
              <Search className="w-12 h-12 text-slate-350 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-800">No Categories Found</h3>
              <p className="text-xs text-[#86868B] mt-1">Add a new category or adjust your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-[#F5F5F7] text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Collection</th>
                    <th className="px-6 py-4">Items Count</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] overflow-hidden border border-slate-100 shrink-0">
                            {cat.image ? (
                              <img src={cat.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-400">
                                {cat.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-sm text-slate-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600 capitalize">
                          {cat.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm font-medium">
                        {cat.products_count ?? 0} products
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs space-x-3">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="inline-flex items-center font-bold text-indigo-655 hover:text-indigo-800 transition"
                        >
                          <Edit2 size={13} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
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
            title="Delete Category"
            message="Are you sure you want to delete this category? All products linked to this category will be updated."
        />
      </div>

      {/* Modal: Add Category */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => { setIsAddOpen(false); resetAdd(); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Create New Category</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Category Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAddData('image', e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
                {addErrors.image && <p className="text-xs text-rose-505 mt-1">{addErrors.image}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={addData.name}
                  onChange={(e) => setAddData('name', e.target.value)}
                  placeholder="e.g. Analog Watches"
                  className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-855 transition"
                />
                {addErrors.name && <p className="text-xs text-rose-500 mt-1">{addErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Collection</label>
                <div className="grid grid-cols-2 gap-2">
                  {['men', 'women'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setAddData('gender', g)}
                      className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                        addData.gender === g ? 'bg-[#1D1D1F] text-white shadow-sm' : 'bg-[#F5F5F7] text-[#86868B]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {addErrors.gender && <p className="text-xs text-rose-500 mt-1">{addErrors.gender}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); resetAdd(); }}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-205 transition text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addProcessing}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#1D1D1F] hover:opacity-90 text-white transition active:scale-95 disabled:opacity-50"
                >
                  {addProcessing ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => { setEditingCategory(null); resetEdit(); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Edit Category</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Category Cover Image (Leave empty to keep current)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditData('image', e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
                {editErrors.image && <p className="text-xs text-rose-500 mt-1">{editErrors.image}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData('name', e.target.value)}
                  className="w-full bg-[#F5F5F7] border-none focus:ring-2 focus:ring-slate-200 rounded-xl py-2.5 px-3 text-sm text-slate-855 transition"
                />
                {editErrors.name && <p className="text-xs text-rose-500 mt-1">{editErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Collection</label>
                <div className="grid grid-cols-2 gap-2">
                  {['men', 'women'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setEditData('gender', g)}
                      className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                        editData.gender === g ? 'bg-[#1D1D1F] text-white shadow-sm' : 'bg-[#F5F5F7] text-[#86868B]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {editErrors.gender && <p className="text-xs text-rose-505 mt-1">{editErrors.gender}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingCategory(null); resetEdit(); }}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editProcessing}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#1D1D1F] hover:opacity-90 text-white transition active:scale-95 disabled:opacity-50"
                >
                  {editProcessing ? 'Saving...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
