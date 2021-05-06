const axios = require("axios");
const Flights = require("./Models/Flights");

const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};
// get May 1st to Augest 15th
const setupInput = (endDay, ...months) => {
  // console.log(endDay, months);
  const setOfDays = months
    .map((month, idx) => {
      if (month === months[months.length - 1]) {
        return { days: getDaysInMonth(2021, month) - endDay, month };
      }
      return { days: getDaysInMonth(2021, month), month };
    }) // [{days:31, month: 5}, 30, 31, 31]
    .map((days) => {
      return new Array(days.days).fill(0).map((_, idx) => {
        return { day: idx + 1, month: days.month };
      });
    })
    // [{}, {}, {}]
    .flat();

  return setOfDays;
};

const fetchData = (data) => {
  return data.map((num, index) => {
    const dayStart = num.day;
    const monthStart = num.month;
    const endObject = data[index + 7] || { day: "NA", month: "NA" };
    const dayEnd = endObject.day;
    const monthEnd = endObject.month;
    const locationCode = "CUN";
    if (endObject.day === "NA") return "";
    const url = `https://www.priceline.com/m/fly/search/ATL-${locationCode}-20210${monthStart}${
      dayStart > 9 ? dayStart : "0" + dayStart
    }/${locationCode}-ATL-20210${monthEnd}${
      dayEnd > 9 ? dayEnd : "0" + dayEnd
    }/?cabin-class=ECO&no-date-search=false&num-adults=1&sbsroute=slice1`;
    return {
      url,
      dates: [
        `${2021}/0${monthStart}/${dayStart > 9 ? dayStart : "0" + dayStart}`,
        `${2021}/0${monthEnd}/${dayEnd > 9 ? dayEnd : "0" + dayEnd}`,
      ],
    };
  });
};
const setup = setupInput(16, 5, 6, 7, 8);
const dates = fetchData(setup);
const allDates = dates.slice(5, dates.length - 6);

async function example(url) {
  console.log(url);
  const caps = new Capabilities();
  caps.setPageLoadStrategy("eager");

  let driver = await new Builder().forBrowser("safari").build();
  try {
    await driver.get(url.url);
    let list = [];
    let x;
    while (list.length === 0) {
      x = await driver
        .findElements(By.className("fly-search-listings"))
        .then((res) => {
          list.push(...res);
          return res;
        });
    }

    const price = await x[0]
      .findElements(By.tagName("li"))
      .then((res) => {
        return Promise.all(res.map((i) => i.getText()));
      })
      .then((res) => {
        const fare = res[0];
        if (fare.toLowerCase().includes("express")) {
          return res[1]
            .split("$")[1]
            .substr(0, 10)
            .replace(/[^\d.-]/g, "");
        }
        return fare
          .split("$")[1]
          .substr(0, 10)
          .replace(/[^\d.-]/g, "");
      });
    return { price, dates: url.dates };
  } finally {
    await driver.quit();
  }
}

async function foo() {
  let bar = [];
  for (let i = 0; i < allDates.slice(0, 2).length; i++) {
    await example(allDates[i]).then((res) => {
      console.log("res", res);
      bar.push(res); // DATA
      const f = new Flights({
        origin: "ATL",
        departure: "CUN",
        price: res.price,
        departDate: res.dates[0],
        leaveDate: res.dates[1],
      });
      f.save(function (err) {
        if (err) {
          console.log(err);
        }
        console.log("success");
      });
    });
  }
}
foo();
