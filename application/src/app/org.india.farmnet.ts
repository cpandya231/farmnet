import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.india.farmnet{
   export class Commodity extends Asset {
      commodityId: string;
      quantity: number;
      price: number;
      priceUnit: string;
      issueDate: Date;
      item: Item;
      issuer: Trader;
      owner: Trader;
   }
   export class Item extends Asset {
      itemId: string;
      name: string;
      category: string;
      expiryDate: Date;
      location: string;
   }
   export class Trader extends Participant {
      traderId: string;
      name: string;
   }
   export class Trade extends Transaction {
      commodity: Commodity;
      newOwner: Trader;
   }
// }
