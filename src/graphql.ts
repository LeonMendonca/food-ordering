
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    MEMBER = "MEMBER"
}

export enum Country {
    INDIA = "INDIA",
    AMERICA = "AMERICA"
}

export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PREPARING = "PREPARING",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export class CreateOrderInput {
    customerId: string;
    items: CreateOrderItemInput[];
    totalPrice: number;
    deliveryAddress: string;
    country: Country;
}

export class CreateOrderItemInput {
    dishId: string;
    quantity: number;
    price: number;
}

export class AddPaymentMethodInput {
    type: string;
    provider: string;
    cardNumber?: Nullable<string>;
    expiryMonth?: Nullable<number>;
    expiryYear?: Nullable<number>;
}

export abstract class IQuery {
    abstract restaurants(): Restaurant[] | Promise<Restaurant[]>;

    abstract restaurant(id: string): Nullable<Restaurant> | Promise<Nullable<Restaurant>>;

    abstract menus(): Menu[] | Promise<Menu[]>;

    abstract dishes(): Dish[] | Promise<Dish[]>;

    abstract orders(): Order[] | Promise<Order[]>;

    abstract order(id: string): Nullable<Order> | Promise<Nullable<Order>>;

    abstract me(): User | Promise<User>;

    abstract paymentMethods(): PaymentMethod[] | Promise<PaymentMethod[]>;

    abstract users(country?: Nullable<Country>, role?: Nullable<Role>): User[] | Promise<User[]>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract distinctCountries(): Country[] | Promise<Country[]>;

    abstract distinctRoles(): Role[] | Promise<Role[]>;

    abstract payments(): Payment[] | Promise<Payment[]>;
}

export abstract class IMutation {
    abstract createOrder(input: CreateOrderInput): Order | Promise<Order>;

    abstract updateOrderStatus(orderId: string, status: OrderStatus): Order | Promise<Order>;

    abstract cancelOrder(orderId: string): Order | Promise<Order>;

    abstract checkout(orderId: string, paymentMethodId: string): Payment | Promise<Payment>;

    abstract addPaymentMethod(userId: string, input: AddPaymentMethodInput): PaymentMethod | Promise<PaymentMethod>;

    abstract updatePaymentMethod(id: string, input: AddPaymentMethodInput): PaymentMethod | Promise<PaymentMethod>;
}

export class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    country: Country;
    orders: Order[];
    paymentMethods: PaymentMethod[];
}

export class Restaurant {
    id: string;
    name: string;
    address: string;
    rating?: Nullable<number>;
    country: Country;
    menus: Menu[];
    imageUrl?: Nullable<string>;
}

export class Menu {
    id: string;
    name: string;
    dishes: Dish[];
}

export class Dish {
    id: string;
    name: string;
    price: number;
    description?: Nullable<string>;
    menu: Menu;
    imageUrl?: Nullable<string>;
    isAvailable: boolean;
}

export class Order {
    id: string;
    customer: User;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    deliveryAddress: string;
    country: Country;
    payment?: Nullable<Payment>;
    createdAt: string;
    updatedAt: string;
}

export class OrderItem {
    id: string;
    dish: Dish;
    quantity: number;
    price: number;
}

export class Payment {
    id: string;
    order: Order;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    createdAt: string;
}

export class PaymentMethod {
    id: string;
    type: string;
    provider: string;
    last4?: Nullable<string>;
    expiryMonth?: Nullable<number>;
    expiryYear?: Nullable<number>;
    user: User;
}

type Nullable<T> = T | null;
