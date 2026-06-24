import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Upload, Trash2, ImageIcon, Users2 } from 'lucide-react';

function GenderCard({ gender }) {
  const [preview, setPreview] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    image: null,
  });

  const { delete: removeImg, processing: removing } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.genders.update', gender.id), {
      onSuccess: () => {
        reset();
        setPreview(null);
      },
    });
  };

  const handleRemove = () => {
    setDeleteModal(true);
  };

  const executeRemove = () => {
    removeImg(route('admin.genders.removeImage', gender.id), {
      onSuccess: () => setDeleteModal(false),
      preserveScroll: true
    });
  };

  const displayImage = preview || gender.image;
  const fallbackImage =
    gender.name === 'men'
      ? 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Cover Preview */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={displayImage || fallbackImage}
          alt={gender.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <div>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-0.5">Collection</p>
            <h2 className="text-2xl font-bold text-white capitalize">{gender.name}</h2>
          </div>
        </div>
        {gender.image && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-500 text-white shadow">
              Custom Cover
            </span>
          </div>
        )}
        {!gender.image && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-500/80 text-white shadow">
              Default Cover
            </span>
          </div>
        )}
      </div>

      {/* Upload Form */}
      <div className="p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 capitalize">
          Update {gender.name}'s Cover Image
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Upload New Cover
            </label>
            <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-5 bg-[#F5F5F7]/50 hover:border-slate-400 transition-colors cursor-pointer group">
              <label className="w-full cursor-pointer text-center">
                <div className="space-y-2">
                  <Upload className="mx-auto h-7 w-7 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </div>
                  <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 4MB</p>
                  {data.image && (
                    <p className="text-xs text-green-600 font-bold mt-1">✓ {data.image.name}</p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {errors.image && <p className="text-xs text-rose-500 mt-1">{errors.image}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={processing || !data.image}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-[#1D1D1F] hover:opacity-90 text-white transition active:scale-95 disabled:opacity-40"
            >
              <ImageIcon size={14} />
              {processing ? 'Uploading...' : 'Update Cover'}
            </button>

            {gender.image && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={removing}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition active:scale-95 disabled:opacity-40 flex items-center gap-2"
              >
                <Trash2 size={14} />
                {removing ? 'Removing...' : 'Remove'}
              </button>
            )}
          </div>
        </form>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={executeRemove}
        isProcessing={removing}
        title="Remove Cover Image"
        message={`Are you sure you want to remove the cover image for ${gender.name}?`}
      />
    </div>
  );
}

export default function Genders({ auth, genders = [] }) {
  return (
    <AdminLayout>
      <Head title="Admin — Gender Collections" />

      <div className="space-y-8 font-sans text-slate-900">
        {/* Header */}
        <div className="flex flex-col border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#1D1D1F] flex items-center justify-center shadow-sm">
              <Users2 size={18} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Genders.</h1>
          </div>
          <p className="text-sm font-medium text-[#86868B] mt-2 ml-12">
            Manage cover images for Men and Women collections shown on the catalog homepage.
          </p>
        </div>

        {/* Gender Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {genders.map((gender) => (
            <GenderCard key={gender.id} gender={gender} />
          ))}

          {genders.length === 0 && (
            <div className="col-span-2 text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-800">No gender records found</h3>
              <p className="text-xs text-[#86868B] mt-1">Run the database seeder to create Men and Women records.</p>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <p className="text-xs font-semibold text-blue-700 leading-relaxed">
            <span className="font-black">ℹ How it works:</span> The cover images you upload here are displayed on the
            public catalog homepage as clickable cards for the Men and Women collections. If no custom image is uploaded,
            a default stock image is shown.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
