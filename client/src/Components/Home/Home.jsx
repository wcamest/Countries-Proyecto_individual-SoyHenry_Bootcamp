import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { search_country, set_current_page, set_filter, set_sort, toggle_home_settings_panel_visibility } from "../../Redux/Actions";
import CountryCardsContainer from "../CountryCardsContainer/CountryCardsContainer";
import HomeSettings from "../HomeSettings/HomeSettings";
import Navbar from "../NavBar/NavBar";
import PaginationControl from "../PaginationControl/PaginationControl";
import styles from "./Home.module.css";
import common_styles from "../common_styles.module.css";

const Home = props => {

    const home_state = useSelector((state) => state.home);
    const [search_input_text, set_search_input_text] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { page_index } = useParams();

    const handle_search_input_change = event => {
        const text = event.currentTarget.value;
        set_search_input_text(text);
        dispatch(search_country(text));
    }

    const handle_toggle_settings_panel_visibility_button_click = event => {
        dispatch(toggle_home_settings_panel_visibility());
    }

    const handle_clear_search_input_button_click = (event) => {
        set_search_input_text("");
        dispatch(search_country(""));
    }

    useEffect(() => {
        const n_page_index = parseInt(page_index);
        
        if ((home_state.pagination.length && n_page_index > home_state.pagination.length) || n_page_index < 1 || isNaN(n_page_index)) {
            navigate("/home/1");
            return;
        }
        else {
            dispatch(set_current_page("home", n_page_index));
        }


    }, [home_state, page_index, navigate, dispatch]);

    return (
        <div className={styles.home}>
            <div className={styles.nav_bar_area}>
                <Navbar current="home" events={{ home_toggle_settings_panel_visibility_button_click: handle_toggle_settings_panel_visibility_button_click }} />
            </div>
            <div className={styles.search_area}>
                <div>
                    <input onChange={handle_search_input_change} type="text" placeholder="Search country..." value={search_input_text} />
                    <button onClick={handle_clear_search_input_button_click} className={common_styles.button}>Clear</button>
                </div>
            </div>
            <div className={styles.country_cards_area}>
                <CountryCardsContainer />
            </div>
            <div className={styles.settings_area + (home_state.settings_panel_visible ? " " + styles.settings_area_visible : "")}>
                <HomeSettings />
            </div>
            <div className={styles.pagination_area}>
                <div >
                    <PaginationControl path="home" state_name="home" current_page_index={home_state.current_page} max_pages={home_state.pagination.length} />
                </div>
            </div>
        </div>
    );
}

export default Home;