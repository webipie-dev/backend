import { Subjects } from "./subjects";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated,
    data: {
        status: string,
        products: [{id: string, quantity: number}];
    }
}
