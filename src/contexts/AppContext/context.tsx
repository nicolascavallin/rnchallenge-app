import React, { createContext, FC, useEffect, useState } from "react";
import api from "./api";

import { Context, Product, Status } from "./types";

const AppContext = createContext({} as Context);

const AppProvider: FC = ({ children }) => {
  //

  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    console.log("holi");
    api
      .getProducts()
      .then((res) => {
        if (res.success) {
          setStatus("ready");
          setProducts(res.payload);
        } else {
          setStatus("error");
        }
      })
      .catch((x) => setStatus("error"));
    return () => {
      //   cleanup
      setStatus("loading");
    };
  }, []);

  const state = {
    status,
    products,
  };
  const actions = {};

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext as default, AppProvider as AppProvider };
