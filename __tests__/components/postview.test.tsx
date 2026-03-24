import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type React from "react";
import PostView from "../../src/components/postview";

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
        }}
        author={{
          id: "user-1",
          username: "colton",
          profileImageUrl: "https://example.com/a.png",
        }}
      />,
    );

    const profileLink = screen.getByRole("link", { name: "@colton" });

    expect(profileLink).toHaveAttribute("href", "/@colton");
    expect(screen.getByText("hello pups")).toBeInTheDocument();
  });

  test("does not render profile link when username is anonymous", () => {
    render(
      <PostView
        post={{
          id: "post-2",
          content: "anonymous bork",
          createdAt: "2026-03-24T00:00:00.000Z",
        }}
        author={{
          id: "user-2",
          username: "anonymous",
          profileImageUrl: null,
        }}
      />,
    );

    const anonymousText = screen.getByText("@anonymous");

    expect(anonymousText).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "@anonymous" })).not.toBeInTheDocument();
  });
});
