import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppClass from "./AppClass";
import AppFunctional from "./AppFunctional";

test("AppClass renders without errors", () => {
  render(<AppClass />);
});

test("AppFunctional renders without errors", () => {
  render(<AppFunctional />);
});
