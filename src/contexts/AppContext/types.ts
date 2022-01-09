export interface Context {
  state: {
    status: Status;
    products: Product[];
  };
  actions: {
    postProduct: (data: {
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
    }) => Promise<Product | null>;
    removeProduct: (id: string) => Promise<boolean>;
  };
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
