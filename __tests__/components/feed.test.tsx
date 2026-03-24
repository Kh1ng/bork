import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Feed from "../../src/components/feed";

const useQueryMock = jest.fn();

jest.mock("~/utils/api", () => ({
  api: {
    posts: {
      getAll: {
        useQuery: (...args: unknown[]) => useQueryMock(...args),
      },
    },
  },
}));

jest.mock("~/components/postview", () => ({
  PostView: ({ post }: { post: { id: string; content: string } }) => (
    <div data-testid="post-view">{post.content}</div>
  ),
}));

jest.mock("~/components/loading", () => ({
  LoadingDog: () => <div data-testid="loading-dog">loading</div>,
}));

describe("Feed", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  test("renders loading state while fetching posts", () => {
    useQueryMock.mockReturnValue({ data: undefined, isLoading: true });

    render(<Feed />);

    expect(screen.getByTestId("loading-dog")).toBeInTheDocument();
  });

  test("renders fallback error when no data returns", () => {
    useQueryMock.mockReturnValue({ data: null, isLoading: false });

    render(<Feed />);

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  test("renders all posts when data is returned", () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          post: {
            id: "post-1",
            content: "hello bork",
            createdAt: "2026-03-24T00:00:00.000Z",
          },
          author: {
            id: "user-1",
            username: "colton",
            profileImageUrl: "https://example.com/a.png",
          },
        },
        {
          post: {
            id: "post-2",
            content: "second bork",
            createdAt: "2026-03-24T00:00:00.000Z",
          },
          author: {
            id: "user-2",
            username: "kh1ng",
            profileImageUrl: "https://example.com/b.png",
          },
        },
      ],
    });

    render(<Feed />);

    expect(screen.getAllByTestId("post-view")).toHaveLength(2);
    expect(screen.getByText("hello bork")).toBeInTheDocument();
    expect(screen.getByText("second bork")).toBeInTheDocument();
  });
});
