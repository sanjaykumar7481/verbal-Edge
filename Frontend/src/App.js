// App.js
import PropTypes from 'prop-types';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { useUser } from './Authenticator/Usercontext'; // Import UserContext
// import dotenv from 'dotenv';
// dotenv.config()


// Import Routes all
import { userRoutes, authRoutes } from './routes/allRoutes';

// Import all middleware
import Authmiddleware from './routes/middleware/Authmiddleware';

// layouts Format
import VerticalLayout from './components/VerticalLayout/';
import HorizontalLayout from './components/HorizontalLayout/';
import NonAuthLayout from './components/NonAuthLayout';
// Import scss
// import dotenv from 'dotenv'
import './assets/scss/theme.scss';
// dotenv.config();
const App = (props) => {
  const { user, loading } = useUser(); // Access user state from UserContext
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="text-muted">Loading...</div>
      </div>
    );
  }
  function getLayout() {
    let layoutCls = VerticalLayout;
    switch (props.layout.layoutType) {
      case 'horizontal':
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout();

  return (
    <Routes>
      {/* Non-authenticated routes */}
      {authRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            route.path === "/logout" ? (
              route.component
            ) : user ? (
              <Navigate to="/dashboard" />
            ) : (
              <NonAuthLayout>{route.component}</NonAuthLayout>
            )
          }
        />
      ))}

      {/* Authenticated routes */}
      {userRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            
              <Authmiddleware>
                <Layout>{route.component}</Layout>
              </Authmiddleware>

          }
        />
      ))}

      {/* Redirect to dashboard if user is authenticated */}
      {/* <Route path="/" element={ user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} /> */}
    </Routes>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => ({
  layout: state.Layout,
});

export default connect(mapStateToProps, null)(App);
