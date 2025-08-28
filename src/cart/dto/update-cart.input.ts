import { AddToCartInput } from './create-cart.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCartInput extends AddToCartInput {}
