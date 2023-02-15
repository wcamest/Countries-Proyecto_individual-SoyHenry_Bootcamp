const { Country } = require("../db");
const axios = require("axios");

const create_table_if_not_exist = async () => {
  let number_of_countries = await Country.count();

  if (number_of_countries === 0) {
    const rest_countries_response = await axios.get(
      "https://restcountries.com/v3/all"
    );
    const countries_data = rest_countries_response.data.map((item) => {
      return {
        id: item.cca3,
        name: item.name.common,
        flag_icon: item.flags[0],
        continent: item.continents[0],
        capital: item.capital ? item.capital[0] : "-",
        sub_region: item.subregion ? item.subregion : "-",
        area: item.area,
        population: item.population,
      };
    });

    await Country.bulkCreate(countries_data);
  }
};

module.exports = { create_table_if_not_exist };
