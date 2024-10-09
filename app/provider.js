'use client';

import { Provider } from 'react-redux';
import {store, persistor} from '@/lib/store'
import { PersistGate } from 'redux-persist/integration/react';

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
