import styles from "./PaginationControl.module.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { set_current_page } from "../../Redux/Actions";
import { redirect } from "react-router-dom";
import { useEffect } from "react";

const PaginationControl = props => {
    const home_state = useSelector((state) => state.home);
    const dispatch = useDispatch();

    const { current_page_index, max_pages, path, state_name } = props;
    let _first_5_buttons = [1, 2, 3, 4, 5];
    let _middle_buttons = [-2, -1, 0, 1, 2];
    let _last_5_buttons = [max_pages - 4, max_pages - 3, max_pages - 2, max_pages - 1, max_pages];
    let _button_sets = [];

    if (max_pages <= 5) {
        _first_5_buttons = null;
        _last_5_buttons = null;

        for (let it = 0; it < max_pages; it++) {
            _button_sets.push(it + 1);
        }
    } else {
        _button_sets = (current_page_index <= 4) ? _first_5_buttons : (current_page_index + 3 >= max_pages) ? _last_5_buttons : _middle_buttons;
    }

    const handle_page_button_click = (event) => {
        const next_page_index = event.currentTarget.id;
        dispatch(set_current_page(state_name, parseInt(next_page_index)));

    }

    const handle_first_button_click = (event) => {
        dispatch(set_current_page(state_name, 1));
    }

    const handle_last_button_click = (event) => {
        dispatch(set_current_page(state_name, max_pages));
    }

    const handle_next_button_click = (event) => {

        if (event.currentTarget.getAttribute("disabled") != null) {
            event.preventDefault();
            return;
        }

        dispatch(set_current_page(state_name, current_page_index + 1));
    }

    const handle_previous_button_click = (event) => {

        if (event.currentTarget.getAttribute("disabled") != null) {
            event.preventDefault();
            return;
        }

        dispatch(set_current_page(state_name, current_page_index - 1));
    }

    const render_side_button = (button_set_for_comparison, to, click_handler) => {

        if (button_set_for_comparison !== null && _button_sets !== button_set_for_comparison) {
            return <NavLink className={styles.page_index} to={`/${path}/` + to} onClick={click_handler}>{to}</NavLink>
        }

        return null;
    }

    const render_ellipsis = (button_set_for_comparison) => {
        if (button_set_for_comparison !== null && _button_sets !== button_set_for_comparison) {
            return <span className={styles.pagination_ellipsis}>...</span>
        }

        return null;
    }

    const render_arrow_control = (arrow, to, limit, click_handler) => {
        return <NavLink onClick={click_handler} to={`/${path}/` + to} className={styles.page_control_button} disabled={current_page_index === limit}>{arrow}</NavLink>
    }

    const render_pagination_control = () => {
        return (<div className={styles.pagination_control}>
            {render_arrow_control("◄", (current_page_index - 1), 1, handle_previous_button_click)}
            {render_side_button(_first_5_buttons, 1, handle_first_button_click)}
            {render_ellipsis(_first_5_buttons)}
            {
                _button_sets.map((button_index, key) => {
                    const _target_index = _button_sets === _middle_buttons ? current_page_index + button_index : button_index;
                    return <NavLink className={(({ isActive }) => { return styles.page_index + ((isActive) ? " " + styles.current_button_page : "") })} id={_target_index} to={`/${path}/` + _target_index} onClick={handle_page_button_click} key={key}>{_target_index}</NavLink>
                })
            }
            {render_ellipsis(_last_5_buttons)}
            {render_side_button(_last_5_buttons, max_pages, handle_last_button_click)}
            {render_arrow_control("►", (current_page_index + 1), max_pages, handle_next_button_click)}
        </div>);
    }

    return (max_pages > 0 ? render_pagination_control() : null);
}

export default PaginationControl;