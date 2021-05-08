export const isRequired = (fieldName: string) => {
    return `${fieldName} is required`;
};

export const isNotMongoId = (fieldName: string) => {
    return `${fieldName} should be a Mongo ID`;
};

export const isNotUrl = () => {
    return "doesn't match a store url";
};

export const isNotArray = (fieldName: string) => {
    return `${fieldName} should be an array`;
};

export const nestedElementsRequired = (fieldName: string) => {
    return `All nested elements in ${fieldName} are required`;
};

export const minSizeRequired = (fieldName: string) => {
    return `minimum size of 1 is required in ${fieldName}`;
};
