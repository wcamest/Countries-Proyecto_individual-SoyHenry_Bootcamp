import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Components/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import { load_countries_data } from "./Redux/Actions";
import Activities from "./Components/Activities/Activities";
import ActivityDesigner from "./Components/ActivityDesigner/ActivityDesigner";
import CountryDetails from "./Components/CountryDetail/CountryDetails";
import Landing from "./Components/Landing/Landing";
import Modal from "./Components/Modal/Modal";
import NotFound from "./Components/NotFound/NotFound";

function App() {

  const global_state = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(() => {

    const client_rect = document.body.getBoundingClientRect();
    const app_width = client_rect.width;
    const app_height = client_rect.height;

    let pagination_country_count = 9;

    if (app_width < 1000)
      pagination_country_count = 10;

    dispatch(load_countries_data(pagination_country_count));
  }, [dispatch]);

  const handle_on_mouse_move = event => {

    const client_rect = event.currentTarget.getBoundingClientRect();
    const app_width = client_rect.width;
    const app_height = client_rect.height;

    if (app_width < 1000)
      return;

    const word_map_width = 3000;
    const word_map_height = 1220;

    const clientX = event.clientX;
    const clientY = event.clientY;

    const mouse_position_x_percent = clientX / app_width;
    const mouse_position_y_percent = clientY / app_height;

    const x_difference = word_map_width - app_width;
    const y_difference = word_map_height - app_height;

    const background_position_x = (-(x_difference * mouse_position_x_percent)) + "px";
    const background_position_y = (-(y_difference * mouse_position_y_percent)) + "px";

    document.querySelector(".world_map_background").style.backgroundPosition = background_position_x + " " + background_position_y;

  }

  return (
    <div className="App" onMouseMove={handle_on_mouse_move}>
      <div className="world_map_background">

      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="home" element={<Home />}>
          <Route path=':page_index' element={<Home />} />
        </Route>
        <Route path="countries/:country_id" element={<CountryDetails />} />
        <Route path="/activities">
          <Route index element={<Activities />} />
          <Route path=":page_index" element={<Activities />} />
          <Route path="designer" element={<ActivityDesigner />}>
            <Route path=":country_id" element={<ActivityDesigner />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {
        global_state.modal.enabled ?
          <Modal /> : null
      }
    </div>
  );
}

export default App;
