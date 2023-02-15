import Reducer from "./Reducer";
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export const store = createStore(Reducer, applyMiddleware(thunk));