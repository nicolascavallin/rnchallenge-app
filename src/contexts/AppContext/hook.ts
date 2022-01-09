import { useContext } from "react";
import AppContext from "./context";

export const useApp = () => {
  const {
    state: { status, products },
    actions: { postProduct, removeProduct },
  } = useContext(AppContext);

  return { status, products, postProduct, removeProduct };
};
