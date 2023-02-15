import { useSelector } from "react-redux";
import ActivityListItem from "../ActivityListItem/ActivityListItem";
import styles from "./ActivityListContainer.module.css";

const ActivityListContainer = props => {
    const global_state = useSelector(state => state);
    const activity_list_state = global_state.activity_list_page;
    const { activity_list } = props;

    const render_activity_list_items = () => {

        if (activity_list) {
            if (activity_list.length) {
                return activity_list.map((activity_data, key) => {
                    const activity = global_state.activities.filter(e => {
                        return e.name === activity_data.name;
                    })
                    return <ActivityListItem key={key} data={activity[0]} />;
                });
            } else {
                return <span>There are no activities implemented yet</span>
            }
        } else if (activity_list_state.pagination.length && activity_list_state.current_page > 0 && activity_list_state.current_page <= activity_list_state.pagination.length) {
            return activity_list_state.pagination[activity_list_state.current_page - 1].map(
                (activity_data, key) => {
                    return <ActivityListItem key={key} data={activity_data} />;
                }
            );
        } else {
            return <span className={styles.no_activities_label}>There are no activities implemented yet</span>
        }
    }

    return (
        <div className={styles.activity_list_container}>
            {
                render_activity_list_items()
            }
        </div>
    )
}

export default ActivityListContainer;