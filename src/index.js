import React from 'react'
import ReactDOM from 'react-dom'
import App from './AppContainer'
import './index.css'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'

import reducers from './reducers'
import createSagaMiddleware from 'redux-saga'

import sagas from './sagas'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import { blue800, amber50 } from 'material-ui/styles/colors'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import firebase from 'firebase'
import 'firebase/functions'
const muiTheme = getMuiTheme({
  palette: {
    accent1Color: amber50
  },
  tabs: {
    backgroundColor: blue800
  }
})
const firebaseConfig = {
  apiKey: "AIzaSyBXvmKBhwKs37ZH38V0swzPYqAw6GObD90",
  authDomain: "cure-tech.firebaseapp.com",
  databaseURL: "https://cure-tech.firebaseio.com",
  projectId: "cure-tech",
  storageBucket: "cure-tech.appspot.com",
  messagingSenderId: "232651283261"
}

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}
// Initialize firebase instance
firebase.initializeApp(firebaseConfig)
firebase.functions()
const sagaMiddleware = createSagaMiddleware()

let composeEnhancers = compose

if (process.env.NODE_ENV === 'development') {
  const composeWithDevToolsExtension =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  if (typeof composeWithDevToolsExtension === 'function') {
    composeEnhancers = composeWithDevToolsExtension
  }
}

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  // reduxFirestore(firebase) // <- needed if using firestore
)(createStore)

const initialState = {}
const store = createStoreWithFirebase(reducers, initialState,composeEnhancers(applyMiddleware(sagaMiddleware)))

sagaMiddleware.run(sagas)

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)

/**
 * Object.prototype.forEach() polyfill
 * https://gomakethings.com/looping-through-objects-with-es6/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Object.prototype.forEach) {
	Object.defineProperty(Object.prototype, 'forEach', {
		value: function (callback, thisArg) {
			if (this == null) {
				throw new TypeError('Not an object');
			}
			thisArg = thisArg || window;
			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					callback.call(thisArg, this[key], key, this);
				}
			}
		}
	});
}
