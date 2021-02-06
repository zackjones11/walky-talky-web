import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("test", () => {
  it("should show 'Hello World!'", () => {
    render(<App />);
    expect(screen.getByRole("heading")).toHaveTextContent("Hello World!");
  });
});
