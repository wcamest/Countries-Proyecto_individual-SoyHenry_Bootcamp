import { NavLink } from "react-router-dom";
import styles from "./Landing.module.css";

const Landing = props => {
    return (
        <div className={styles.landing_page}>
            <h1>The Countries App</h1>
            <span>William Estrada</span>
            <NavLink className={styles.home_link} to="/home/1">Start</NavLink>
        </div>
    )
}

export default Landing;