const express = require("express");
const router = express.Router();
const Flights = require("../Models/Flights");
const axios = require("axios");

// simple get request that returns my name and class
router.get("/whoami", (req, res) => {
  const data = {
    username: "Sedina Husanovic",
    classname: "Software Testing and QA",
    data: "05/03/2021",
  };
  res.json(data);
});

router.get("/api", (req, res) => {
  Flights.find({})
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
});

router.post("/api/data", async (req, res) => {
  console.log(req.body);
  // const { list } = ;
  // list [{}, {}]
  // call mongo to save data
  // console.log(list);
  // const createBatch = list.map(doc => Flights.create(doc))
  // Promise.all(createBatch)
});

// router.post("/hello", async (req, res) => {
//   // const { list } = req.body;
//   console.log("Whats up");
//   'localhost:8080/api/data'
//   // list [{}, {}]
//   // call mongo to save data
//   // console.log(list);
//   // const createBatch = list.map(doc => Flights.create(doc))
//   // Promise.all(createBatch)
// });

router.get("/api/getdropdowns", async (req, res) => {
  // console.log("body", req.body);
  // https://api.flightapi.io/iata/608ef72445695c0519dcfb6d/new%20york/airport
  // https://api.flightapi.io/roundtrip/608ef72445695c0519dcfb6d/LHR/LAX/2021-05-05/2021-05-15/1/0/0/Economy/USD
  // https://api.flightapi.io/roundtrip/608ef72445695c0519dcfb6d/LHR/LAX/2021-10-11/2021-10-15/2/0/1/Economy/USD
  /**
   * 1-7 1+7-1
   * 2-8 2+7-1
   * 3-9 3+7-1
   */
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  // get May 1st to Augest 15th
  const setupInput = (endDay, ...months) => {
    const setOfDays = months
      .map((month) => {
        if (month === months[months.length - 1]) {
          return { days: getDaysInMonth(2021, month) - endDay, month };
        }
        return { days: getDaysInMonth(2021, month), month };
      }) // [{days:31, month: 5}, 30, 31, 31]
      .map((days) => {
        return new Array(days.days).fill(0).map((_, idx) => {
          return { day: idx + 1, month: days.month };
        });
      }) // [{}, {}, {}]
      .flat();

    return setOfDays;
  };

  const fetchData = (data) => {
    return data.map((num, index) => {
      const dayStart = num.day;
      const monthStart = num.month;
      const endObject = data[index + 6] || { day: "NA", month: "NA" };
      const dayEnd = endObject.day;
      const monthEnd = endObject.month;
      const locationCode = "CUN";
      if (endObject.day === "NA") return "";
      // https://api.flightapi.io/roundtrip/608ef72445695c0519dcfb6d/LHR/LAX/2021-5-05/2021-05-12/2/0/1/Economy/USD
      // https://api.flightapi.io/roundtrip/608ef72445695c0519dcfb6d/LHR/LAX/2021-08-09/2021-08-15/1/0/0/Economy/USDconsole.log(
      //   `https://api.flightapi.io/roundtrip/608ef72445695c0519dcfb6d/LHR/LAX/2021-0${monthStart}-${
      //     dayStart > 9 ? dayStart : "0" + dayStart
      //   }/2021-0${monthEnd}-${
      //     dayEnd > 9 ? dayEnd : "0" + dayEnd
      //   }/1/0/0/Economy/USD`
      // );
      return axios
        .get(
          `https://api.flightapi.io/roundtrip/608ef72445695c0519dcfb6d/LHR/LAX/2021-0${monthStart}-${
            dayStart > 9 ? dayStart : "0" + dayStart
          }/2021-0${monthEnd}-${
            dayEnd > 9 ? dayEnd : "0" + dayEnd
          }/1/0/0/Economy/USD`
        )
        .catch((err) => err.message);
    });
  };
  const setup = setupInput(16, 5, 6, 7, 8);
  const dates = fetchData(setup);
  const allDates = dates.slice(0, dates.length - 6);
  const result = await Promise.all(allDates);
  // "https://www.priceline.com/m/fly/search/ATL-CUN-20210601/CUN-ATL-20210630/?cabin-class=ECO&no-date-search=false&num-adults=1&sbsroute=slice1"
  res.json(result);
  // new%york
  // axios
  //   .get(
  //     `http://api.flightapi.io/iata/608ef72445695c0519dcfb6d/${searchBy}/airport`
  //   )
  //   .then((res) => {
  //     console.log(res.data);
  //   })
  //   .catch((err) => console.log(err));
});

module.exports = router;
