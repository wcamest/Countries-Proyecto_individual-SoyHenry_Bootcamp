import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_filter, set_sort } from "../../Redux/Actions";
import styles from "./HomeSettings.module.css";

const HomeSettings = props => {

    const global_state = useSelector((state) => state);
    const home_state = global_state.home;
    const activities = global_state.activities;
    const dispatch = useDispatch();

    const [filterByContinentEnabled, setFilterByContinentEnabled] = useState(false);
    const [filterByActivityEnabled, setFilterByActivityEnabled] = useState(false);
    const [local_filters_state, set_local_filter_state] = useState({
        by_continent_data: null,
        by_activity_data: null
    });
    const [local_sort_state, set_local_sort_state] = useState({
        Type: "None",
        Order: "Ascending"
    })

    const handle_enabled_by_continent_filter_change = event => {
        setFilterByContinentEnabled(event.currentTarget.checked);

        dispatch(set_filter({
            type: "ByContinent",
            data: event.currentTarget.checked ? (local_filters_state.by_continent_data ? local_filters_state.by_continent_data : home_state.continents[0]) : null
        }));
    }

    const handle_enabled_by_activity_filter_change = event => {
        setFilterByActivityEnabled(event.currentTarget.checked);

        dispatch(set_filter({
            type: "ByActivity",
            data: event.currentTarget.checked ? (local_filters_state.by_activity_data ? local_filters_state.by_activity_data : activities[0].name) : null
        }));
    }

    const handle_by_continent_filter_change = event => {
        const selected_continent = event.currentTarget.selectedOptions[0].value;

        set_local_filter_state({
            ...local_filters_state,
            by_continent_data: selected_continent
        })

        dispatch(set_filter({
            type: "ByContinent",
            data: selected_continent
        }));
    }

    const handle_by_activity_filter_change = event => {
        const selected_activity = event.currentTarget.selectedOptions[0].value;

        set_local_filter_state({
            ...local_filters_state,
            by_activity_data: selected_activity
        })

        dispatch(set_filter({
            type: "ByActivity",
            data: selected_activity
        }));
    }

    const handle_sort_type_change = event => {
        const selected_type = event.currentTarget.selectedOptions[0].value;
        const sort_data = {
            ...local_sort_state,
            Type: selected_type
        };

        set_local_sort_state(sort_data);
        dispatch(set_sort(sort_data));
    }

    const handle_sort_order_change = event => {
        const selected_order = event.currentTarget.selectedOptions[0].value;
        const sort_data = {
            ...local_sort_state,
            Order: selected_order
        };

        set_local_sort_state(sort_data);
        dispatch(set_sort(sort_data));

        console.log(home_state);
    }

    useEffect(() => {
        const filterByContinent = home_state.filters.filter(e => {
            return e.filter.type === "ByContinent";
        });
        const filterByActivity = home_state.filters.filter(e => {
            return e.filter.type === "ByActivity";
        })

        let update_filters = false;
        let _by_continent_data = local_filters_state.by_continent_data;
        let _by_activity_data = local_filters_state.by_activity_data;

        if (filterByContinent.length) {
            const continent = filterByContinent[0].data;
            if (local_filters_state.by_continent_data !== continent) {
                setFilterByContinentEnabled(true);
                _by_continent_data = continent;
                update_filters = true;
            }
        }

        if(filterByActivity.length) {
            const activity = filterByActivity[0].data;
            if(local_filters_state.by_activity_data !== activity){
                setFilterByActivityEnabled(true);
                _by_activity_data = activity;
                update_filters = true;
            }
        }

        if(update_filters){
            set_local_filter_state({
                by_continent_data: _by_continent_data,
                by_activity_data: _by_activity_data
            });
        }

        let update_sort = false;
        let _sort_type = local_sort_state.Type;
        let _sort_order = local_sort_state.Order;

        if (home_state.sort !== local_sort_state.Type) {
            _sort_type = home_state.sort;
            update_sort = true;
        }

        if (home_state.sort_method !== local_sort_state.Order) {
            _sort_order = home_state.sort_method;
            update_sort = true;
        }

        if (update_sort) {
            set_local_sort_state({
                Type: _sort_type,
                Order: _sort_order
            })
        }

    }, [local_filters_state, set_local_filter_state, local_sort_state, set_local_sort_state])

    const get_filter_select_value = (filter_data_name) => {
        return local_filters_state[filter_data_name] !== null ? local_filters_state[filter_data_name] : ""
    }

    return (<div>
        <fieldset className={styles.settings_fieldset}>
            <legend className={styles.settings_title}>Settings</legend>
            <fieldset>
                <legend>Filter by Continents</legend>
                <input onChange={handle_enabled_by_continent_filter_change} type="checkbox" id="enabled_by_continent_filter" name="enabled_by_continent_filter" checked={filterByContinentEnabled} /><label htmlFor="enabled_by_continent_filter">Enable</label>
                <div>
                    <span>Continent:</span>
                    <select value={get_filter_select_value("by_continent_data")} onChange={handle_by_continent_filter_change} disabled={!filterByContinentEnabled}>
                        {
                            home_state.continents.map((continent_name, key) => {
                                return <option key={key} value={continent_name}>{continent_name}</option>
                            })
                        }
                    </select>
                </div>
            </fieldset>
            <fieldset>
                <legend>Filter by Activity</legend>
                <input onChange={handle_enabled_by_activity_filter_change} type="checkbox" id="enabled_by_activity_filter" name="enabled_by_activity_filter" checked={filterByActivityEnabled} disabled={!activities.length} /><label htmlFor="enabled_by_activity_filter">Enable</label>
                <div>
                    <span>Activity:</span>
                    <select value={get_filter_select_value("by_continent_activity")} onChange={handle_by_activity_filter_change} disabled={!filterByActivityEnabled}>
                        {
                            (!activities.length ? <option value="" hidden>No activities available</option> : null)
                        }
                        {
                            activities.map((activity_data, key) => {
                                return <option key={key} value={activity_data.name}>{activity_data.name}</option>
                            })
                        }
                    </select>
                </div>
            </fieldset>
            <fieldset>
                <legend>Sort</legend>
                <div className={styles.sort_settings}>
                    <div>
                        <span>Type:</span>
                        <select value={local_sort_state.Type} onChange={handle_sort_type_change}>
                            <option value="None">None</option>
                            <option value="ByName">By Name</option>
                            <option value="ByPopulation">By Population</option>
                        </select>
                    </div>
                    <div>
                        <span>Order:</span>
                        <select value={local_sort_state.Order} onChange={handle_sort_order_change}>
                            <option value="Ascending">Ascending</option>
                            <option value="Descending">Descending</option>
                        </select>
                    </div>
                </div>
            </fieldset>
        </fieldset>
    </div>)
}

export default HomeSettings;