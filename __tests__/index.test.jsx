import { render, screen } from "@testing-library/react";
import { ClerkProvider } from "@clerk/nextjs";
import Home from "../src/pages/index";
import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import { api } from "../src/utils/api";
import testSignInWithEmailCode from "./clerk.test";

testSignInWithEmailCode = async () => {

      const { signIn } = useSignIn();

      

      const emailAddress = "john+clerk_test@example.com";

      const signInResp = await signIn.create({ identifier: emailAddress });

      const { emailAddressId } = signInResp.supportedFirstFactors.find(

        (ff) =>

          ff.strategy === "email_code" && ff.safeIdentifier === emailAddress

      )! as EmailCodeFactor;


      await signIn.prepareFirstFactor({

        strategy: "email_code",

        emailAddressId: emailAddressId,

      });


      const attemptResponse = await signIn.attemptFirstFactor({

        strategy: "email_code",

        code: "424242",

      });


      if (attemptResponse.status == "complete") {

        console.log("success");

      } else {

        console.log("error");

      }

    };

jest.mock("next/router", () => require("next-router-mock"));

// const ExampleComponent = ({ href = "" }) => {
//   const router = useRouter();
//   return (
//     <button onClick={() => router.push(href)}>
//       The current route is: "{router.asPath}"
//     </button>
//   );
// };

// describe("next-router-mock", () => {
//   it("mocks the useRouter hook", () => {
//     // Set the initial url:
//     mockRouter.push("/initial-path");

//     // Render the component:
//     render(<ExampleComponent href="/foo?bar=baz" />);
//     expect(screen.getByRole("button")).toHaveText(
//       'The current route is: "/initial-path"'
//     );

//     // Click the button:
//     fireEvent.click(screen.getByRole("button"));

//     // Ensure the router was updated:
//     expect(mockRouter).toMatchObject({
//       asPath: "/foo?bar=baz",
//       pathname: "/foo",
//       query: { bar: "baz" },
//     });
//   });
// });

describe("Home", (pageProps) => {
  test("has a title", () => {
    render(
      <ClerkProvider {...pageProps}>
        <Home {...pageProps} />
      </ClerkProvider>
    );
    expect(document.title).toBe("Bork");
  });
});

test("page has correct title", () => {
  expect(document.title).toBe("Bork");
});

describe("Home", (pageProps) => {
  test("has a title", () => {
    render(
      <ClerkProvider {...pageProps}>
        <Home {...pageProps} />
      </ClerkProvider>
    );
    const heading = screen.getByRole("heading", {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

jest.mock("@clerk/nextjs");
jest.mock("../src/utils/api", () => ({
  api: {
    posts: {
      getAll: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe("Home", (pageProps) => {
  beforeEach(() => {
    // Clear the mock implementation before each test
    useUser.mockImplementation(() => ({ isLoaded: true, isSignedIn: true }));
    api.posts.getAll.useQuery.mockImplementation(() => ({
      isLoading: false,
      data: [],
    }));
  });

  it("renders the SignInButton component if the user is not signed in", () => {
    useUser.mockImplementation((pageProps) => ({
      isLoaded: true,
      isSignedIn: false,
    }));
    render(
      <ClerkProvider {...pageProps}>
        <Home {...pageProps} />
      </ClerkProvider>
    );
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
  });

  it("renders the CreatePost component if the user is signed in", () => {
    render(
      <ClerkProvider {...pageProps}>
        <Home {...pageProps} />
      </ClerkProvider>
    );
    expect(screen.getByPlaceholderText("!!!bork here!!!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bork/i })).toBeInTheDocument();
  });

  it("renders the Feed component", () => {
    api.posts.getAll.useQuery.mockImplementation(() => ({
      isLoading: false,
      data: [
        {
          post: {
            id: 1,
            content: "Hello world",
            createdAt: "2023-04-07T12:34:56.789Z",
          },
          author: {
            id: 1,
            username: "doggo",
            profileImageUrl: "https://example.com/profile.jpg",
          },
        },
        {
          post: {
            id: 2,
            content: "Bork bork",
            createdAt: "2023-04-07T13:00:00.000Z",
          },
          author: {
            id: 2,
            username: "pupper",
            profileImageUrl: "https://example.com/puppy.jpg",
          },
        },
      ],
    }));
    render(<Home />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("Bork bork")).toBeInTheDocument();
  });

  it("renders a loading spinner if posts are loading", () => {
    api.posts.getAll.useQuery.mockImplementation(() => ({ isLoading: true }));
    render(<Home />);
    expect(screen.getByTestId("loading-page")).toBeInTheDocument();
  });

  it("renders an error message if posts fail to load", () => {
    api.posts.getAll.useQuery.mockImplementation(() => ({
      isLoading: false,
      error: new Error("Failed to load posts"),
    }));
    render(<Home />);
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });
});
