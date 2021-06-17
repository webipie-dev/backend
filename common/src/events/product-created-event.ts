import { Subjects } from "./subjects";

export interface ProductCreatedEvent {
    subject: Subjects.ProductCreated,
    data: {
        id: string,
        storeId: string,
        price: number,
        stock: number,
        image: string
    }
}
