'use client';

import SectionHeader from '@/components/SectionHeader';

export default function AdminDashboard() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px-64px)] px-4">
      <div className="max-w-2xl text-center">
        <SectionHeader
          title="Admin Panel"
          description="Monitor your tech stack, projects, users, and other statistics at a glance."
          titleClassName="text-[44px] md:text-2xl font-bold"
          descriptionClassName="text-base md:text-xl"
        />
      </div>
    </div>
  );
}
