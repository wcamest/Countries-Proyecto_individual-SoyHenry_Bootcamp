import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../NavBar/NavBar";
import styles from "./CountryDetails.module.css";
import { useEffect } from "react";
import { useState } from "react";
import ActivityListContainer from "../ActivityListContainer/ActivityListContainer";

const CountryDetails = props => {

    const { country_id } = useParams();
    const { countries } = useSelector(state => state);
    const [country_data, set_country_data] = useState(null);

    const render_country_details = () => {

        if (country_data) {
            return (
                <div className={styles.country_details_card}>
                    <div className={styles.country_details_header}>
                        <div className={styles.country_flag_outer}>
                            <div
                                className={styles.country_flag}
                                style={{ backgroundImage: `url(${country_data.flag_icon})` }}
                            ></div>
                        </div>
                        <span className={styles.country_name}>{country_data.name}</span>
                    </div>
                    <div className={styles.country_details_body}>
                        <span className={styles.country_details_label}>/Country Details</span>
                        <ul className={styles.detailed_info}>
                            <li><span className={styles.country_info_name}>Name:</span><span className={styles.country_info_value}>{country_data.name}</span></li>
                            <li><span className={styles.country_info_name}>Code:</span><span className={styles.country_info_value}>{country_data.id}</span></li>
                            <li><span className={styles.country_info_name}>Continent:</span><span className={styles.country_info_value}>{country_data.continent}</span></li>
                            <li><span className={styles.country_info_name}>Capital:</span><span className={styles.country_info_value}>{country_data.capital}</span></li>
                            <li><span className={styles.country_info_name}>Sub Region:</span><span className={styles.country_info_value}>{country_data.sub_region}</span></li>
                            <li><span className={styles.country_info_name}>Area:</span><span className={styles.country_info_value}>{country_data.area.toLocaleString('en', { useGrouping: true })} km2</span></li>
                            <li><span className={styles.country_info_name}>Population:</span><span className={styles.country_info_value}>{country_data.population.toLocaleString('en', { useGrouping: true })}</span></li>
                        </ul>
                    </div>
                </div>
            )
        }

        return null;
    }

    useEffect(() => {
        const filter_result = countries.filter(_country_data => {
            return _country_data.id === country_id;
        });

        if (!country_data) {
            if (filter_result.length) {
                set_country_data(filter_result[0]);
            }
        }

    }, [country_id, countries, country_data, set_country_data])

    return (
        <div className={styles.country_details}>
            <div className={styles.nav_bar_area}>
                <Navbar current="country_details" country_details_data={country_data ? country_data.id : ""} />
            </div>
            <div className={styles.country_details_area}>
                {render_country_details()}
            </div>
            <div className={styles.country_activities_area}>
                <fieldset>
                    <legend>Activities</legend>
                    <div className={styles.country_activities}>
                        <div className={styles.scrollable_div}>
                            <ActivityListContainer activity_list={country_data ? country_data.activities : []} />
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    )
};

export default CountryDetails;