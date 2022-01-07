export interface Context {
  state: {
    status: Status;
    products: Product[];
  };
  actions: {};
}

export type Status = "ready" | "loading" | "error";
export interface Product {
  id: string;
  name: string;
  ram: string;
  description: string;
  price: number;
  color: string;
  screen: string;
  manufacturer: string;
  imageFileName: string;
  processor: string;
}
