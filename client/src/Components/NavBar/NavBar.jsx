import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css'
import common_styles from "../common_styles.module.css";

const Navbar = props => {

    const { current } = props;
    const { country_details_data } = props;
    const { data } = props;

    const home_state = useSelector(state => state.home);

    const render_buttons = () => {
        switch (current) {
            case "home":
                return [
                    <NavLink key={0} className={common_styles.button} to={"/activities/"}>Activities</NavLink>,
                    <a key={1} onClick={props.events["home_toggle_settings_panel_visibility_button_click"]} className={common_styles.button + " " + styles.home_show_settings_button}>{home_state.settings_panel_visible ? "Hide" : "Show"} Settings</a>
                ]
            case "activity_designer":
                return [
                    <NavLink key={0} className={common_styles.button} to={"/activities/"}>Activities</NavLink>,
                    (data.back_to_country_details ? <NavLink key={1} className={common_styles.button} to={"/countries/" + data.back_to_country_details}>Back to country details</NavLink> : null)
                ]
            case "activities":
                return [
                    <NavLink key={0} className={common_styles.button} to={"/home/1"}>home</NavLink>,
                    <NavLink key={1} className={common_styles.button} to={"/activities/designer"}>Create new Activity</NavLink>
                ]
            case "country_details":
                return [
                    <NavLink key={0} className={common_styles.button} to={"/home/1"}>home</NavLink>,
                    <NavLink key={1} className={common_styles.button} to={"/activities/designer/" + country_details_data}>Create Activity</NavLink>
                ]
            default:
                return null;
        }
    }

    return (
        <div className={styles.nav_bar}>
            {
                render_buttons()
            }
        </div>
    )
}

export default Navbar;