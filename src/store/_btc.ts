import { observable, action } from "mobx";
import { AsyncStorage } from "react-native";
import { apiGetBtcAddress } from "../services/api";
import { TICKER } from "../services/enums";

export interface BtcAccountInterface {
  name: string;
  type: TICKER.BTC;
  address: string;
  balance: number;
  sent: number;
  received: number;
  txs: Object[];
}

export interface BtcStoreInterface {
  accounts: BtcAccountInterface[];
  fetching: boolean;
  addresses: string[];
  addAccount: (account: BtcAccountInterface) => void;
  addAddress: (address: string) => void;
  hydrateAccounts: (accounts: BtcAccountInterface[]) => void;
  hydrateAddresses: (addresses: string[]) => void;
  getBtcStoreFromMemory: () => void;
  addBtcAccount: (name: string, address: string) => void;
}

class BtcStore implements BtcStoreInterface {
  // --- store --- //
  @observable accounts = [];
  @observable fetching = false;
  addresses = [];

  // --- actions --- //
  @action addAccount = account => this.accounts.push(account);
  @action addAddress = address => this.addresses.push(address);
  @action hydrateAccounts = accounts => (this.accounts = accounts);
  @action hydrateAddresses = addresses => (this.addresses = addresses);
  @action setFetching = state => (this.fetching = state);

  // --- methods --- //
  public getBtcStoreFromMemory = async () => {
    this.setFetching(true);
    const data = await AsyncStorage.getItem("@blok:BtcStore");
    const json = JSON.parse(data) || null;
    if (json.addresses && json.accounts) {
      this.hydrateAccounts(json.accounts);
      this.hydrateAddresses(json.addresses);
    }
    this.setFetching(false);
  };

  public addBtcAccount = async (name, address) => {
    try {
      if (this.addresses.includes(address)) {
        console.error("BTC Address already exists");
      } else {
        this.setFetching(true);
        const { data } = await apiGetBtcAddress(address);
        this.addAccount({
          name,
          type: TICKER.BTC,
          address: data.address,
          balance: data.final_balance / 100000000,
          sent: data.total_sent / 100000000,
          received: data.total_received / 100000000,
          txs: data.txs
        });
        this.addAddress(data.address);
        await AsyncStorage.setItem(
          "@blok:BtcStore",
          JSON.stringify({
            accounts: this.accounts,
            address: this.addresses
          })
        );
        this.setFetching(false);
      }
    } catch (e) {
      this.setFetching(false);
      console.error(e);
    }
  };
}

export default BtcStore;