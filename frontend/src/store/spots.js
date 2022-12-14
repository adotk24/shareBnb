import { csrfFetch } from "./csrf";
const GET_SPOTS = 'spots/GET_SPOTS';
const GET_ONE_SPOT = 'spot/GET_ONE_SPOT';
const ADD_SPOT = 'spot/ADD_SPOT';
const UPDATE_SPOT = 'spot/UPDATE_SPOT';
const DELETE_SPOT = '/spot/DELETE_SPOT';



const loadSpots = (spots) => {
    return {
        type: GET_SPOTS, spots
    }
};

const loadOneSpot = spot => {
    return {
        type: GET_ONE_SPOT, spot
    }
}

const addSpot = spot => ({ type: ADD_SPOT, spot });

const updateSpot = spot => {
    return {
        type: UPDATE_SPOT, spot
    }
};

const deleteSpot = spot => ({ type: DELETE_SPOT, spot });



export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots');
    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots));
    }

};

export const getOneSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const spot = await response.json();
        dispatch(loadOneSpot(spot));
        return spot

    }

};

export const getMySpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current');
    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots));
        return spots
    }
}

export const addingSpot = addedSpot => async dispatch => {
    const { url } = addedSpot
    const response = await csrfFetch('/api/spots', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(addedSpot)
    });
    if (response.ok) {
        const spot = await response.json();
        const res = await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, preview: true })

        })

        if (res.ok) {
            const image = await res.json()
            spot.SpotImages = [image]
            dispatch(addSpot(spot));
            return spot
        }

    }
};

export const editSpot = (spot, id) => async dispatch => {
    const { url } = spot;
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(spot)
    });
    if (response.ok) {
        const spot = await response.json();
        const res = await csrfFetch(`/api/spots/${spot.id}/images`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, preview: true })

        })
        if (res.ok) {
            const image = await res.json()
            spot.SpotImages = [image]

            dispatch(updateSpot(spot));
            return spot
        }
    }
};

export const deletingSpot = id => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`, { method: 'DELETE' });
    if (response.ok) {
        const spot = await response.json();
        dispatch(deleteSpot(id));
        return spot
    }
}




const spotsReducer = (state = { spot: {}, allSpots: {} }, action) => {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = { spot: {}, allSpots: {} }
            action.spots.Spots.forEach(e => {
                newState.allSpots[e.id] = e
            })
            return newState;
        }
        case GET_ONE_SPOT: {
            const newState = { spot: {}, allSpots: {} }
            newState.spot = action.spot;
            return newState
        }
        case ADD_SPOT: {
            const newState = { ...state, spot: { ...state.spot }, allSpots: { ...state.allSpots } }
            newState.spot = action.spot
            return newState
        }
        case UPDATE_SPOT: {
            const newState = { ...state, spot: { ...state.spot }, allSpots: { ...state.allSpots } }

            newState.allSpots[action.spot.id] = action.spot
            newState.spot = action.spot
            return newState
        }
        case DELETE_SPOT: {
            const newState = {
                ...state, spots: { ...state.spot }, allSpots: { ...state.allSpots }
            };
            delete newState.allSpots[action.spot.id];
            return newState
        }
        default: return state
    }
}

export default spotsReducer
