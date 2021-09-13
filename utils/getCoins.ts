import axios from "axios";

const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&per_page=10&page=1";

const getCoins = async () => {
  const response = axios.get(url);

  if ((await response).status === 400) {
    throw new Error("Fetching Failed");
  }

  return (await response).data;
};

export default getCoins;
