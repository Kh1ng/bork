import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/PageLayout";
import { useTheme } from "~/lib/theme";
import { profileFromAuthUser } from "~/lib/profile";
import { api } from "~/utils/api";

const UserSettingsPage = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isSaving, setIsSaving] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const profileQuery = api.profile.getCurrentProfile.useQuery(undefined, { enabled: !!user });
  const saveProfile = api.profile.createOrUpdateProfile.useMutation();

  const updateProfile = async (form: HTMLFormElement) => {
    if (!user) return;
    const formData = new FormData(form);
    const username = formData.get("username");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    if (typeof username !== "string" || typeof firstName !== "string" || typeof lastName !== "string") return;
    setIsSaving(true);
    try {
      await saveProfile.mutateAsync({
        username: username || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      const { error } = await supabase.auth.updateUser({ data: { username, firstName, lastName } });
      if (error) throw error;
      toast.success("Profile updated.");
      void profileQuery.refetch();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Couldn’t update your profile. Check the fields and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <PageLayout><div className="px-6 py-16 text-center"><h1 className="text-xl font-bold">Sign in to change settings.</h1><p className="bork-muted mt-2 text-sm">Your public feed is still available.</p></div></PageLayout>;
  }

  const authProfile = profileFromAuthUser(user);
  const savedUsername: unknown = profileQuery.data?.username;
  const savedFirstName: unknown = profileQuery.data?.firstName;
  const savedLastName: unknown = profileQuery.data?.lastName;
  const username = typeof savedUsername === "string" ? savedUsername : authProfile.username ?? "";
  const firstName = typeof savedFirstName === "string" ? savedFirstName : authProfile.firstName ?? "";
  const lastName = typeof savedLastName === "string" ? savedLastName : authProfile.lastName ?? "";
  const formKey = [username, firstName, lastName].join("|");

  return (
    <PageLayout>
      <header className="border-b px-5 py-6 bork-divider md:px-6"><h1 className="text-2xl font-extrabold tracking-[-0.025em]">Settings</h1><p className="bork-muted mt-1 text-sm">Profile details and appearance.</p></header>
      <form key={formKey} className="space-y-7 px-5 py-8 md:px-6" onSubmit={(event) => { event.preventDefault(); void updateProfile(event.currentTarget); }}>
        <section aria-labelledby="profile-settings"><h2 id="profile-settings" className="text-lg font-bold">Profile</h2><div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold sm:col-span-2">Email<input type="email" value={user.email || ""} disabled className="bork-input bork-muted mt-2" /></label>
          <label className="block text-sm font-bold sm:col-span-2">Username<input name="username" type="text" defaultValue={username} maxLength={20} className="bork-input mt-2" /></label>
          <label className="block text-sm font-bold">First name<input name="firstName" type="text" defaultValue={firstName} className="bork-input mt-2" /></label>
          <label className="block text-sm font-bold">Last name<input name="lastName" type="text" defaultValue={lastName} className="bork-input mt-2" /></label>
        </div></section>
        <section aria-labelledby="appearance-settings" className="border-t pt-7 bork-divider"><h2 id="appearance-settings" className="text-lg font-bold">Appearance</h2><p className="bork-muted mt-2 text-sm">Dark mode is Bork’s primary look. Light mode is fully supported.</p><button type="button" onClick={toggleTheme} className="bork-secondary-btn mt-4">Switch to {theme === "dark" ? "light" : "dark"} mode</button></section>
        <div className="border-t pt-6 bork-divider"><button type="submit" disabled={isSaving || saveProfile.isLoading} className="bork-primary-btn">{isSaving ? "Saving…" : "Save profile"}</button></div>
      </form>
    </PageLayout>
  );
};

export default UserSettingsPage;
