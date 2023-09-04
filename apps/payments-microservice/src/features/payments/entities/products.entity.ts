export class ProductsEntity {
  idProduct: string;
  nameSubscription: string;
  price: number;

  constructor(idProduct: string, nameSubscription: string, price: number) {
    this.idProduct = idProduct;
    this.nameSubscription = nameSubscription;
    this.price = price;
  }
}
