import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import {
  GetAllOrdersByClientInput,
  GetOrderInput,
} from './dto/get-order.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { OrderItem } from 'src/order-item/entities/orderItem.entity';
import { OrderItemService } from 'src/order-item/order-item.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
  ) {}

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Order)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @Context() ctx: any,
  ) {
    return this.orderService.create(createOrderInput, ctx.req.user.id);
  }

  @Roles('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Order], { name: 'getAllOrders' })
  getAllOrders() {
    return this.orderService.findAll();
  }

  @Roles('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Order], { name: 'getAllOrdersByClient' })
  getAllOrdersByClient(
    @Args('getAllOrdersByClient')
    getAllOrdersByClientInput: GetAllOrdersByClientInput,
  ) {
    return this.orderService.findAll({
      userId: getAllOrdersByClientInput.userId,
    });
  }

  @Roles('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Order], { name: 'getMyOrders' })
  getClientOrders(@Context() ctx: any) {
    return this.orderService.findAll({
      userId: ctx.req.user.id,
    });
  }

  @Roles('manager', 'client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => Order, { name: 'getOrder' })
  findOne(@Args('getOrderInput') getOrderInput: GetOrderInput) {
    return this.orderService.findOne(getOrderInput);
  }

  @Mutation(() => Order)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.orderService.update(updateOrderInput);
  }

  @ResolveField(() => [OrderItem])
  async orderItems(@Parent() order: Order) {
    return await this.orderItemService.findOrderItemsByOrderId(order.id);
  }
}
