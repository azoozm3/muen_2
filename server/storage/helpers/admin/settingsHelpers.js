export function applyServicePricingRow(target, source = {}) {
  target.label = source.label?.trim?.() || target.label;
  target.price = Number(source.price ?? target.price);
  target.platformFee = Number(source.platformFee ?? target.platformFee);
  target.currency = source.currency?.trim?.() || target.currency;
  target.active = source.active ?? target.active;
}

export function applyPaymentProvider(target, source = {}) {
  target.provider = source.provider?.trim?.() || target.provider;
  target.mode = source.mode?.trim?.() || target.mode;
  target.paypalClientIdPublic = source.paypalClientIdPublic?.trim?.() || target.paypalClientIdPublic;
}
