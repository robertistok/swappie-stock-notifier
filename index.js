if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const axios = require("axios");

const SWAPPIE_URL = "https://swappie.com/se/modell/iphone-xs";
const FILTER_PARAMS = ["filter_condition", "filter_memory"];

const HEALTHCHECKS_URL = process.env.HEALTHCHECKS_URL;

const run = async () => {
  const params = process.argv.reduce((acc, arg) => {
    if (FILTER_PARAMS.some(p => arg.includes(p))) {
      const [key, value] = arg.split("=");
      return { ...acc, [key.replace("--", "")]: value };
    }

    return acc;
  }, {});

  const { data: html } = await axios({
    url: SWAPPIE_URL,
    params
  });

  const isAvailable =
    !html.includes("Tyvärr är mobilen du söker") && html.includes("Rymdgrå");

  if (isAvailable) {
    console.log("Your desired phone is available! Go and get it now.", params);
    await axios({ url: HEALTHCHECKS_URL });
  } else {
    console.log("Not yet, keep trying!", params);
    await axios({ url: `${HEALTHCHECKS_URL}/fail` });
  }

  process.exit();
};

run();
