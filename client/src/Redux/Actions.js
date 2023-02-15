import {backend_url} from "../urls.js";

export const LOAD_COUNTRIES_DATA = "LOAD_COUNTRIES_DATA";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
export const REFRESH_COUNTRIES_PAGE = "REFRESH_COUNTRIES_PAGE";
export const SET_FILTER = "SET_FILTER";
export const SET_SORT = "SET_SORT";
export const CREATE_ACTIVITY = "CREATE_ACTIVITY";
export const SEARCH_COUNTRY = "SEARCH_COUNTRY";
export const SHOW_ERROR = "SHOW_ERROR";
export const HIDE_MODAL = "HIDE_MODAL";
export const SEARCH_BY_POPULATION = "SEARCH_BY_POPULATION";
export const TOGGLE_HOME_SETTINGS_PANEL_VISIBILITY = "TOGGLE_HOME_SETTINGS_PANEL_VISIBILITY";

const url = backend_url;

export const load_countries_data = (pagination_country_count) => {
    return async function (dispatch) {
        fetch(url + "/countries/").then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(res.statusText);
            }
        }).then(res => {
            dispatch({
                type: LOAD_COUNTRIES_DATA,
                payload: {
                    countries: res,
                    pagination_country_count
                }
            });
        }).catch(error => {
            dispatch({
                type: SHOW_ERROR,
                payload: "Cannot load country data: " + error.message
            })
        })
    }
}

/*export const search_country = (search_value) => {

    if (search_value && search_value.length) {
        return async function (dispatch) {
            fetch(url + "/countries?name=" + search_value).then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(res.status)
                }
            }).then(res => {
                dispatch({
                    type: SEARCH_COUNTRY,
                    payload: res
                })
            }).catch(error => {
                if (parseInt(error.message) === 404) {
                    dispatch({
                        type: SEARCH_COUNTRY,
                        payload: []
                    })
                }
            })
        }
    } else {
        return {
            type: SEARCH_COUNTRY,
            payload: null
        }
    }
}*/

export const search_country = (search_value) => {
    return {
        type: SEARCH_BY_POPULATION,
        payload: search_value
    }
}

export const set_current_page = (state_name, page_index) => {
    return {
        type: SET_CURRENT_PAGE,
        payload: {
            index: page_index,
            state: state_name
        }
    }
}

export const refresh_countries_page = () => {
    return {
        type: REFRESH_COUNTRIES_PAGE
    }
}

export const set_filter = (filter_data) => {
    return {
        type: SET_FILTER,
        payload: filter_data
    }
}

export const set_sort = (sort_data) => {
    return {
        type: SET_SORT,
        payload: sort_data
    }
}

export const create_activity = activity_data => {

    return async function (dispatch) {
        fetch(url + "/activities/create", {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(activity_data)
        }).then(res => {
            if (res.ok) {
                dispatch({
                    type: CREATE_ACTIVITY,
                    payload: activity_data
                })
            } else {
                throw new Error(res.statusText);
            }
        }).catch(error => {
            dispatch({
                type: SHOW_ERROR,
                payload: "Error trying to create activity: " + error.message
            })
        })
    }

    /*return {
        type: CREATE_ACTIVITY,
        payload: activity_data
    }*/
}

export const hide_modal = () => {
    return {
        type: HIDE_MODAL
    }
}

export const toggle_home_settings_panel_visibility = () => {
    return {
        type : TOGGLE_HOME_SETTINGS_PANEL_VISIBILITY
    }
}