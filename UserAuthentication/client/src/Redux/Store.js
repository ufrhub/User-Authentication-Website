import { compose, createStore } from 'redux';
import Reducer from './Reducers/CombinedReducers';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const Store = createStore(Reducer, composeEnhancer());

export default Store;