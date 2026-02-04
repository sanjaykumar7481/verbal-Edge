import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "Authenticator/Usercontext";
import { getToken } from "../../services/auth";

const Authmiddleware = (props) => {
  const { user, loading } = useUser();
  const token = getToken();

  if (loading) {
    return null;
  }

  if (!token && !user) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return (<React.Fragment>
   {props.children}
  </React.Fragment>);
};

export default Authmiddleware;
