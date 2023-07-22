import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Provider from 'react-redux/es/components/Provider'
import { store } from './redux/store.ts'
import { ApiProvider } from "@reduxjs/toolkit/query/react"
import { api } from './redux/service/api.ts'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
