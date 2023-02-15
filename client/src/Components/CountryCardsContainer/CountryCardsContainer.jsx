import styles from "./CountryCardsContainer.module.css";
import { useDispatch, useSelector } from "react-redux";
import CountryCard from "../CountryCard/CountryCard";
import { useEffect } from "react";
import { refresh_countries_page } from "../../Redux/Actions";

const CountryCardsContainer = (props) => {
  const home_state = useSelector((state) => state.home);
  const dispatch = useDispatch();

  const render_country_cards = () => {
    if (home_state.pagination.length && home_state.current_page > 0 && home_state.current_page <= home_state.pagination.length) {

      return home_state.pagination[home_state.current_page - 1].map(
        (country_data, key) => {
          return <CountryCard key={key} data={country_data} />;
        }
      );
    }

    return null;
  };

  useEffect(() => {
    if (!home_state.refreshed) {
      dispatch(refresh_countries_page());
    }
  });

  return (
      home_state.pagination.length ?
      <div className={styles.country_cards_container}>
        {home_state.refreshed ? render_country_cards() : null}
      </div>
      :
      <span className={styles.no_countries_info}>There are no countries that match the filter settings</span>

  );
};

export default CountryCardsContainer;
