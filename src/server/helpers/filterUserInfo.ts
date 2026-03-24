import { type User } from '@supabase/auth-helpers-nextjs'

export interface UserProfile {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export const createUserProfile = (user: User): UserProfile => {
  const userMetadata = user.user_metadata as Record<string, unknown> | null;
  
  return {
    id: user.id,
    username: (userMetadata?.username as string) || user.email?.split('@')[0] || null,
    firstName: (userMetadata?.firstName as string) || null,
    lastName: (userMetadata?.lastName as string) || null,
    profileImageUrl:
      (userMetadata?.avatar_url as string) ||
      (userMetadata?.avatar as string) ||
      null,
  }
}

export const filterUserInfo = (user: User): UserProfile => {
  return createUserProfile(user)
}

export default filterUserInfo
