export const createExpirationDateForLink = (expTimeHours: number) => {
  const date = new Date();
  date.setHours(date.getHours() + expTimeHours);
  return date;
};
