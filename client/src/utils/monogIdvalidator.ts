export const isValidMongoObjectID = (id: string): boolean => {
  const objectIdRegExp = /^[0-9a-fA-F]{24}$/;
  return objectIdRegExp.test(id);
};
