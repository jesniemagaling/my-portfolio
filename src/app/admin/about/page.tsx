'use client';

import { useEffect, useState } from 'react';
import aboutApi from '@/lib/adminAboutApi';
import Modal from '@/components/Modal';
import { PrimaryButton, SecondaryButton } from '@/components/CustomButtons';

interface Education {
  school: string;
  degree: string;
  startYear: number;
  endYear: number;
}

interface About {
  id: string;
  about: string;
  goal: string;
  education: Education[];
}

export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<About>({
    id: '',
    about: '',
    goal: '',
    education: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editType, setEditType] = useState<
    'about' | 'goal' | 'education' | null
  >(null);
  const [editEducationIndex, setEditEducationIndex] = useState<number | null>(
    null
  );
  const [formValue, setFormValue] = useState<string>('');
  const [eduForm, setEduForm] = useState<Education>({
    school: '',
    degree: '',
    startYear: 2022,
    endYear: 2026,
  });
  const loadAbout = async () => {
    try {
      // Use aboutApi if you want admin access; or api.get('/about') for public read
      const res = await aboutApi.get('/');
      setAboutData(res.data);
    } catch (error) {
      console.error('Error fetching about:', error);
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  const openModal = (
    type: 'about' | 'goal' | 'education',
    index: number | null = null
  ) => {
    setEditType(type);
    if (type === 'education') {
      if (index !== null) {
        setEditEducationIndex(index);
        setEduForm(aboutData.education[index]);
      } else {
        setEditEducationIndex(null);
        setEduForm({ school: '', degree: '', startYear: 2022, endYear: 2026 });
      }
    } else {
      setFormValue(type === 'about' ? aboutData.about : aboutData.goal);
    }
    setModalOpen(true);
  };

  const saveField = async () => {
    setLoading(true);
    try {
      if (editType === 'about' || editType === 'goal') {
        const payload = { [editType]: formValue };
        await aboutApi.put('/', payload); // use aboutApi
        setAboutData({ ...aboutData, ...payload });
      } else if (editType === 'education') {
        const newEducation = [...aboutData.education];
        if (editEducationIndex !== null) {
          newEducation[editEducationIndex] = eduForm;
        } else {
          newEducation.push(eduForm);
        }
        await aboutApi.put('/', { education: newEducation }); // use aboutApi
        setAboutData({ ...aboutData, education: newEducation });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalOpen(false);
      setLoading(false);
    }
  };

  const deleteEducation = async (index: number) => {
    if (!confirm('Delete this education entry?')) return;
    const newEducation = aboutData.education.filter((_, i) => i !== index);
    try {
      await aboutApi.put('/', { education: newEducation }); // use aboutApi
      setAboutData({ ...aboutData, education: newEducation });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* About Section */}
      <div className="flex items-center justify-between mt-20 mb-2">
        <h1 className="text-2xl font-bold">About Me</h1>
        <PrimaryButton onClick={() => openModal('about')}>Edit</PrimaryButton>
      </div>
      <div className="p-4 mb-6 border border-gray-300 rounded-md dark:border-[rgba(255,255,255,0.06)]">
        {aboutData.about || 'No content yet'}
      </div>

      {/* Goal Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Goal</h2>
        <PrimaryButton onClick={() => openModal('goal')}>Edit</PrimaryButton>
      </div>
      <div className="p-4 mb-6 border border-gray-300 rounded-md dark:border-[rgba(255,255,255,0.06)]">
        {aboutData.goal || 'No content yet'}
      </div>

      {/* Education Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Education</h2>
        <PrimaryButton onClick={() => openModal('education', null)}>
          Add
        </PrimaryButton>
      </div>
      <div className="space-y-2">
        {aboutData.education.map((edu, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border border-gray-300 rounded-md dark:border-[rgba(255,255,255,0.06)]"
          >
            <div>
              <p className="mb-1 font-medium">{edu.school}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {edu.degree} ({edu.startYear} - {edu.endYear})
              </p>
            </div>
            <div className="flex gap-2 ml-2">
              <PrimaryButton
                className="px-3 py-1 text-sm"
                onClick={() => openModal('education', i)}
              >
                Edit
              </PrimaryButton>
              <SecondaryButton
                className="px-3 py-1 text-sm"
                onClick={() => deleteEducation(i)}
              >
                Delete
              </SecondaryButton>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editType === 'about'
            ? 'Edit About'
            : editType === 'goal'
            ? 'Edit Goal'
            : editEducationIndex !== null
            ? 'Edit Education'
            : 'Add Education'
        }
      >
        {editType === 'about' || editType === 'goal' ? (
          <textarea
            rows={6}
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
          />
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="School"
              value={eduForm.school}
              onChange={(e) =>
                setEduForm({ ...eduForm, school: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
            />
            <input
              type="text"
              placeholder="Degree"
              value={eduForm.degree}
              onChange={(e) =>
                setEduForm({ ...eduForm, degree: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Start Year"
                value={eduForm.startYear}
                onChange={(e) =>
                  setEduForm({
                    ...eduForm,
                    startYear: parseInt(e.target.value),
                  })
                }
                className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-md placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400 bg-transparent"
              />
              <input
                type="number"
                placeholder="End Year"
                value={eduForm.endYear}
                onChange={(e) =>
                  setEduForm({ ...eduForm, endYear: parseInt(e.target.value) })
                }
                className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-md placeholder-[#7E7D7E] focus:outline-none focus:border-gray-600 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400 bg-transparent"
              />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-3">
          <SecondaryButton onClick={() => setModalOpen(false)}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={saveField} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
