import Image from "next/image";

/** Renders a consistent avatar while keeping decorative fallback behavior out of callers. */
export const ProfileAvatar = ({
  src,
  username,
  size = 48,
  priority = false,
}: {
  src: string;
  username: string;
  size?: number;
  priority?: boolean;
}) => (
  <Image
    src={src}
    alt={`@${username}'s profile picture`}
    width={size}
    height={size}
    priority={priority || undefined}
    className="bork-avatar"
    style={{ width: size, height: size }}
  />
);
