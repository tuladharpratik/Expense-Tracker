'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useUpdateUser } from '@/lib/hooks';
import { toast } from 'sonner';
import Input from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Cards/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar/Avatar';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface ProfileFormData {
  email: string;
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const { mutate: updateUser } = useUpdateUser({
    onSuccess: async (data) => {
      try {
        toast.success('Profile updated successfully');

        // Update the session
        await update();

        setIsEditing(false);
      } catch (error) {
        console.error('Session update error:', error);
        toast.error('Profile updated but session refresh failed');
      }
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to update profile';
      toast.error(errorMessage);
      console.error('Update error:', error);
    },
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || '',
        username: session.user.username || '',
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username || !formData.email) {
      toast.error('Username and email are required');
      return;
    }

    // Validate password change
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required to change password');
        return;
      }
      if (!formData.newPassword) {
        toast.error('New password is required');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
    }

    try {
      updateUser({
        where: { id: session?.user?.id },
        data: {
          username: formData.username,
          email: formData.email,
          ...(formData.newPassword && {
            password: formData.newPassword,
            currentPassword: formData.currentPassword,
          }),
        },
      });

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Add your account deletion logic here
      await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Account deleted successfully');
      router.push('/auth/signin');
    } catch (error) {
      toast.error('Failed to delete account');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      {/* Profile Information Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg">{session?.user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{session?.user?.username}</h3>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />

            {isEditing && (
              <>
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  icon={showPassword ? 'mdi:eye' : 'mdi:eye-off'}
                  iconClick={() => setShowPassword(!showPassword)}
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  icon={showPassword ? 'mdi:eye' : 'mdi:eye-off'}
                  iconClick={() => setShowPassword(!showPassword)}
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  icon={showPassword ? 'mdi:eye' : 'mdi:eye-off'}
                  iconClick={() => setShowPassword(!showPassword)}
                />
              </>
            )}

            <div className="flex justify-end space-x-2">
              {!isEditing ? (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
