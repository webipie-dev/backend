import { Subjects } from "./subjects";

export interface UserCreatedEvent {
    subject: Subjects.UserCreated,
    data: {
        userId: string,
        storeName: string,
        storeType: string,
        TemplateID: string,
    }
}
