import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfilePage from "../../src/pages/[slug]";

const profileQueryMock = jest.fn();
const postsQueryMock = jest.fn();

jest.mock("~/utils/api", () => ({
  api: {
    profile: {
      getUserByUsername: {
        useQuery: (...args: unknown[]) => profileQueryMock(...args),
      },
    },
    posts: {
      getPostsByUserId: {
        useQuery: (...args: unknown[]) => postsQueryMock(...args),
      },
    },
  },
}));

jest.mock("~/components/PageLayout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("~/components/ProfileAvatar", () => ({
  ProfileAvatar: () => <div data-testid="avatar" />,
}));

jest.mock("~/components/PostView", () => ({
  PostView: () => <article />,
}));

describe("Profile page", () => {
  beforeEach(() => {
    profileQueryMock.mockReset();
    postsQueryMock.mockReset();
    profileQueryMock.mockReturnValue({
      data: {
        id: "user-1",
        username: "colton",
        firstName: "Colton",
        lastName: null,
        profileImageUrl: null,
      },
      error: null,
      isLoading: false,
    });
  });

  test("does not misreport a failed profile feed as empty", () => {
    postsQueryMock.mockReturnValue({
      data: null,
      error: new Error("backend unavailable"),
      isLoading: false,
    });

    render(<ProfilePage username="colton" />);

    expect(screen.getByText("This profile’s borks are unavailable right now.")).toBeInTheDocument();
    expect(screen.queryByText("No borks yet.")).not.toBeInTheDocument();
  });
});
