export interface IUser {
  id: string;
  name: string;
  email: string;
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
  hour: string;
  remark: string;
  email: string;
  userName: string;
}