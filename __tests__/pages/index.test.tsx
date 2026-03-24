import { render, screen } from "@testing-library/react";
import Home from "../../src/pages/index";
import "@testing-library/jest-dom";
import { useUser } from "@supabase/auth-helpers-react";

jest.mock("@supabase/auth-helpers-react", () => ({
  useUser: jest.fn(),
}));

jest.mock("~/utils/api", () => ({
  api: {
    profile: {
      getCurrentProfile: {
        useQuery: jest.fn(() => ({ data: null })),
      },
    },
    posts: {
      getAll: {
        useQuery: jest.fn(),
      },
      create: {
        useMutation: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
      },
    },
    useUtils: jest.fn(() => ({
      posts: {
        getAll: { invalidate: jest.fn() },
      },
    })),
  },
}));

jest.mock("~/components/feed", () => () => <div data-testid="feed">feed</div>);
jest.mock("~/components/layout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock("~/components/loading", () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">loading</div>,
}));

const mockUseUser = useUser as jest.Mock;
describe("Home", () => {
  test("renders sign in link and feed when user is signed out", () => {
    mockUseUser.mockReturnValue(null);

    render(<Home />);

    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByTestId("feed")).toBeInTheDocument();
  });

  test("renders create post and feed when user is signed in", () => {
    mockUseUser.mockReturnValue({
      email: "test@example.com",
      user_metadata: {
        avatar_url: "https://api.dicebear.com/7.x/lorelei/svg?seed=test",
      },
    });

    render(<Home />);

    expect(screen.getByPlaceholderText("What's happening, pup?")).toBeInTheDocument();
    expect(screen.getByTestId("feed")).toBeInTheDocument();
  });
});
