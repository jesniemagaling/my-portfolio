"use client";

import { useEffect, useState } from "react";
import projectApi from "@/lib/adminProjectApi";
import Modal from "@/components/Modal";
import { PrimaryButton, SecondaryButton } from "@/components/CustomButtons";
import { makeSlug } from "@/lib/slugify";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/checkAdmin";

interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  stack: string[];
  linkRepo: string;
  linkLive: string;
  image: string;
  images: string[];
  createdAt: string;
}

export default function AdminProjects() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    slug: "",
    stack: "",
    linkRepo: "",
    linkLive: "",
    image: "",
    images: [] as string[],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setChecking(false);
  }, []);

  // Fetch all projects
  const fetchProjects = async (signal?: AbortSignal) => {
    try {
      const res = await projectApi.get("/", { signal });
      setProjects(res.data || []);
    } catch (error: any) {
      if (error.name === "CanceledError") return;
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal);
    return () => controller.abort();
  }, []);

  const handleAdd = () => {
    setEditId(null);
    setForm({
      name: "",
      description: "",
      slug: "",
      stack: "",
      linkRepo: "",
      linkLive: "",
      image: "",
      images: [],
    });
    setModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      slug: project.slug,
      stack: project.stack.join(", "),
      linkRepo: project.linkRepo,
      linkLive: project.linkLive,
      image: project.image,
      images: project.images || [],
    });
    setModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/project", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload/project", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
        }
      } catch (err) {
        console.error("Gallery upload failed", err);
      }
    }
    e.target.value = "";
    setUploading(false);
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const saveProject = async () => {
    if (!form.name || !form.image) return;
    setLoading(true);

    try {
      const payload = {
        ...form,
        stack: form.stack.split(",").map((s) => s.trim()),
      };
      if (!editId) {
        payload.slug = makeSlug(payload.name);
        await projectApi.post("/", payload);
      } else {
        await projectApi.put("/", { id: editId, ...payload });
      }

      setModalOpen(false);
      setForm({
        name: "",
        description: "",
        slug: "",
        stack: "",
        linkRepo: "",
        linkLive: "",
        image: "",
        images: [],
      });
      setEditId(null);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectApi.delete(`/?slug=${slug}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (checking || loadingData) {
    return (
      <div className="animate-pulse mt-20">
        {/* Header row skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-24 rounded-lg bg-gray-200 dark:bg-secondary-dark" />
          <div className="h-9 w-28 rounded-lg bg-gray-200 dark:bg-secondary-dark" />
        </div>

        {/* Project row skeletons */}
        <ul className="space-y-4">
          {[1, 2, 3].map((n) => (
            <li
              key={n}
              className="flex flex-col gap-4 p-4 border rounded border-gray-200 dark:border-[rgba(255,255,255,0.06)] md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4 md:w-3/4">
                <div className="h-40 w-32 flex-shrink-0 rounded-lg bg-gray-200 dark:bg-secondary-dark sm:w-64" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-5 w-1/2 rounded-lg bg-gray-200 dark:bg-secondary-dark" />
                  <div className="h-3.5 w-full rounded-full bg-gray-200 dark:bg-secondary-dark" />
                  <div className="h-3.5 w-[90%] rounded-full bg-gray-200 dark:bg-secondary-dark" />
                  <div className="h-3.5 w-3/4 rounded-full bg-gray-200 dark:bg-secondary-dark" />
                  <div className="h-3 w-2/5 rounded-full bg-gray-200 dark:bg-secondary-dark mt-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-16 rounded-lg bg-gray-200 dark:bg-secondary-dark" />
                <div className="h-9 w-16 rounded-lg bg-gray-200 dark:bg-secondary-dark" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mt-20 mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <PrimaryButton onClick={handleAdd}>Add Project</PrimaryButton>
      </div>

      {/* Project List */}
      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex flex-col gap-4 p-4 border rounded border-gray-300 shadow-sm dark:border-[rgba(255,255,255,0.06)] md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4 md:w-3/4">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="object-cover w-32 h-40 rounded sm:w-64"
                />
              )}
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 max-h-[80px] overflow-y-auto pr-1">
                  {project.description}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  <span className="font-medium">Stack:</span>{" "}
                  {project.stack.join(", ")}
                </p>
                <div className="flex gap-3 mt-2">
                  {project.linkRepo && (
                    <a
                      href={project.linkRepo}
                      target="_blank"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {project.linkLive && (
                    <a
                      href={project.linkLive}
                      target="_blank"
                      className="text-sm font-medium text-green-600 hover:underline"
                    >
                      Live
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <PrimaryButton onClick={() => handleEdit(project)}>
                Edit
              </PrimaryButton>
              <SecondaryButton onClick={() => deleteProject(project.slug)}>
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
            setForm({
              name: "",
              description: "",
              slug: "",
              stack: "",
              linkRepo: "",
              linkLive: "",
              image: "",
              images: [],
            });
            setEditId(null);
          }}
          title={editId ? "Edit Project" : "Add Project"}
        >
          {/* Scrollable form fields */}
          <div className="max-h-[58vh] overflow-y-auto pr-1 space-y-4">
            {/* Cover Image Upload */}
            <div className="flex flex-col items-center justify-center flex-1 min-w-[250px] mt-4">
              <label className="mb-1 w-full text-sm font-medium">
                Cover Image
              </label>
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-40 p-4 text-gray-500 transition border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-gray-400 dark:border-[rgba(255,255,255,0.06)]"
              >
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload size={28} strokeWidth={1.5} className="mb-2" />
                    <span className="font-medium text-gray-500">
                      Upload Cover Image
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(e)
                  }
                />
              </label>
              {uploading && (
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              )}
            </div>

            {/* Gallery Images */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">
                Gallery Images{" "}
                <span className="font-normal text-gray-400">
                  (optional — shown in detail page slider)
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-16 w-24 overflow-hidden rounded-lg border border-gray-300 dark:border-[rgba(255,255,255,0.06)]"
                  >
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Add more images button */}
                <label
                  htmlFor="gallery"
                  className="flex h-16 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 transition hover:border-gray-400 dark:border-[rgba(255,255,255,0.06)]"
                >
                  <Upload size={18} />
                  <input
                    type="file"
                    id="gallery"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryFileChange}
                  />
                </label>
              </div>
            </div>

            {/* Project Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Project Name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: makeSlug(e.target.value),
                  })
                }
                className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Description</label>
              <textarea
                placeholder="Enter project description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>

            {/* Stack */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Tech Stack</label>
              <input
                type="text"
                placeholder="Enter tech stack (comma separated)"
                value={form.stack}
                onChange={(e) => setForm({ ...form, stack: e.target.value })}
                className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>

            {/* GitHub Repo */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">
                GitHub Repository
              </label>
              <input
                type="text"
                placeholder="Enter GitHub repository URL"
                value={form.linkRepo}
                onChange={(e) => setForm({ ...form, linkRepo: e.target.value })}
                className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>

            {/* Live Link */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">
                Live Project Link
              </label>
              <input
                type="text"
                placeholder="Enter live project URL"
                value={form.linkLive}
                onChange={(e) => setForm({ ...form, linkLive: e.target.value })}
                className="w-full rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>
          </div>

          {/* Actions — always visible outside scroll area */}
          <div className="flex justify-end gap-2 mt-4">
            <SecondaryButton
              onClick={() => {
                setModalOpen(false);
                setForm({
                  name: "",
                  description: "",
                  slug: "",
                  stack: "",
                  linkRepo: "",
                  linkLive: "",
                  image: "",
                  images: [],
                });
                setEditId(null);
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={saveProject}
              disabled={!form.name || !form.image || loading || uploading}
            >
              {loading ? "Saving..." : editId ? "Update" : "Add"}
            </PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
