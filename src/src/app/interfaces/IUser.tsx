export interface IUser {
  id: string;
  name: string;
  email: string;
  emailAlternative: string;
  hour: number;
  remarks: IRemark[]
}

export interface IRemark {
  value: string;
  updateAt: Date;
  description: string,
  userName: string;
}

export interface IUserData {
  id: string;
  name: string;
  hour: string;
  remark: string;
  email: string;
  emailAlternative: string;
}