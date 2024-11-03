export interface IUser {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  password: string;
  image: string;
  phone: string;
  profile: number;
  enable: boolean;
  birthDay: Date;
}

export interface IUserList {
  id: string;
  nickname: string;
  image: string;
}

export interface IUserInfo {
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
