import React, { useState } from "react";
import axios from "axios";
import * as yup from "yup";

const formSchema = yup.object().shape({
  email: yup
    .string()
    .email("Ouch: email must be a valid email")
    .required("Ouch: email is required")
    .notOneOf(["foo@bar.baz"], "foo@bar.baz failure #71"),
});

export default function AppFunctional(props) {
  const [grid, setGrid] = useState({
    message: "",
    email: "",
    index: 4,
    steps: 0,
  });

  const getXY = () => {
    const coordinates = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    let x = coordinates[grid.index][0];
    let y = coordinates[grid.index][1];
    return [x, y];
  };

  const goUp = (e) => {
    const { name } = e.target;
    if (name === "up" && getXY()[1] > 1)
      return setGrid({
        ...grid,
        index: grid.index - 3,
        steps: grid.steps + 1,
        message: "",
      });
    else return setGrid({ ...grid, message: "You can't go up" });
  };

  const goDown = (e) => {
    const { name } = e.target;
    if (name === "down" && getXY()[1] < 3)
      return setGrid({
        ...grid,
        index: grid.index + 3,
        steps: grid.steps + 1,
        message: "",
      });
    else return setGrid({ ...grid, message: "You can't go down" });
  };

  const goRight = (e) => {
    const { name } = e.target;
    if (name === "right" && getXY()[0] < 3)
      return setGrid({
        ...grid,
        index: grid.index + 1,
        steps: grid.steps + 1,
        message: "",
      });
    else return setGrid({ ...grid, message: "You can't go right" });
  };

  const goLeft = (e) => {
    const { name } = e.target;
    if (name === "left" && getXY()[0] > 1)
      return setGrid({
        ...grid,
        index: grid.index - 1,
        steps: grid.steps + 1,
        message: "",
      });
    else return setGrid({ ...grid, message: "You can't go left" });
  };

  const reset = () => {
    setGrid({
      message: "",
      email: "",
      index: 4,
      steps: 0,
    });
  };

  const onChange = (e) => {
    const { value } = e.target;
    setGrid({ ...grid, email: value });
  };

  const validate = (name, value) => {
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        const URL = "http://localhost:9000/api/result";
        axios
          .post(URL, {
            x: getXY()[0],
            y: getXY()[1],
            steps: grid.steps,
            email: grid.email,
          })
          .then((res) => {
            setGrid({ ...grid, message: res.data.message, email: "" });
          })
          .catch((err) => {
            console.error("request timed out with error =>", err);
            setGrid({
              ...grid,
              message:
                "Oops, looks like something is wrong on our side, please try again later.",
            });
          });
      })
      .catch((err) => setGrid({ message: err.errors[0] }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    validate("email", grid.email);
  };

  console.log("*** Functional Component *** has fired.");
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">
          Coordinates ({getXY()[0]}, {getXY()[1]})
        </h3>
        <h3 id="steps">
          You moved {grid.steps} {grid.steps === 1 ? "time" : "times"}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === grid.index ? " active" : ""}`}
          >
            {idx === grid.index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{grid.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" name="left" onClick={goLeft}>
          LEFT
        </button>
        <button id="up" name="up" onClick={goUp}>
          UP
        </button>
        <button id="right" name="right" onClick={goRight}>
          RIGHT
        </button>
        <button id="down" name="down" onClick={goDown}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={grid.email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
