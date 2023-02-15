const { Router } = require("express");
const { Country, Activity } = require("../db");
const { create_table_if_not_exist } = require("./_db_init");
const router = Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  await create_table_if_not_exist();

  const all_countries = await Country.findAll({ include: Activity });

  if (name) {
    const countries_filtered_by_name = all_countries.filter((item) => {
      return item.name.toLowerCase().includes(name.toLowerCase());
    });

    if (countries_filtered_by_name.length) {
      res.json(countries_filtered_by_name);
    } else {
      res.status(404).json({ msg: "Not found" });
    }
  } else {
    res.json(all_countries);
  }
});

router.get("/:country_code", async (req, res) => {
    const { country_code } = req.params;

    await create_table_if_not_exist();

    try {
        let id = await Country.findByPk(country_code.toUpperCase())
        res.json(id);

    } catch (error) {
        res.status(404).send(error.message);
    }
});

module.exports = router;