import { UseGuards } from '@nestjs/common';
import { BasicAuthGuardForGraphql } from '../../guards/basic.auth.guard.for.graphql';
import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetCountPaymentsCommand } from '../../application/use-cases/get.count.payments.use.case';
import { PaymentModel } from '../models/payments.model';
import { PaginationDto } from '../dto/pagination.dto';
import { GetAllPaymentsCommand } from '../../application/use-cases/get.allPayments.use.case';
import { CommandBus } from '@nestjs/cqrs';
import { UserModel } from '../models/user.model';
import { UsersRepositoryGraphql } from '../../infrastructure/users.repository.graphql';

@UseGuards(BasicAuthGuardForGraphql)
@Resolver(() => PaymentModel)
export class PaymentsResolver {
  constructor(
    private commandBus: CommandBus,
    private usersRepository: UsersRepositoryGraphql,
  ) {}

  @Query(() => Int, { name: 'totalCountPayments' })
  async getTotalCountPayments(@Args() args: PaginationDto): Promise<number> {
    return this.commandBus.execute(new GetCountPaymentsCommand(args));
  }

  @Query(() => [PaymentModel], { name: 'allPayments' })
  async getAllPayments(@Args() args: PaginationDto): Promise<number> {
    return this.commandBus.execute(new GetAllPaymentsCommand(args));
  }

  @ResolveField(() => UserModel, { nullable: true })
  async user(@Parent() payment: PaymentModel) {
    return this.usersRepository.getUser(payment.userId);
  }
}
