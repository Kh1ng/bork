//filter out unneeded user info, if pfp is default the replace with random dog pic
import type { User } from "@clerk/nextjs/dist/api";

const filterUserInfo = (user: User) => {
  // void assignPic(user);
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export default filterUserInfo;
