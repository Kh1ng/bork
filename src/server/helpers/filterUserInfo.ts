import { currentUser } from "@clerk/nextjs/";
import type { User } from "@clerk/nextjs/dist/api";

const filterUserInfo = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export default filterUserInfo;
