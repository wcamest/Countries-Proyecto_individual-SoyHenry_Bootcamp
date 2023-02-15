import { fireEvent, render, screen } from "@testing-library/react";
import ActivityDesigner from "./ActivityDesigner";
import Reducer from "../../Redux/Reducer";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from "react-redux";
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from "react-router-dom";

const create_country_list_option = (country_id, country_name) => {
    const option_ = document.createElement("option");
    option_.value = country_id + "-" + country_name;
    option_.textContent = country_name;

    return option_;

}

const select_country_list_option = (country_id, country_name) => {
    const countries_list = screen.getByRole("combobox", { name: "countries-list" });
    fireEvent.change(countries_list, { target: { value: country_id + "-" + country_name } });
}

const test_selected_country_item_added = (country_id, not = false) => {
    const country_item_id = "^selected-country-item-" + country_id + "$";
    const selected_country_element = screen.queryByTestId(new RegExp(country_item_id, 'i'));

    if (!not) {
        expect(selected_country_element).toBeInTheDocument();
    } else {
        expect(selected_country_element).not.toBeInTheDocument();
    }
}

beforeEach(() => {
    const store = createStore(Reducer, applyMiddleware(thunk));

    render(
        <Provider store={store}>
            <Router>
                <ActivityDesigner />
            </Router>
        </Provider>
    );

    const countries_list = screen.getByRole("combobox", { name: "countries-list" });

    countries_list.appendChild(create_country_list_option("COL", "Colombia"));
    countries_list.appendChild(create_country_list_option("ECU", "Ecuador"));
});

describe('The activity designer structure contains', () => {
    describe('An area to input of the activity name whit', () => {
        test('A label describing the activity name input area', () => {
            const name_label = screen.queryByText(/^name$/i);
            expect(name_label).toBeInTheDocument();
        });

        test('An input element for activity name', () => {
            const input_element = screen.getByRole('textbox', { name: "activity_name" });
            expect(input_element).toBeInTheDocument();
        })
    })

    test('An area to input the difficulty level', () => {
        const difficulty_label = screen.queryByText(/^difficulty$/i);
        expect(difficulty_label).toBeInTheDocument();
    })

    test('An area to input activity duration', () => {
        const duration_label = screen.queryByText(/^duration$/i);
        expect(duration_label).toBeInTheDocument();
    })

    describe('An area to choose activity season with', () => {
        test('a label describing the seasons area', () => {
            const season_label = screen.queryByText(/^season$/i);
            expect(season_label).toBeInTheDocument();
        })

        test('Options to choose the four seasons of the year [summer, autumn, winter, spring]', () => {
            const summer_label = screen.queryByText(/^summer$/i);
            const autumn_label = screen.queryByText(/^autumn$/i);
            const winter_label = screen.queryByText(/^winter$/i);
            const spring_label = screen.queryByText(/^spring$/i);

            expect(summer_label).toBeInTheDocument();
            expect(autumn_label).toBeInTheDocument();
            expect(winter_label).toBeInTheDocument();
            expect(spring_label).toBeInTheDocument();
        });
    });

    describe('An area to choose countries with', () => {
        test('A label describing the country selection area', () => {
            const countries_label = screen.queryByText(/^countries$/i);
            expect(countries_label).toBeInTheDocument();
        });

        test('An element to be able to choose the countries', () => {
            const countries_list = screen.queryByText(/^choose an option$/i);
            expect(countries_list).toBeInTheDocument();
        });

        test('An area to list the selected countries', () => {
            const selected_countries_label = screen.queryByText(/^selected countries$/i);
            expect(selected_countries_label).toBeInTheDocument();
        })
    })
});

describe('Displaying errors:', () => {

    describe("Error messages on activity name input", () => {
        test("Does not show any error message when entering a valid activity name", () => {
            const input_element = screen.getByRole('textbox', { name: "activity_name" });
            fireEvent.change(input_element, { target: { value: "testing-activity-123" } });

            const empty_name_error_label = screen.queryByText(/you must choose a name for the activity/i);
            const invalid_name_error_label = screen.queryByText(/Activity name contains invalid characters/i);
            const existing_name_error_label = screen.queryByText(/This name is already in use/i);

            expect(empty_name_error_label).not.toBeInTheDocument();
            expect(invalid_name_error_label).not.toBeInTheDocument();
            expect(existing_name_error_label).not.toBeInTheDocument();
        });

        test('Displays an error message when the activity name input text is empty', () => {
            const input_element = screen.getByRole('textbox', { name: "activity_name" });
            fireEvent.change(input_element, { target: { value: "" } });

            const empty_error_label = screen.queryByText(/you must choose a name for the activity/i);
            expect(empty_error_label).toBeInTheDocument();
        });

        test('Displays an error message when the activity name contains invalid characters', () => {
            const input_element = screen.getByRole('textbox', { name: "activity_name" });
            fireEvent.change(input_element, { target: { value: "$%&+" } });

            const empty_error_label = screen.queryByText(/Activity name contains invalid characters/i);
            expect(empty_error_label).toBeInTheDocument();
        });
    });

    describe('Error messages on countries selection area', () => {
        test("Does not show any error message when there is at least one country selected", () => {
            const countries_list = screen.getByRole("combobox", { name: "countries-list" });

            fireEvent.change(countries_list, { target: { value: "ECU-Ecuador" } });
            const selected_country_element = screen.queryByTestId(/^selected-country-item-ecu$/i);

            expect(selected_country_element).toBeInTheDocument();
            const empty_error_label = screen.queryByText(/You must choose at least one country for this activity/i);
            expect(empty_error_label).not.toBeInTheDocument();
        })
    })

});

describe("Adding and removing countries", () => {
    test("Add a country to the list of selected countries", async () => {
        select_country_list_option("COL", "Colombia");
        test_selected_country_item_added("col");
    });

    test("Remove a country to the list of selected countries", async () => {
        select_country_list_option("COL", "Colombia");
        test_selected_country_item_added("col");

        const remove_selected_country_button = screen.queryByTestId(/^remove-selected-country-item-col$/i);
        fireEvent.click(remove_selected_country_button);
        
        test_selected_country_item_added("col", true);
    });
})