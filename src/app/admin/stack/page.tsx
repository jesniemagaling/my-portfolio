'use client';

import { useEffect, useState } from 'react';
import stackApi from '@/lib/adminStackApi';
import Modal from '@/components/Modal';
import { PrimaryButton, SecondaryButton } from '@/components/CustomButtons';
import { Upload } from 'lucide-react';

interface TechItem {
  id: string;
  name: string;
  icon: string;
  category?: string;
  link?: string;
}

export default function TechStackPage() {
  const [items, setItems] = useState<TechItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    icon: '',
    category: '',
    link: '',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all tech stack items
  const fetchItems = async (signal?: AbortSignal) => {
    try {
      const res = await stackApi.get('/', { signal });
      setItems(res.data || []);
    } catch (error: any) {
      if (error.name === 'CanceledError') return;
      console.error('Error fetching tech stack:', error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchItems(controller.signal);
    return () => controller.abort();
  }, []);

  const handleAdd = () => {
    setEditId(null);
    setForm({ name: '', icon: '', category: '', link: '' });
    setModalOpen(true);
  };

  const handleEdit = (item: TechItem) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      icon: item.icon,
      category: item.category || '',
      link: item.link || '',
    });
    setModalOpen(true);
  };

  // File upload + preview
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, icon: reader.result as string }));
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-icon', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, icon: data.url })); // final URL for saving
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const saveItem = async () => {
    if (!form.name || !form.icon) return;
    setLoading(true);

    try {
      if (editId) {
        await stackApi.put('/', { id: editId, ...form });
      } else {
        await stackApi.post('/', form);
      }
      setModalOpen(false);
      setForm({ name: '', icon: '', category: '', link: '' });
      setEditId(null);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await stackApi.delete(`/?id=${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mt-20 mb-4">
        <h1 className="text-2xl font-bold">Tech Stack</h1>
        <PrimaryButton onClick={handleAdd}>Add Tech Stack</PrimaryButton>
      </div>

      {/* Tech Stack List */}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between p-4 border rounded border-gray-300 dark:border-[rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center gap-4">
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.name}
                  className="object-contain w-8 h-8"
                />
              )}
              <p className="font-medium">{item.name}</p>
            </div>
            <div className="flex gap-2 ml-2">
              <PrimaryButton onClick={() => handleEdit(item)}>
                Edit
              </PrimaryButton>
              <SecondaryButton onClick={() => removeItem(item.id)}>
                Delete
              </SecondaryButton>
            </div>
          </li>
        ))}
      </ul>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setForm({ name: '', icon: '', category: '', link: '' });
            setEditId(null);
          }}
          title={editId ? 'Edit Tech Stack' : 'Add Tech Stack'}
        >
          <div className="space-y-4">
            {/* Icon Upload */}
            <div className="flex flex-col items-center justify-center flex-1 min-w-[250px] mt-2">
              <label
                htmlFor="icon"
                className="flex flex-col items-center justify-center w-full h-32 p-4 text-gray-500 transition border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-gray-400"
              >
                {form.icon ? (
                  <img
                    src={form.icon}
                    alt="Icon preview"
                    className="object-contain w-16 h-16 rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload size={28} strokeWidth={1.5} className="mb-2" />
                    <span className="font-medium text-gray-500">
                      Upload Icon
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  id="icon"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {loading && (
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              )}
            </div>

            {/* Tech Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Tech Name</label>
              <input
                type="text"
                placeholder="Enter tech name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Category</label>
              <input
                type="text"
                placeholder="Enter category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>

            {/* Link */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Link</label>
              <input
                type="text"
                placeholder="Enter link URL"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-3">
              <SecondaryButton
                onClick={() => {
                  setModalOpen(false);
                  setForm({ name: '', icon: '', category: '', link: '' });
                  setEditId(null);
                }}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                onClick={saveItem}
                disabled={!form.name || !form.icon || loading}
              >
                {loading ? 'Saving...' : editId ? 'Update' : 'Add'}
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
