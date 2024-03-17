import { currentUser } from "@clerk/nextjs/";
import { User } from "@clerk/nextjs/dist/types/server";

const filterUserInfo = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export default filterUserInfo;
