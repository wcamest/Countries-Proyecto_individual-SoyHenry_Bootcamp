const { Router } = require("express");
const { Activity } = require("../db");
const { create_table_if_not_exist } = require("./_db_init");
const router = Router();

router.post('/create', async (req, res) => {

    const { name, difficulty, duration, season, countries } = req.body;
    await create_table_if_not_exist();

    if (!name || !difficulty || !duration || !season || !countries) {
        res.status(404).send({ error: "Some data is missing" });
    } else {
        const activity_data = await Activity.create(
            {
                name,
                difficulty,
                season,
                duration: duration.hours + ":" + duration.minutes
            });
            
        activity_data.setCountries(countries);

        res.send("OK");
    }

});

module.exports = router;