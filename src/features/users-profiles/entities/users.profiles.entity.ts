export class UsersProfilesEntity {
  userId: string;
  login: string;
  firstName?: string;
  lastName?: string;
  dateOfBirthday?: string;
  city?: string;
  userInfo?: string;
  photo?: string;

  constructor(
    userId: string,
    login: string,
    firstName: string,
    lastName: string,
    dateOfBirthday: string,
    city: string,
    userInfo: string,
    photo: string,
  ) {
    (this.userId = userId),
      (this.login = login),
      (this.firstName = firstName),
      (this.lastName = lastName),
      (this.dateOfBirthday = dateOfBirthday),
      (this.city = city),
      (this.userInfo = userInfo),
      (this.photo = photo);
  }
}
