import { Injectable } from '@nestjs/common';

@Injectable()
export class FormatDate {
  dateForm_xx_xx_xxxx(date: Date) {
    const originalDate = new Date(date);

    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1;
    const year = originalDate.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}.${formattedMonth}.${year}`;
  }
}
