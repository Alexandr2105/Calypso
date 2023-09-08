import { ApiProperty } from '@nestjs/swagger';

export class ProductsEntity {
  @ApiProperty({ type: 'string', description: "Subscription's id" })
  idProduct: string;
  @ApiProperty({ type: 'string', description: "Subscription's type" })
  nameSubscription: string;
  @ApiProperty({ type: 'number', description: "Subscription's price in cent" })
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
