import React, { createContext, FC, useEffect, useState } from "react";
import api from "./api";

import { Context, Product, Status } from "./types";

const AppContext = createContext({} as Context);

const AppProvider: FC = ({ children }) => {
  //

  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    api
      .getProducts()
      .then((res) => {
        if (res.success) {
          setProducts(res.payload);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      })
      .catch((x) => setStatus("error"));
    return () => {
      //   cleanup
    };
  }, []);

  const postProduct = async (data: {
    id?: string;
    name: string;
    ram: string;
    description: string;
    price: number;
    color: string;
    screen: string;
    manufacturer: string;
    imageFileName: string;
    processor: string;
  }): Promise<Product | null> =>
    api
      .postProduct(data)
      .then((res) => {
        //
        const { payload }: { payload: Product } = res;

        setProducts((prods) => {
          const clone = [...prods];
          const index = clone.findIndex((x) => x.id === payload.id);
          if (index > -1) {
            clone.splice(index, 1, { ...payload });
            return clone;
          } else {
            return [{ ...payload }, ...clone];
          }
        });

        return { ...payload };
      })
      .catch((_) => null);

  const removeProduct = async (id: string): Promise<boolean> =>
    api.removeProduct(id).then((res) => {
      if (res.success) {
        setProducts((prods) => {
          const clone = [...prods];
          const index = clone.findIndex((x) => x.id === id);
          if (index > -1) {
            clone.splice(index, 1);
            return clone;
          } else {
            return clone;
          }
        });

        return true;
      } else {
        return false;
      }
    });

  const state = {
    status,
    products,
  };
  const actions = {
    postProduct,
    removeProduct,
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext as default, AppProvider as AppProvider };
