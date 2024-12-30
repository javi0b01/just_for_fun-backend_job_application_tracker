export interface IUser {
  recordId: string;
  firstName: string;
  lastName: string;
  nickname: string;
  image: string;
  phone: string;
  birthDay: Date;
}

export interface IUserList {
  id: string;
  nickname: string;
  image: string;
}

export interface IUserInfo {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  image: string;
  phone: string;
  profile: string;
  enable: boolean;
  birthDay: Date;
}
