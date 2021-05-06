import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// const { Builder, By, Key, until } = require("selenium-webdriver");
export default class App extends Component {
  // flights api key e20d3aecc0 secert key 475d1b7d122f554
  constructor(props) {
    super(props);

    this.state = {
      to: "",
      from: "",
      departureDate: "",
      arrivalDate: "",
    };
  }

  componentDidMount() {}

  submit = () => {
    this.setupDates();
  };

  setupDates = () => {};

  getFlightData = async () => {
    // let driver = await new Builder.forBrowser("chrome").build();
    // axios.get("/api/getdropdowns").then((res) => {
    //   console.log(res);
    // });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <h1>Welcome to my app!</h1>
        <form onSubmit={this.submit()}>
          <label>Start</label>
          <select
            onChange={(e) => {
              this.setState({ to: e.target.value });
            }}
          >
            <option value="">Please select an option</option>
            <option value="ATL">Atlanta</option>
            <option value="CUN">Cancun</option>
            <option value="LAS">Las Vegas</option>
            <option value="DEN">Denver</option>
            <option value="ROM">Rome</option>
            <option value="MXP">Milan</option>
            <option value="CDG">Paris</option>
            <option value="AMS">Amsterdam</option>
            <option value="SIN">Singapore</option>
          </select>
          <label>Destination</label>
          <select
            onChange={(e) => {
              this.setState({ from: e.target.value });
            }}
          >
            <option value="">Please select an option</option>
            <option value="ATL">Atlanta</option>
            <option value="CUN">Cancun</option>
            <option value="LAS">Las Vegas</option>
            <option value="DEN">Denver</option>
            <option value="ROM">Rome</option>
            <option value="MXP">Milan</option>
            <option value="CDG">Paris</option>
            <option value="AMS">Amsterdam</option>
            <option value="SIN">Singapore</option>
          </select>
          <label>Departure Date</label>
          <DatePicker
            selected={this.state.departureDate}
            onChange={(date) => {
              this.setState({ departureDate: date });
            }}
          />
          <label>Arrival Date</label>
          <DatePicker
            selected={this.state.arrivalDate}
            onChange={(date) => {
              this.setState({ arrivalDate: date });
            }}
          />
          <button type="submit">Submit</button>
        </form>
        <button
          onClick={(e) => {
            this.getFlightData(e);
          }}
        >
          Get Flight Data
        </button>
      </div>
    );
  }
}
