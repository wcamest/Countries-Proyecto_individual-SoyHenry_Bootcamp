import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { create_activity } from "../../Redux/Actions";
import Navbar from "../NavBar/NavBar";
import styles from "./ActivityDesigner.module.css";
import common_styles from "../common_styles.module.css";

const EMPTY_COUNTRIES_ERROR = "You must choose at least one country for this activity";
const EMPTY_NAME_ERROR = "You must choose a name for the activity";
const INVALID_CHARACTERS_ERROR = "Activity name contains invalid characters";
const EXISTING_NAME_ERROR = "This name is already in use";

const ActivityDesigner = props => {

    /*#region init*/
    const global_state = useSelector(state => state);
    const [activity_data, set_activity_data] = useState({
        name: null,
        difficulty: 1,
        duration: {
            hours: 1,
            minutes: 0
        },
        season: "summer",
        countries: []
    });
    const [errors, set_errors] = useState({
        name: EMPTY_NAME_ERROR,
        countries: EMPTY_COUNTRIES_ERROR
    });
    const dispatch = useDispatch();
    const { country_id } = useParams();
    /*#endregion*/

    /*#region event handlers */
    const handle_name_change = event => {
        let name_error = null

        set_activity_data({
            ...activity_data,
            name: event.currentTarget.value
        })

        if (!event.currentTarget.value) {
            name_error = EMPTY_NAME_ERROR;
        } else if (!/^[\w\s\-_\(\)\[\]]+$/i.test(event.currentTarget.value)) {
            name_error = INVALID_CHARACTERS_ERROR
        }

        const filter_result = global_state.activities.filter(e => {
            return e.name.toLowerCase() === event.currentTarget.value.toLowerCase();
        })

        if (filter_result.length) {
            name_error = EXISTING_NAME_ERROR
        }

        set_errors({
            ...errors,
            name: name_error
        })
    }

    const handle_difficulty_change = event => {
        const control_value = event.currentTarget.value;

        set_activity_data({
            ...activity_data,
            difficulty: control_value
        })
    }

    const handle_duration_change = event => {
        const control_name = event.currentTarget.name;
        const control_value = parseInt(event.currentTarget.value);
        let hours = control_name === "hours" ? control_value : activity_data.duration.hours;
        let minutes = control_name === "minutes" ? control_value : activity_data.duration.minutes;

        if (control_name === "minutes" && control_value === 0 && hours === 0)
            hours = 1;

        if (control_name === "hours" && control_value === 0 && minutes === 0)
            minutes = 5;

        set_activity_data({
            ...activity_data,
            duration: {
                hours,
                minutes
            }
        })
    }

    const handle_season_option_change = (event) => {
        set_activity_data({
            ...activity_data,
            season: event.currentTarget.value
        })
    }

    const handle_countries_select_change = (event) => {
        const split = event.target.value.split("-");
        const country_name = split[1];
        const country_code = split[0];

        add_selected_country(country_code, country_name);
    }

    const handle_remove_selected_country_button_click = (event) => {
        event.preventDefault();
        const country_code = event.currentTarget.id.replace("remove_", "");
        const new_activity_data = {
            ...activity_data,
            countries: activity_data.countries.filter(selected_country_data => {
                return selected_country_data.code !== country_code;
            })
        }

        set_activity_data(new_activity_data);

        if (!new_activity_data.countries.length) {
            set_errors({
                ...errors,
                countries: EMPTY_COUNTRIES_ERROR
            })
        }
    }

    const handle_activity_submit = (event) => {
        event.preventDefault();
        dispatch(create_activity({
            ...activity_data,
            countries: activity_data.countries.map(selected_country_data => {
                return selected_country_data.code;
            })
        }));
    }
    /*#endregion*/

    const update_countries_area = () => {

        let options = [];
        let last_country_first_char = null;

        if (!activity_data.countries.length && country_id) {
            const country_data = global_state.countries.filter(e => {
                return e.id === country_id;
            })[0];

            if (country_data) {
                add_selected_country(country_id, country_data.name);
            }
        }

        const countries_list = global_state.countries.map(country_data => {
            return {
                name: country_data.name,
                code: country_data.id
            }
        });

        countries_list.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        })

        options.push(<option value="" key={"list_description"} hidden>Choose an option</option>);
        countries_list.forEach(country_data => {
            if (activity_data.countries.findIndex(selected_country_data => {
                return selected_country_data.code === country_data.code;
            }) === -1) {

                if (last_country_first_char !== country_data.name[0]) {
                    last_country_first_char = country_data.name[0];
                    options.push(<option value="" className={styles.activity_country_option_letter} key={last_country_first_char + "_letter"} disabled={true}>----------{last_country_first_char}----------</option>);
                }

                options.push(<option key={country_data.code} value={country_data.code + "-" + country_data.name} aria-label={"countries-list-item-" + country_data.code}>{country_data.name}</option>);
            }
        });

        return options;
    }

    const contains_input_errors = () => {
        return errors.name || errors.countries;
    }

    const add_selected_country = (id, name) => {
        set_activity_data({
            ...activity_data,
            countries: [
                ...activity_data.countries,
                {
                    name: name,
                    code: id
                }
            ]
        });

        set_errors({
            ...errors,
            countries: null
        })
    }

    return (
        <div className={styles.activity_designer}>
            <div className={styles.nav_bar_container}>
                <Navbar current="activity_designer" data={{ back_to_country_details: country_id }} />
            </div>
            <div>
                <form onSubmit={handle_activity_submit} className={styles.activity_designer_form}>
                    <fieldset>
                        <legend className={styles.form_title}>New Activity</legend>

                        {/*Name input*/}
                        <fieldset>
                            <legend>Name</legend>
                            {errors.name ? <span className={styles.error_label}>Error: {errors.name}</span> : null}
                            <input onChange={handle_name_change} type="text" name="activity_name" id="activity_name" aria-label="activity_name" placeholder="Activity name..." />
                        </fieldset>

                        {/*Difficulty input*/}
                        <fieldset>
                            <legend>Difficulty</legend>
                            <div className={styles.activity_difficulty}>
                                <input onChange={handle_difficulty_change} type="range" min="1" max="5" defaultValue="1" />
                                <span>{activity_data.difficulty}</span>
                            </div>
                        </fieldset>

                        {/*Duration inputs*/}
                        <fieldset>
                            <legend>Duration</legend>
                            <div className={styles.activity_duration}>
                                <span>Hours:</span>
                                <input onChange={handle_duration_change} name="hours" type="range" min="0" max="23" value={activity_data.duration.hours} />
                                <span className={styles.duration_time_info}>{(activity_data.duration.hours < 10 ? "0" : "") + activity_data.duration.hours}</span>
                                <span>Minutes:</span>
                                <input onChange={handle_duration_change} name="minutes" type="range" min="0" max="55" value={activity_data.duration.minutes} step="5" />
                                <span className={styles.duration_time_info}>{(activity_data.duration.minutes < 10 ? "0" : "") + activity_data.duration.minutes}</span>
                            </div>
                        </fieldset>

                        {/*Season Selection*/}
                        <fieldset>
                            <legend>Season</legend>
                            <div className={styles.activity_season}>
                                <div>
                                    <input onChange={handle_season_option_change} type="radio" name="season" id="summer" value="summer" defaultChecked={true} />
                                    <label htmlFor="summer">Summer</label>
                                </div>
                                <div>
                                    <input onChange={handle_season_option_change} type="radio" name="season" id="autumn" value="autumn" />
                                    <label htmlFor="autumn">Autumn</label>
                                </div>
                                <div>
                                    <input onChange={handle_season_option_change} type="radio" name="season" id="winter" value="winter" />
                                    <label htmlFor="winter">Winter</label>
                                </div>
                                <div>
                                    <input onChange={handle_season_option_change} type="radio" name="season" id="spring" value="spring" />
                                    <label htmlFor="spring">Spring</label>
                                </div>
                            </div>
                        </fieldset>

                        {/*Countries Selection*/}
                        <fieldset>
                            {/*Countries Selection List*/}
                            <legend>Countries</legend>
                            {errors.countries ? <span className={styles.error_label}>Error: {errors.countries}</span> : null}
                            <select onChange={handle_countries_select_change} aria-label="countries-list">
                                {
                                    update_countries_area()
                                }
                            </select>

                            {/*Selected Countries*/}
                            <fieldset className={styles.selected_countries}>
                                <legend>Selected Countries</legend>
                                <div>
                                    {
                                        activity_data.countries.map(selected_country_data => {
                                            return (
                                                <div className={styles.selected_country_item} key={selected_country_data.code}>
                                                    <span data-testid={"selected-country-item-" + selected_country_data.code}>{selected_country_data.name}</span>
                                                    <button data-testid={"remove-selected-country-item-" + selected_country_data.code} id={"remove_" + selected_country_data.code} onClick={handle_remove_selected_country_button_click}>x</button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </fieldset>
                        </fieldset>

                        <button style={{marginTop: "10px"}} className={common_styles.button} type="submit" disabled={contains_input_errors()} aria-label="create-activity-button">Create</button>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default ActivityDesigner;