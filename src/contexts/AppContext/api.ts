export const environmentUrl = "http://192.168.100.9:5000";

export default {
  getProducts: () =>
    fetch(`${environmentUrl}/api/phones`)
      .then((res) => res.json())
      .then((res) => res),
};
