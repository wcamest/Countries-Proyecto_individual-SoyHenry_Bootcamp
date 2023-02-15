import { useDispatch, useSelector } from "react-redux";
import { hide_modal } from "../../Redux/Actions";
import styles from "./Modal.module.css";

const Modal = props => {

    const global_state = useSelector(state => state);
    const dispatch = useDispatch();

    const handle_modal_accept_button_click = event => {
        dispatch(hide_modal());
    }

    return (
        <div className={styles.modal_container}>
            <div className={styles.modal}>
                <div className={styles.modal_title}>
                    <span>{global_state.modal.title}</span>
                </div>
                <div className={styles.modal_content}>
                    <span>{global_state.modal.message}</span>
                </div>
                <div className={styles.modal_buttons}>
                    <button onClick={handle_modal_accept_button_click}>Accept</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;