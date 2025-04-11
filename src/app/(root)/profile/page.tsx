import DashboardHeader from '@/components/DashboardMenu/DashboardHeader';
import ProfileForm from '@/components/Profile/ProfileForm';
import React from 'react';

export default function ProfilePage() {
  return (
    <section className="flex flex-col gap-8">
      <DashboardHeader
        className="hidden py-6 lg:flex"
        heading="Profile Settings"
        subheading="Manage your profile information"
      />
      <ProfileForm />
    </section>
  );
}
