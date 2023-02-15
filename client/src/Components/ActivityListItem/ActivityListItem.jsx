import styles from "./ActivityListItem.module.css";

const ActivityListItem = props => {
    const { data } = props;
    return (
        <div className={styles.activity_list_item}>
            <span className={styles.activity_name}>{data.name}</span>
            <div className={styles.activity_info}>
                <span className={styles.activity_difficulty}>difficulty level: <span className={styles.activity_info_value}>{data.difficulty}</span></span>
                <span className={styles.activity_duration}>duration: <span className={styles.activity_info_value}>{(data.duration.hours <= 9 ? "0" : "") + data.duration.hours}:{(data.duration.minutes <= 9 ? "0" : "") + data.duration.minutes + " h"}</span></span>
                <span className={styles.activity_season}>season: <span className={styles.activity_info_value}>{data.season}</span></span>
            </div>
            <div className={styles.activity_countries}>
                {
                    data.countries.map((country, key) => {
                        return <span className={styles.activity_country_item} key={key}>{country}</span>
                    })
                }
            </div>
        </div>
    )
}

export default ActivityListItem;