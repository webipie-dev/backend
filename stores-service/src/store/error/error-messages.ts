export const isRequired = (fieldName: string) => {
  return fieldName + ' is required';
};

export const isNotMongoId = (fieldName: string) => {
  return fieldName + ' should be a Mongo ID';
};

export const isNotUrl = () => {
  return "doesn't match a store url";
};
