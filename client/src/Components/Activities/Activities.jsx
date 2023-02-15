import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import ActivityListContainer from "../ActivityListContainer/ActivityListContainer";
import Navbar from "../NavBar/NavBar";
import PaginationControl from "../PaginationControl/PaginationControl";
import styles from "./Activities.module.css";

const Activities = props => {

    const activity_state = useSelector(state => state.activity_list_page);
    const navigate = useNavigate();
    const { page_index } = useParams();

    useEffect(() => {
        const n_page_index = parseInt(page_index);
        if ((activity_state.pagination.length && n_page_index > activity_state.pagination.length) || n_page_index < 1 || isNaN(n_page_index)) {
            navigate("/activities/1")
        }
    }, [activity_state, page_index, navigate]);

    return (

        <div className={styles.activities}>
            <div className={styles.nav_bar_area}>
                <Navbar current="activities" />
            </div>
            <div className={styles.activity_list_area}>
                <ActivityListContainer />
            </div>
            <div className={styles.pagination_area}>
                <div >
                    <PaginationControl path="activities" state_name="activity_list_page" current_page_index={activity_state.current_page} max_pages={activity_state.pagination.length} />
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Activities;