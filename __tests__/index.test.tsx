import { render, screen } from "@testing-library/react";
import { ClerkProvider } from "@clerk/nextjs";
import Home from "../src/pages/index";
import "@testing-library/jest-dom";

jest.mock("@clerk/nextjs");

describe("Home", () => {
  test("renders loading dog", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    const pageProps = {};
    const wrapper = render(
      <ClerkProvider {...pageProps}>
        <Home {...pageProps} />
      </ClerkProvider>
    );
    const loadingDog = wrapper.findAllByTitle("LoadingDog");
    expect(loadingDog).toBeDefined();
  });

  test("renders the SignInButton component if the user is not signed in", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });
    const pageProps = {};
    const wrapper = render(
      <ClerkProvider {...pageProps}>
        <Home {...pageProps} />
      </ClerkProvider>
    );

    const signIn = wrapper.findAllByTitle("SignInButton");
    expect(signIn).toBeDefined();
  });
});
