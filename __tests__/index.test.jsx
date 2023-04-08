import mockRouter from "next-router-mock";
import useUser from "@clerk/nextjs";

import { render, screen } from "@testing-library/react";
import { ClerkProvider } from "@clerk/nextjs";
import Home from "../src/pages/index";
import "@testing-library/jest-dom";
import { api } from "../src/utils/api";
import testSignInWithEmailCode from "./clerk.test";
import { LoadingDog } from "../src/components/loading";

// jest.mock("next/router", () => require("next-router-mock"));
jest.mock("@clerk/nextjs");

describe("Home", () => {
  test("renders loading dog", () => {
    // jest.mock("clerk");
    // useClerk.useUser.returnValue({
    //   isSignedIn: false,
    //   isLoaded: true,
    // });

    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    // const pageProps = {};
    // const wrapper = render(
    //   <ClerkProvider {...pageProps}>
    //     <Home {...pageProps} />
    //   </ClerkProvider>
    // );
    // const loadingDog = wrapper.find(LoadingDog);
    // expect(loadingDog).toBeDefined();

    const pageProps = {};
    render(
      <ClerkProvider {...pageProps}>
        <Home {...pageProps} />
      </ClerkProvider>
    );
    screen.find(LoadingDog).expect(LoadingDog).toBeDefined();
  });

  test("has a title", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });
    const title = screen.getByRole("title", {
      name: /Bork/,
    });
  });
  test("page has correct title", () => {
    expect(document.title).toBe("Bork");
  });
});

describe("Home", () => {
  it("renders the SignInButton component if the user is not signed in", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    render(<Home />);
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
  });
});
