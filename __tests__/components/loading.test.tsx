import React from "react";
import { LoadingPage } from "../../src/components/Loading";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Loading Component", () => {
  it("renders spinner status and accessible loading text", () => {
    render(<LoadingPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
