import { get_pagination_data } from "../Pagination_And_Filters_Methods/Pagination";
import {
  apply_filter_and_sort,
  Filters,
  Sort,
  SortMethod,
} from "../Pagination_And_Filters_Methods/Sort_and_Filters";
import { CREATE_ACTIVITY, HIDE_MODAL, LOAD_COUNTRIES_DATA, REFRESH_COUNTRIES_PAGE, SEARCH_BY_POPULATION, SEARCH_COUNTRY, SET_CURRENT_PAGE, SET_FILTER, SET_SORT, SHOW_ERROR, TOGGLE_HOME_SETTINGS_PANEL_VISIBILITY } from "./Actions";

let MAX_COUNTRIES_ITEMS_PER_PAGE = 9;
let MAX_ACTIVITY_LIST_ITEMS_PER_PAGE = 5;

const initial_state = {
  countries: [],
  activities: [],
  home: {
    filters: [],
    sort: Sort.None,
    sort_method: SortMethod.Ascending,
    search_result: null,
    continents: [],
    pagination: [],
    current_page: 1,
    refreshed: true,
    settings_panel_visible: false
  },
  activity_list_page: {
    current_page: 1,
    pagination: []
  },
  modal: {
    enabled: false,
    title: null,
    message: null
  }
};

const get_continents = (countries_data) => {
  const continents = [];

  countries_data.forEach((country_data) => {
    if (!continents.includes(country_data.continent)) {
      continents.push(country_data.continent);
    }
  });

  return continents;
};

const reducer = (state = initial_state, action) => {
  switch (action.type) {
    case LOAD_COUNTRIES_DATA: {

      const activities = [];

      //set up activities
      action.payload.countries.forEach(country_data => {
        if (country_data.activities.length) {
          country_data.activities.forEach(activity_data => {
            const activity_name = activity_data.name;
            const prev_activity_result = activities.filter(prev_activity_data => {
              return prev_activity_data.name === activity_name;
            });

            const splitted_activity_duration = activity_data.duration.split(":");

            if (!prev_activity_result.length) {
              activities.push({
                name: activity_name,
                difficulty: activity_data.difficulty,
                season: activity_data.season,
                duration: {
                  hours: parseInt(splitted_activity_duration[0]),
                  minutes: parseInt(splitted_activity_duration[1])
                },
                countries: [country_data.id]
              });
            } else {
              prev_activity_result[0].countries.push(country_data.id);
            }
          })
        }
      });

      MAX_COUNTRIES_ITEMS_PER_PAGE = action.payload.pagination_country_count;

      return {
        ...state,
        countries: action.payload.countries,
        activities: activities,
        home: {
          ...state.home,
          continents: get_continents(action.payload.countries),
          pagination: get_pagination_data(
            apply_filter_and_sort(
              action.payload.countries,
              state.home.filters,
              state.home.sort,
              state.home.sort_method
            )
            , MAX_COUNTRIES_ITEMS_PER_PAGE),
        },
        activity_list_page: {
          ...state.activity_list_page,
          pagination: get_pagination_data(activities, MAX_ACTIVITY_LIST_ITEMS_PER_PAGE)
        }
      };
    }
    case SEARCH_COUNTRY: {

      const _search_result = action.payload;

      return {
        ...state,
        home: {
          ...state.home,
          refreshed: false,
          search_result: _search_result,
          pagination: get_pagination_data(
            apply_filter_and_sort(
              _search_result ? _search_result : state.countries,
              state.home.filters,
              state.home.sort,
              state.home.sort_method
            )
            , MAX_COUNTRIES_ITEMS_PER_PAGE)
        }
      }
    }
    case SET_CURRENT_PAGE: {
      if (state[action.payload.state].current_page === action.payload.index)
        return state;

      return {
        ...state,
        [action.payload.state]: {
          ...state[action.payload.state],
          current_page: action.payload.index,
          refreshed: false
        }
      }
    }
    case REFRESH_COUNTRIES_PAGE: {
      return {
        ...state,
        home: {
          ...state.home,
          refreshed: true
        }
      }
    }
    case SET_FILTER: {

      const filter_type = action.payload.type;
      const filter_data = action.payload.data;

      const new_filter_stack = state.home.filters.filter(e => {
        return e.filter.type !== filter_type;
      });

      if (filter_data) {
        new_filter_stack.push({
          filter: (filter_type === Filters.ByContinent.type ? Filters.ByContinent : (filter_type === Filters.ByActivity.type ? Filters.ByActivity : null)),
          data: filter_data
        })
      }

      return {
        ...state,
        home: {
          ...state.home,
          filters: new_filter_stack,
          refreshed: false,
          pagination: get_pagination_data(
            apply_filter_and_sort(
              state.home.search_result ? state.home.search_result : state.countries,
              new_filter_stack,
              state.home.sort,
              state.home.sort_method
            )
            , MAX_COUNTRIES_ITEMS_PER_PAGE)
        }
      }
    }
    case SET_SORT: {

      const sort_type = action.payload.Type;
      const sort_order = action.payload.Order;

      return {
        ...state,
        home: {
          ...state.home,
          refreshed: false,
          sort: sort_type,
          sort_method: sort_order,
          pagination: get_pagination_data(
            apply_filter_and_sort(
              state.home.search_result ? state.home.search_result : state.countries,
              state.home.filters,
              sort_type,
              sort_order
            )
            , MAX_COUNTRIES_ITEMS_PER_PAGE)
        }
      }
    }
    case CREATE_ACTIVITY: {
      const updated_activities = [
        ...state.activities,
        action.payload
      ];
      const updated_countries = [
        ...state.countries
      ]

      action.payload.countries.forEach(activity_country_data => {
        const country_filter_result = updated_countries.filter(country_data => {
          return country_data.id === activity_country_data;
        })

        country_filter_result[0].activities.push(action.payload);
      });

      return {
        ...state,
        activities: updated_activities,
        countries: updated_countries,
        activity_list_page: {
          ...state.activity_list_page,
          pagination: get_pagination_data(updated_activities, MAX_ACTIVITY_LIST_ITEMS_PER_PAGE)
        },
        modal: {
          enabled: true,
          title: "Activity created",
          message: `Activity '${action.payload.name}' has been created`
        }
      }
    }
    case HIDE_MODAL: {
      return {
        ...state,
        modal: {
          enabled: false,
          title: null,
          message: null
        }
      }
    }
    case SHOW_ERROR: {
      return {
        ...state,
        modal: {
          enabled: true,
          title: "Error",
          message: action.payload
        }
      }
    }
    case TOGGLE_HOME_SETTINGS_PANEL_VISIBILITY: {
      return {
        ...state,
        home: {
          ...state.home,
          settings_panel_visible: !state.home.settings_panel_visible
        }
      }
    }
    case SEARCH_BY_POPULATION: {
      const population = action.payload;

      const country_filter = state.countries.filter(e => {
        return e.population <= parseInt(population);
      });
      
      return {
        ...state,
        home: {
          ...state.home,
          refreshed: false,
          search_result: country_filter,
          pagination: get_pagination_data(
            apply_filter_and_sort(
              country_filter,
              state.home.filters,
              state.home.sort,
              state.home.sort_method
            )
            , MAX_COUNTRIES_ITEMS_PER_PAGE)
        }
      }

    }
    default:
      return state;
  }
};

export default reducer;
