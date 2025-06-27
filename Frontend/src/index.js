import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './landing_page/home/HomePage';
import Main from './landing_page/Dashboard/Main';
import Holdings from './landing_page/Dashboard/Holdings';
import Positions from './landing_page/Dashboard/Positions';
import Orders from './landing_page/Dashboard/Orders';
import WatchList from './landing_page/Dashboard/WatchList';
import ProfilePage from './landing_page/profile/profile';
import Authentication from './landing_page/pages/authentication';
import { AuthProvider } from './landing_page/contexts/AuthContext';
import About from './landing_page/about/About';
import Login from './landing_page/views/users/login.js';
import Signup from './landing_page/views/users/signup.js';
import Logout from './landing_page/views/users/logout.js';
import News from './landing_page/News.js';
import Chat from './landing_page/Chat.js';
import Funds from './landing_page/Dashboard/Funds.js'
// Importing App component to handle routes under /home and /home/:url
import LandingPage from './landing_page/pages/landing';
import VideoMeetComponent from './landing_page/pages/VideoMeet';
import HomeComponent from './landing_page/pages/home';
import History from './landing_page/pages/history';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-nckpqc670iaq2y81.us.auth0.com"
      clientId="jeUP5mdzX0uDhyhfiK7CaauvKvzhuY9o"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Router>
        <AuthProvider>
          <Routes>
            {/* General Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/news" element={<News />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Main />}>
              <Route path="holdings" element={<Holdings />} />
              <Route path="positions" element={<Positions />} />
              <Route path="orders" element={<Orders />} />
              <Route path="watchlist" element={<WatchList />} />
              <Route path="funds" element={<Funds />} />
            </Route>
            
            {/* Profile Route */}
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Authentication Route */}
            <Route path="/auth" element={<Authentication />} />

            {/* /home Route */}
            <Route path="/home" element={<HomeComponent />} />
            
            {/* /home/:url Route */}
            <Route path="/video" element={<VideoMeetComponent />} />
            
            {/* Landing Page Route */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/history" element={<History />} />
            
        
          </Routes>
        </AuthProvider>
      </Router>
    </Auth0Provider>
  </React.StrictMode>
);
