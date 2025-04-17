import { configureStore,combineReducers } from "@reduxjs/toolkit";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./reducer/createSlice";

const persistConfig = {
    key : "root", //top level key used in local storage, data is under persist : root
    version : 1,
    storage //refers to redux-persist/lib/storage
}

const rootReducer = combineReducers({ //combines individual reducers into single root reducer
    user : userReducer
})

const persistedReducer = persistReducer(persistConfig,rootReducer) // wraps rootreducer under persistence logic

export const store = configureStore({
    reducer : persistedReducer,
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck : {
                ignoredActions : [FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
            }
        })
})

export const persistor = persistStore(store); // handles rehydration of state and controls persistence lifecycle

/*
here mw is middleman b/w actions and reducers - does logging,async actions
serializable check means make sure all state and actions are in json objcts
but some special actions like rehydrate,persist ect are not serializable
so here mentioned that ignore these actions when checking for serializability
*/

/*
persistence life cycle : 
persist(saves state from redux store to localstorage) - rehydrate(loads saved state into redux store) - pause(stops when persisting changes to storage) - purge(delete all saved state from storage) - flush - regsiter(starts tracking reducer for first time)
*/

/*
two concepts of storage in memory:

1)Redux Store (In-Memory, similar to primary memory)
This is where your app state lives temporarily.
It exists only in memory — once you refresh the page, it's gone.

2)Persistent Storage (like localStorage, similar to secondary memory)
This is where redux-persist saves the Redux state.
It stays even after a refresh or reopening the browser.
*/

/* 
What redux-persist does:
It connects these two:

Saves Redux store state into localStorage (or sessionStorage, AsyncStorage, etc.).

On page load, it restores that state back into the Redux store.
*/