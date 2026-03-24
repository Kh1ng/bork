import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, useEffect } from "react";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

const UserSettingsPage: React.FC = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const profileQuery = api.profile.getCurrentProfile.useQuery(undefined, {
    enabled: !!user,
  });
  const saveProfile = api.profile.createOrUpdateProfile.useMutation();

  useEffect(() => {
    if (!user) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setUsername(profileQuery.data?.username || String(user.user_metadata?.username || ''));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setFirstName(profileQuery.data?.firstName || String(user.user_metadata?.firstName || ''));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setLastName(profileQuery.data?.lastName || String(user.user_metadata?.lastName || ''));
  }, [user, profileQuery.data]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await saveProfile.mutateAsync({
        username: username || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          firstName,
          lastName,
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
      void profileQuery.refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please sign in to access settings.</div>;
  }

  return (
    <PageLayout>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">User Settings</h1>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full rounded border border-sky-100 bg-sky-50 p-2 text-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-sky-200 p-2 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded border border-sky-200 p-2 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded border border-sky-200 p-2 outline-none focus:border-sky-400"
            />
          </div>

          <button
            onClick={() => void handleUpdateProfile()}
            disabled={loading || saveProfile.isLoading}
            className="tw-primary-btn"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserSettingsPage;
