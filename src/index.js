import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
//import todoApp from './store/Reducers'
import App from './App'

//let store = createStore(todoApp)

render(
    <App />,
  document.getElementById('root')
)
