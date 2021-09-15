import axios from "axios";

const getCoins = async (page = 1) => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&per_page=10&page=${page}`;
  const response = await axios.get(url);

  if (response.status === 400) {
    throw new Error("Fetching Failed");
  }

  return response.data;
};

export default getCoins;
