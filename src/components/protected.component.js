import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from "react-redux";

const ProtectedRoute = ({ component: Component, path, ...restOfProps }) => {
  return (
    <Route
      exact
      path={path}
      render={(props) => {
        if (!restOfProps.isLoggedIn) return <Redirect to={'/login'} />;
        return (
        <Component {...props} />
      );
    }}
    />
  );
};

function mapStateToProps(state) {
  const { isLoggedIn, user } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
    user
  };
}

export default connect(mapStateToProps)(ProtectedRoute);
