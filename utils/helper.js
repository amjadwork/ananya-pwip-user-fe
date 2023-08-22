export function inrToUsd(inrAmount, exchangeRate) {
  return (inrAmount / exchangeRate).toFixed(2);
}
