export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("id-ID").format(value);
};

export const convertToIdr = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    // maximumFractionDigits: 0,
  }).format(value);
};

export const stylePercentage = (value: number): boolean => {
  if (value > 0) {
    return true;
  }

  return false;
};
