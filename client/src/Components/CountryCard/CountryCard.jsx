import styles from "./CountryCard.module.css";
import { Link, NavLink } from "react-router-dom";

const CountryCard = (props) => {
  const { data } = props;
  return (
    <NavLink className={styles.nav_link} to={"../countries/" + data.id}>
      <div className={styles.country_card}>
        <div className={styles.country_flag_outer}>
          <div
            className={styles.country_flag}
            style={{ backgroundImage: `url(${data.flag_icon})` }}
          ></div>
        </div>
        <div className={styles.card_info}>
          <span className={styles.country_name}>{data.name}</span>
          <span>{data.continent}</span>
          <span className={styles.country_population}>Pop.: {data.population.toLocaleString('en', { useGrouping: true })}</span>
        </div>
      </div>
    </NavLink>
  );
};

export default CountryCard;
