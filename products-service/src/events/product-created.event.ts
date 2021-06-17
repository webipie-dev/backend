import { Subjects } from "./subjects.enum";

export interface ProductCreatedEvent {
    subject: Subjects,
    data : {
        id: string,
        price: Number,
        stock: Number,
        image: string,
        storeId: string
    }
}