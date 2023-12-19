import React from "react";
import axios from "axios";
import * as yup from "yup";

/* coordinates of each square of the grid
  (1, 1) (2, 1) (3, 1)
  (1, 2) (2, 2) (3, 2)
  (1, 3) (2, 3) (3, 3)
*/

// post request doesn't give us back anything other than message

const formSchema = yup.object().shape({
  email: yup
    .string()
    .email("Ouch: email must be a valid email")
    .required("Ouch: email is required"),
});

export default class AppClass extends React.Component {
  state = { message: "", email: "", index: 4, steps: 0 };

  // METHODS
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
          .post(URL, { x: 1, y: 2, steps: 5, email: this.state.email })
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
      .catch((err) => this.setState({ message: err.errors[0] }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.validate("email", this.state.email);
  };

  move = () => {
    console.log("any direction got clicked.");
  };

  reset = () => {
    console.log("reset button got clicked.");
  };

  render() {
    console.log("*** Class Component*** has fired.");
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved 0 times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square ${idx === 4 ? " active" : ""}`}>
              {idx === 4 ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left">LEFT</button>
          <button id="up">UP</button>
          <button id="right">RIGHT</button>
          <button id="down">DOWN</button>
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

/* 
  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  };

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
  };
*/
