import { useReducer, useEffect } from 'react';

// Helper to get state from localStorage
const getState = () => {
    if (typeof window === "undefined") return {}; // Avoid errors during SSR
    const state = typeof window !== "undefined" ? localStorage.getItem('appState') : null;
    return state ? JSON.parse(state) : {}; // Return parsed state or default empty object
};

// Helper to update state in localStorage
const updateState = (newState) => {
    if (typeof window !== "undefined") {
        const existingState = getState();
        const mergedState = { ...existingState, ...newState };
        localStorage.setItem('appState', JSON.stringify(mergedState));
    }
};

// Reducer function to handle state transitions
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_BIRTHDATE':
            return { ...state, birthdate: action.payload };
        case 'SET_ZODIAC':
            return { ...state, zodiac: action.payload };
        case 'SET_ELEMENT':
            return { ...state, element: action.payload };
        case 'SET_WISHES':
            return { ...state, ...{ wishes: action.payload } };
        case 'SET_USER_DATA':
            return { ...state, userData: action.payload };
        case 'CLEAR':
            return {}; // Clear all state
        default:
            console.error(`Unknown action type: ${action.type}`);
            return state; // Return current state if action type is unknown
    }
};

// Custom hook to manage app state
const useAppState = (initialState = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState, getState);

    useEffect(() => {
        if (typeof window !== "undefined") {
            updateState(state);
        }
    }, [state]);

    // Helper functions
    const birthdateExists = () => !!state.birthdate;

    return { state, dispatch, birthdateExists };
};

export default useAppState;