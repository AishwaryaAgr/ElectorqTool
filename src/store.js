import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'

const initialState = {};

const middlleware = [thunk];

const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlleware),
    window.___REDUX_DEVTOOLS_EXTENSION__ && window.___REDUX_DEVTOOLS_EXTENSION__()
));

export default store;