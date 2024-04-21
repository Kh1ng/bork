import { render } from "@testing-library/react";
import { ClerkProvider } from "@clerk/nextjs";
import Home from "../src/pages/index";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";

jest.mock("@clerk/nextjs");

const pageProps = {};
const wrapper = render(
  <ClerkProvider {...pageProps}>
    <Home {...pageProps} />
  </ClerkProvider>
);

//test
