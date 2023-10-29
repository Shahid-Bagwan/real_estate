import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const rootReducer = combineReducers({user : userReducer}); 
const persistConfig = {
  key: 'root',
  storage,
  version:1, 
};
// adds persistence logic to the existing reducer.
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  // This means the state should only contain plain JavaScript objects or arrays. It prevents the state from including non-serializable values like functions, Promises, Symbols, Maps, Sets, and other non-plain JavaScript objects, which cannot be easily serialized into a string for storage.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);