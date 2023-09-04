import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { ProductsEntity } from '../../entities/products.entity';

export class CheckProductInDbCommand {
  constructor(public productId: string[]) {}
}

@CommandHandler(CheckProductInDbCommand)
export class CheckProductInDbUseCase
  implements ICommandHandler<CheckProductInDbCommand>
{
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute(
    command: CheckProductInDbCommand,
  ): Promise<ProductsEntity[] | boolean> {
    const products: ProductsEntity[] = [];
    for (const id of command.productId) {
      const product = await this.paymentsRepository.getProductById(id);
      if (!product) return false;
      products.push(product);
    }

    return products;
  }
}
