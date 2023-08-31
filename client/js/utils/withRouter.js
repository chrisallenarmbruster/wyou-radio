//Utility to pass router props to a class component
//React Router 6 does not include the withRouter method any more
//This is a custom implementation of the withRouter method
//Necessary because you cannot use hooks in class components
//Usage: export default withRouter(MyComponent)

import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const withRouter = (Component) => {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
};
