import { Subjects } from "./subjects";

export interface ProductUpdatedEvent {
    subject: Subjects.ProductUpdated,
    data: {
        id: string,
        storeId: string,
        price: number,
        stock: number,
        image: string
    }
}
