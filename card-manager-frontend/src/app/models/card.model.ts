export interface Card {
  id?: number;
  cardNumber: string;
  holderName: string;
  expirationMonth: string;
  expirationYear: string;
  brand: string;
  userId?: number;
}
