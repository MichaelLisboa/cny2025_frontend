// useAppState.js

import { useReducer, useEffect } from 'react';

const defaultState = {
    birthdate: null,
    zodiac: null,
    element: null,
    wishes: [],
    userData: {
        name: null,
        email: null,
    },
};

const getState = () => {
    if (typeof window === "undefined") return defaultState;
    const storedState = localStorage.getItem('appState');
    return storedState ? { ...defaultState, ...JSON.parse(storedState) } : defaultState;
};

// Merge the new state with the existing state from localStorage before saving.
const updateState = (newState) => {
    if (typeof window !== "undefined") {
        const storedState = localStorage.getItem('appState');
        const currentState = storedState ? JSON.parse(storedState) : defaultState;

        // **Fix: Properly deduplicate wishes by comparing wish content, not object references**
        const mergedWishes = [...currentState.wishes, ...newState.wishes].reduce((unique, wish) => {
            if (!unique.some(w => w.wish === wish.wish)) unique.push(wish);
            return unique;
        }, []);

        const mergedState = { 
            ...currentState, 
            ...Object.fromEntries(
                Object.entries(newState).filter(([key, value]) => value !== null && key !== "wishes")
            ),
            wishes: mergedWishes
        };

        localStorage.setItem('appState', JSON.stringify(mergedState));
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_BIRTHDATE':
            return { ...state, birthdate: action.payload };
        case 'SET_ZODIAC':
            return { ...state, zodiac: action.payload };
        case 'SET_ELEMENT':
            return { ...state, element: action.payload };
        case 'SET_WISHES':
            return {
                ...state,
                wishes: [
                    // **Fix: Prevent duplicates in state before dispatching**
                    ...state.wishes.filter(w => !action.payload.some(nw => nw.wish === w.wish)), 
                    ...action.payload 
                ]
            };
        case 'SET_USER_DATA':
            return { ...state, userData: { ...state.userData, ...action.payload } };
        case 'CLEAR':
            return { ...defaultState }; // Reset properly, don't return empty object
        default:
            console.error(`Unknown action type: ${action.type}`);
            return state;
    }
};

const useAppState = (initialState = {}) => {
    // Initialize once with saved state merged with any provided initialState.
    const [state, dispatch] = useReducer(reducer, { ...getState(), ...initialState });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedState = localStorage.getItem('appState');
            const currentState = storedState ? JSON.parse(storedState) : defaultState;

            // **Fix: Only update localStorage if the state actually changed**
            const mergedState = {
                ...currentState,
                ...state
            };

            if (JSON.stringify(currentState) !== JSON.stringify(mergedState)) {
                updateState(mergedState);
            }
        }
    }, [state]); 

    const birthdateExists = () => !!state.birthdate;

    return { state, dispatch, birthdateExists };
};

export default useAppState;