import React from "react";
import AppRoutes from "./routes/Routes";
import { Provider } from "react-redux";
import store from "./redux/store"; // Redux Store

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
