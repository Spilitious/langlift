export type ShopRequest = {
  shopId: number;
  pjId: number;
  equipmentId: number;
  action: "buy" | "sell";
};


export type BuyResult =
  | {
      result: true;
    }
  | {
      result: false;
      reason:
        | "not_enough_gold"
        | "pj_not_found"
        | "no_space";
    };