export interface IUser {
  id: string;
  name: string;
  email: string;
  hour: number;
  remarks: IRemark[]
}

export interface IRemark{
  value: string;
  updateAt: Date;
  description: string
}

export interface IUserData {
  hour: number;
  remark: string;
  email: string;
}