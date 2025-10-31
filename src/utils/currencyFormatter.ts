export const formatCurrency = (
  amount: number,
  currency: "NGN" | "USD",
  inMinorUnits = false
): string => {
  if (inMinorUnits) {
    amount = amount / 100;
  }
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
  }).format(amount);
};
