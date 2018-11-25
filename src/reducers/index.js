import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as testSaga } from '../sagas/testSaga/reducer'
import { firebaseReducer } from 'react-redux-firebase'
const reducers = combineReducers({
  testSaga,
  firebase: firebaseReducer,
  form: formReducer
})

export default reducers
