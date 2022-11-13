import {take, put, call} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import {resized} from "./actions";

// -----------------------------------------------------------------------------
// Action watchers
// -----------------------------------------------------------------------------

export function* watchForWindowResizeEvents() {
    const chan = yield call(getWindowResizeEventChannel);
    try {
        while (true) {
            const area = yield take(chan);
            yield put(resized(area.width, area.height));
        }
    } finally {
        chan.close();
    }
}

// -----------------------------------------------------------------------------
// Action handlers
// -----------------------------------------------------------------------------

function getWindowResizeEventChannel() {
    return eventChannel(emit => {

        const emitter = () => {
            emit({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', emitter);

        return () => {
            // Must return an unsubscribe function.
            window.removeEventListener('resize', emitter);
        }
    })
}