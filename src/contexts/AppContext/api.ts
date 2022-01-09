export const environmentUrl = "http://rnchallenge.herokuapp.com";

export default {
  getProducts: () =>
    fetch(`${environmentUrl}/api/phones`)
      .then((res) => res.json())
      .then((res) => res),

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
  }) =>
    fetch(`${environmentUrl}/api/phones`, {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res),

  removeProduct: (id: string) =>
    fetch(`${environmentUrl}/api/phones/${id}`, {
      method: "delete",
    })
      .then((res) => res.json())
      .then((res) => res),
};
