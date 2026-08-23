import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SinglePost, { getServerSideProps } from "../../src/pages/post/[id]";

const useQueryMock = jest.fn();

jest.mock("~/utils/api", () => ({
  api: {
    posts: {
      getById: {
        useQuery: (...args: unknown[]) => useQueryMock(...args),
      },
    },
  },
}));

jest.mock("~/components/PageLayout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("~/components/Loading", () => ({
  LoadingDog: () => <div role="status">Loading post...</div>,
}));

jest.mock("~/components/PostView", () => ({
  PostView: ({ post, author }: { post: { content: string }; author: { username: string | null } }) => (
    <article><span>@{author.username ?? "anonymous"}</span><p>{post.content}</p></article>
  ),
}));

describe("SinglePost page", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  test("getServerSideProps returns notFound without id", async () => {
    const result = await getServerSideProps({ params: {} } as never);
    expect(result).toEqual({ notFound: true });
  });

  test("getServerSideProps returns id prop", async () => {
    const result = await getServerSideProps({ params: { id: "abc123" } } as never);
    expect(result).toEqual({ props: { id: "abc123" } });
  });

  test("renders loading state", () => {
    useQueryMock.mockReturnValue({ data: null, isLoading: true });
    render(<SinglePost id="post-1" />);
    expect(screen.getByText("Loading post...")).toBeInTheDocument();
  });

  test("renders not found state", () => {
    useQueryMock.mockReturnValue({ data: null, isLoading: false });
    render(<SinglePost id="post-1" />);
    expect(screen.getByText("Post not found.")).toBeInTheDocument();
  });

  test("renders an unavailable state for query failures", () => {
    useQueryMock.mockReturnValue({
      data: null,
      error: new Error("backend unavailable"),
      isLoading: false,
    });
    render(<SinglePost id="post-1" />);
    expect(screen.getByText("This bork is unavailable right now.")).toBeInTheDocument();
    expect(screen.queryByText("Post not found.")).not.toBeInTheDocument();
  });

  test("renders post content", () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      data: {
        author: {
          username: "colton",
        },
        post: {
          content: "hello bork",
          createdAt: "2026-03-24T00:00:00.000Z",
        },
      },
    });

    render(<SinglePost id="post-1" />);
    expect(screen.getByText("hello bork")).toBeInTheDocument();
    expect(screen.getByText(/@colton/)).toBeInTheDocument();
  });
});
