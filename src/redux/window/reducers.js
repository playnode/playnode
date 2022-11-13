import {actionTypes} from "./actions";

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState = {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 900
};

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

function resized(state, action) {
    return {
        ...state,
        width: action.width,
        height: action.height,
        isMobile: action.width < 900
    };
}

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

const actionsMap = {
    [actionTypes.resized]: resized
};

export default function reducer(state = initialState, action) {
    const reducerFunction = actionsMap[action.type];
    return reducerFunction ? reducerFunction(state, action) : state;
}