import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppClass from "./AppClass";
import AppFunctional from "./AppFunctional";
// import userEvent from "@testing-library/user-event";

// CLASS
test("AppClass renders without errors", () => {
  render(<AppClass />);
});

test("renders coordinates text", () => {
  render(<AppClass />);
  const text = screen.queryByText(/coordinates/i);
  expect(text).toBeInTheDocument();
  expect(text).toBeTruthy();
});

// userEvent not working, believe testing code is out of date.
// test("renders error message if email is not valid", async () => {
//   render(<AppClass />);
//   const user = userEvent.setup();
//   const email = document.getElementById("email");
//   expect(email).toBeInTheDocument();
//   user.type(email, "asd@s");
//   const errorMessage = await screen.findByText(
//     /Ouch: email must be a valid email/i
//   );
//   expect(errorMessage).toBeInTheDocument();
// });

// FUNCTIONAL
test("AppFunctional renders without errors", () => {
  render(<AppFunctional />);
});
