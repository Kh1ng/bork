import { fireEvent, render, screen } from "@testing-library/react";
import Home from "../../src/pages/index";
import "@testing-library/jest-dom";
import { useUser } from "@supabase/auth-helpers-react";

const mockMutate = jest.fn();

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
        useMutation: jest.fn(() => ({ mutate: mockMutate, isLoading: false })),
      },
    },
    useUtils: jest.fn(() => ({
      posts: {
        getAll: { invalidate: jest.fn() },
      },
    })),
  },
}));

jest.mock("~/components/Feed", () => () => <div data-testid="feed">feed</div>);
jest.mock("~/components/PageLayout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock("~/components/Loading", () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">loading</div>,
}));

const mockUseUser = useUser as jest.Mock;
describe("Home", () => {
  beforeEach(() => mockMutate.mockReset());

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

    expect(screen.getByPlaceholderText("What’s happening, pup?")).toBeInTheDocument();
    expect(screen.getByTestId("feed")).toBeInTheDocument();
  });

  test("publishes trimmed content from the composer", async () => {
    mockUseUser.mockReturnValue({
      email: "test@example.com",
      user_metadata: {},
    });
    render(<Home />);

    const composer = screen.getByLabelText("Write a bork");
    fireEvent.change(composer, { target: { value: "  hello pups  " } });
    fireEvent.keyDown(composer, { key: "Enter" });

    expect(mockMutate).toHaveBeenCalledWith({ content: "hello pups" });
  });
});
