'use client';
import { useEffect, useState } from 'react';
import projectApi from '@/lib/adminProjectApi';
import Modal from '@/components/Modal';
import { PrimaryButton, SecondaryButton } from '@/components/CustomButtons';
import { makeSlug } from '@/lib/slugify';

interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  stack: string[];
  linkRepo: string;
  linkLive: string;
  image: string;
  createdAt: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProjects = async (signal?: AbortSignal) => {
    try {
      const res = await projectApi.get('/', { signal });
      setProjects(res.data || []);
    } catch (error: any) {
      if (error.name === 'CanceledError') return;
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadProjects(controller.signal);
    return () => controller.abort();
  }, []);

  const openAddModal = () => {
    setEditProject(null);
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditProject(project);
    setModalOpen(true);
  };

  const deleteProject = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectApi.delete(`/?slug=${slug}`);
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const saveProject = async (form: any) => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        stack: form.stack.split(',').map((s: string) => s.trim()),
      };

      if (!editProject) {
        // New project
        payload.slug = makeSlug(payload.name);
        await projectApi.post('/', payload);
      } else {
        // Update existing
        await projectApi.put('/', { id: editProject.id, ...payload });
      }

      loadProjects();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const ProjectForm = () => {
    const [form, setForm] = useState({
      name: editProject?.name || '',
      description: editProject?.description || '',
      slug: editProject?.slug || makeSlug(editProject?.name || ''),
      stack: editProject?.stack?.join(', ') || '',
      linkRepo: editProject?.linkRepo || '',
      linkLive: editProject?.linkLive || '',
      image: editProject?.image || '',
    });

    useEffect(() => {
      setForm({
        name: editProject?.name || '',
        description: editProject?.description || '',
        slug: editProject?.slug || makeSlug(editProject?.name || ''),
        stack: editProject?.stack?.join(', ') || '',
        linkRepo: editProject?.linkRepo || '',
        linkLive: editProject?.linkLive || '',
        image: editProject?.image || '',
      });
    }, [editProject]);

    return (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
              slug: makeSlug(e.target.value),
            })
          }
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
        />

        <input
          placeholder="Stack (comma separated)"
          value={form.stack}
          onChange={(e) => setForm({ ...form, stack: e.target.value })}
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
        />

        <input
          placeholder="GitHub Repo URL"
          value={form.linkRepo}
          onChange={(e) => setForm({ ...form, linkRepo: e.target.value })}
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
        />

        <input
          placeholder="Live Link URL"
          value={form.linkLive}
          onChange={(e) => setForm({ ...form, linkLive: e.target.value })}
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
        />

        <input
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
        />

        <div className="flex justify-end gap-2 mt-3">
          <SecondaryButton onClick={() => setModalOpen(false)}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={() => saveProject(form)} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </PrimaryButton>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mt-20 mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <PrimaryButton onClick={openAddModal}>Add Project</PrimaryButton>
      </div>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-4 p-4 rounded-xl border border-gray-300 shadow-sm dark:border-[rgba(255,255,255,0.06)] md:flex-row md:items-center md:justify-between"
          >
            <div className="flex flex-col w-full gap-1 md:w-3/4">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 max-h-[80px] overflow-y-auto pr-1">
                {p.description}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <span className="font-medium">Stack:</span> {p.stack.join(', ')}
              </p>
              <div className="flex gap-3 mt-2">
                {p.linkRepo && (
                  <a
                    href={p.linkRepo}
                    target="_blank"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {p.linkLive && (
                  <a
                    href={p.linkLive}
                    target="_blank"
                    className="text-sm font-medium text-green-600 hover:underline"
                  >
                    Live
                  </a>
                )}
              </div>
            </div>

            <div className="flex self-end gap-2 md:self-auto">
              <PrimaryButton onClick={() => openEditModal(p)}>
                Edit
              </PrimaryButton>
              <SecondaryButton onClick={() => deleteProject(p.slug)}>
                Delete
              </SecondaryButton>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProject ? 'Edit Project' : 'Add Project'}
      >
        <ProjectForm />
      </Modal>
    </div>
  );
}
