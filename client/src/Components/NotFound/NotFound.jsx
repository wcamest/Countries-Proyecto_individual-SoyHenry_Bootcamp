import styles from "./NotFound.module.css";
import common_styles from "../common_styles.module.css";
import { NavLink } from "react-router-dom";

const NotFound = () => {
    return (
        <div className={styles.not_found_page}>
            <h1>404</h1>
            <h3>Page not Found</h3>
            <NavLink className={common_styles.button} to="/home/1">Home</NavLink>
        </div>
    )
}

export default NotFound;