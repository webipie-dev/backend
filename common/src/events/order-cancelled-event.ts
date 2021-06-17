import { Subjects } from "./subjects";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled,
    data: {
        status: string,
        products: [{id: string, quantity: number}];
    }
}
