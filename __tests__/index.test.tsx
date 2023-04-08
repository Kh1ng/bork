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
  test("has a title", () => {
    const useUser = jest.fn();
    useUser.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });
    console.log(screen.getByRole("title"));
    expect(screen.getByRole("title")).toHaveTextContent("Bork");
  });
});

test("renders loading dog", () => {
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
  const loadingDog = wrapper.findAllByTitle("LoadingDog");
  expect(loadingDog).toBeDefined();
});

// describe("Home", () => {
//   it("renders the SignInButton component if the user is not signed in", () => {
//     const useUser = jest.fn();
//     useUser.mockReturnValue({
//       isSignedIn: false,
//       isLoaded: true,
//     });

//     render(<Home />);
//     expect(
//       screen.getByRole("button", { name: /Sign In/i })
//     ).toBeInTheDocument();
//   });
// });
