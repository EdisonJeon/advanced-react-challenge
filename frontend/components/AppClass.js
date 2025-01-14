import React from "react";
import axios from "axios";
import * as yup from "yup";

const formSchema = yup.object().shape({
  email: yup
    .string()
    .email("Ouch: email must be a valid email")
    .required("Ouch: email is required")
    .notOneOf(["foo@bar.baz"], "foo@bar.baz failure #71"),
});

export default class AppClass extends React.Component {
  state = { message: "", email: "", index: 4, steps: 0 };

  getXY = () => {
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

    let x = coordinates[this.state.index][0];
    let y = coordinates[this.state.index][1];
    return [x, y];
  };

  goUp = (e) => {
    const { name } = e.target;
    if (name === "up" && this.getXY()[1] > 1)
      return this.setState({
        ...this.state,
        index: this.state.index - 3,
        steps: this.state.steps + 1,
        message: "",
      });
    else return this.setState({ ...this.state, message: "You can't go up" });
  };

  goDown = (e) => {
    const { name } = e.target;
    if (name === "down" && this.getXY()[1] < 3)
      return this.setState({
        ...this.state,
        index: this.state.index + 3,
        steps: this.state.steps + 1,
        message: "",
      });
    else return this.setState({ ...this.state, message: "You can't go down" });
  };

  // HUGE BUG, NEED TO NOT GO RIGHT TO THE NEXT ROW
  goRight = (e) => {
    const { name } = e.target;
    if (name === "right" && this.getXY()[0] < 3)
      return this.setState({
        ...this.state,
        index: this.state.index + 1,
        steps: this.state.steps + 1,
        message: "",
      });
    else return this.setState({ ...this.state, message: "You can't go right" });
  };

  goLeft = (e) => {
    const { name } = e.target;
    if (name === "left" && this.getXY()[0] > 1)
      return this.setState({
        ...this.state,
        index: this.state.index - 1,
        steps: this.state.steps + 1,
        message: "",
      });
    else return this.setState({ ...this.state, message: "You can't go left" });
  };

  reset = () => {
    this.setState({ message: "", email: "", index: 4, steps: 0 });
  };

  onChange = (e) => {
    const { value } = e.target;
    this.setState({
      ...this.state,
      email: value,
    });
  };

  validate = (name, value) => {
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        const URL = "http://localhost:9000/api/result";
        axios
          .post(URL, {
            x: this.getXY()[0],
            y: this.getXY()[1],
            steps: this.state.steps,
            email: this.state.email,
          })
          .then((res) => {
            console.log(res);
            this.setState({
              ...this.state,
              message: res.data.message,
              email: "",
            });
          })
          .catch((err) => {
            console.error("request timed out with error =>", err);
            this.setState({
              ...this.state,
              message:
                "Oops, looks like something is wrong on our side, please try again later.",
            });
          });
      })
      .catch((err) => this.setState({ ...this.state, message: err.errors[0] }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.validate("email", this.state.email);
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">
            Coordinates ({this.getXY()[0]}, {this.getXY()[1]})
          </h3>
          <h3 id="steps">
            You moved {this.state.steps}{" "}
            {this.state.steps === 1 ? "time" : "times"}
          </h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square ${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" name="left" onClick={this.goLeft}>
            LEFT
          </button>
          <button id="up" name="up" onClick={this.goUp}>
            UP
          </button>
          <button id="right" name="right" onClick={this.goRight}>
            RIGHT
          </button>
          <button id="down" name="down" onClick={this.goDown}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
