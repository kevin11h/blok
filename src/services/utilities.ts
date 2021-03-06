import { Dimensions, Platform, Alert } from "react-native";
import { TICKER, EXCHANGE } from "./enums";

/**
 * Returns true if iPhone X is detected
 */
export const isIphoneX = (): boolean => {
  const dimension = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !(Platform as any).isPad &&
    !(Platform as any).isTVOS &&
    (dimension.height === 812 || dimension.width === 812)
  );
};

/**
 * Converts TICKER enum into related string
 * @param ticker
 */
export const tickerToString = (ticker: TICKER): string => {
  switch (ticker) {
    case TICKER.BTC:
      return "BTC";
    case TICKER.ETH:
      return "ETH";
    case TICKER.LTC:
      return "LTC";
    case TICKER.XRP:
      return "XRP";
    case TICKER.DASH:
      return "DASH";
    case TICKER.STEEM:
      return "STEEM";
    default:
      return "BTC";
  }
};

/**
 * Format balance into X.XXXXXXXX format
 * @param balance
 */
export const formatBalance = (balance: number): string => balance.toFixed(8);

/**
 * Format money into X.XX format
 * @param money
 */
export const formatMoney = (money: number): string => money.toFixed(2);

/**
 * Show error alert
 * @param message
 */
export const alertError = (message: string) => Alert.alert("Error", message);

/**
 * Return correct exchange value
 * @param data
 * @param exchange
 */
export const getPrice = (data: any, exchange: EXCHANGE, ticker: TICKER) => {
  const filter = (element: any) => element.symbol === ticker;
  if (data.find(filter)) return data.find(filter)[`price_${exchange.toLocaleLowerCase()}`];
  return 0;
};
