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
    return axios.get(
      `https://api.flightapi.io/roundtrip/608ef72445695c0519dcfb6d/ATL/${locationCode}/2021-${monthStart}-${dayStart}/2021-${monthEnd}-${dayEnd}/1/0/0/Economy/USD`
    );
  });
};
// Atlanta
// Cancun
// Las Vegas
// Denver
// Rome
// Milan
// Paris
// Madrid
// Amsterdam
// Singapore
// return axios.get()

const setup = setupInput(16, 5, 6, 7, 8);
const dates = fetchData(setup);
const allDates = dates.slice(0, dates.length - 6);
// console.log(getDaysInMonth(2021, 5));
console.log(allDates.slice(0, 1));
