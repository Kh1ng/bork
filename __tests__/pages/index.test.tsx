import { render } from "@testing-library/react";
import { ClerkProvider } from "@clerk/nextjs";
import Home from "../../src/pages/index";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";

jest.mock("@clerk/nextjs");

const pageProps = {};
const wrapper = render(
  <ClerkProvider {...pageProps}>
    <Home {...pageProps} />
  </ClerkProvider>
);

describe("Home", () => {
  test("renders loading dog while loading", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    const loadingDog = wrapper.findAllByTitle("LoadingDog");
    expect(loadingDog).toBeDefined();
  });

  test("renders the SignInButton component if the user is not signed in", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });
    const signIn = wrapper.findAllByTitle("SignInButton");
    expect(signIn).toBeDefined();
  });

  test("renders the CreatePost component if the user is signed in", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    const createPost = wrapper.findAllByTitle("CreatePost");
    expect(createPost).toBeDefined();
  });

  test("renders the Feed component", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    const feed = wrapper.findAllByTitle("Feed");
    expect(feed).toBeDefined();
  });
});
