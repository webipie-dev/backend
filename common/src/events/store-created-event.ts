import { Subjects } from "./subjects";

export interface StoreCreatedEvent {
    subject: Subjects.StoreCreated,
    data: {
        userId: string,
        storeId: string
    }
}
