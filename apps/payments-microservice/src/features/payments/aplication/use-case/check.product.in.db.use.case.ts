import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { ProductsEntity } from '../../entities/products.entity';
import { PaymentsDto } from '../../dto/payments.dto';
import { BadRequestException } from '@nestjs/common';

export class CheckProductInDbCommand {
  constructor(public body: PaymentsDto[]) {}
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
    for (const product of command.body) {
      const productInfo = await this.paymentsRepository.getProductById(
        product.productId,
      );
      if (!productInfo)
        throw new BadRequestException({
          field: 'product',
          message: 'Products not found',
        });
      productInfo.quantity = product.quantity;
      products.push(productInfo);
    }

    return products;
  }
}
