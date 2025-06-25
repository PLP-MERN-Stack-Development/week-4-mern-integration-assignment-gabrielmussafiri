import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { PostProvider } from './contexts/PostContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          <App />
          <Toaster position="top-right" />
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
) 