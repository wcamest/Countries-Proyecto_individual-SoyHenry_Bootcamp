export const Filters = {
  None: "None",
  ByContinent: {
    index: 0,
    type: "ByContinent",
  },
  ByActivity: {
    index: 1,
    type: "ByActivity",
  },
};

export const Sort = {
  None: "None",
  ByName: "ByName",
  ByPopulation: "ByPopulation",
};

export const SortMethod = {
  Ascending: "Ascending",
  Descending: "Descending",
};

export const apply_filter_and_sort = (
  countries_data,
  filters,
  sort,
  sort_method
) => {
  let resulting_data = [...countries_data];

  if (filters !== Filters.None && Array.isArray(filters)) {
    filters.sort((a, b) => {
      if (a.filter.index < b.filter.index) return -1;

      if (a.filter.index > b.filter.index) return 1;

      return 0;
    });

    filters.forEach((e) => {
      if (e.data !== null) {

        if (e.filter.type === Filters.ByContinent.type) {
          resulting_data = resulting_data.filter((country_data) => {
            return country_data.continent === e.data;
          });
        } else if (e.filter.type === Filters.ByActivity.type) {
          resulting_data = resulting_data.filter((country_data) => {
            return country_data.activities.findIndex(activity_data => {
              return activity_data.name === e.data;
            }) > -1;
          })
        }
      }
    });
  }

  if (sort === Sort.ByName) {
    if (sort_method === SortMethod.Descending) {
      resulting_data.sort((a, b) => {
        if (a.name < b.name) return 1;

        if (a.name > b.name) return -1;

        return 0;
      });
    } else if (sort_method === SortMethod.Ascending) {
      resulting_data.sort((a, b) => {
        if (a.name < b.name) return -1;

        if (a.name > b.name) return 1;

        return 0;
      });
    }
  } else if (sort === Sort.ByPopulation) {
    if (sort_method === SortMethod.Descending) {
      resulting_data.sort((a, b) => {
        if (a.population < b.population) return 1;

        if (a.population > b.population) return -1;

        return 0;
      });
    } else if (sort_method === SortMethod.Ascending) {
      resulting_data.sort((a, b) => {
        if (a.population < b.population) return -1;

        if (a.population > b.population) return 1;

        return 0;
      });
    }
  }

  return resulting_data;
};
