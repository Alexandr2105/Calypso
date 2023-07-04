export const createExpirationDateForLink = (expTimeHours: number) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + expTimeHours);
  return date;
};
