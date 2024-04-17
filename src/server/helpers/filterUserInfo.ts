import { currentUser } from "@clerk/nextjs/";
import { User } from "@clerk/nextjs/dist/types/server";

const filterUserInfo = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.imageUrl.toString(),
  };
};

export default filterUserInfo;
