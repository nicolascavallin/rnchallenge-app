import { useContext } from "react";
import AppContext from "./context";

export const useApp = () => {
  const {
    state: { status, products },
  } = useContext(AppContext);

  return { status, products };
};
