import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type React from "react";
import PostView from "../../src/components/PostView";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt} />,
}));

describe("PostView", () => {
  test("renders profile link when username exists", () => {
    render(
      <PostView
        post={{
          id: "post-1",
          content: "hello pups",
          createdAt: "2026-03-24T00:00:00.000Z",
          authorID: "user-1",
        }}
        author={{
          id: "user-1",
          username: "colton",
          firstName: "Colton",
          lastName: "Spurgin",
          profileImageUrl: "https://example.com/a.png",
        }}
      />,
    );

    const profileLink = screen.getByRole("link", { name: "@colton" });

    expect(profileLink).toHaveAttribute("href", "/@colton");
    expect(screen.getByText("hello pups")).toBeInTheDocument();
  });

  test("renders a missing username as anonymous without a profile link", () => {
    render(
      <PostView
        post={{
          id: "post-2",
          content: "anonymous bork",
          createdAt: "2026-03-24T00:00:00.000Z",
          authorID: "user-2",
        }}
        author={{
          id: "user-2",
          username: null,
          firstName: null,
          lastName: null,
          profileImageUrl: null,
        }}
      />,
    );

    const anonymousText = screen.getByText("@anonymous");

    expect(anonymousText).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "@anonymous" })).not.toBeInTheDocument();
  });
});
