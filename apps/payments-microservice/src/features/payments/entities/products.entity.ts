export class ProductsEntity {
  idProduct: string;
  nameSubscription: string;
  price: number;
  subscriptionTimeHours: number;
  quantity?: number;

  constructor(
    idProduct: string,
    nameSubscription: string,
    price: number,
    subscriptionTimeHours: number,
    quantity: number,
  ) {
    this.idProduct = idProduct;
    this.nameSubscription = nameSubscription;
    this.price = price;
    this.subscriptionTimeHours = subscriptionTimeHours;
    this.quantity = quantity;
  }
}
