export interface Login {
  email: string;
  password: string;
}
export interface Token {
  name: string;
  roleId: number;
  userId: number;
  access_token: string;
  // expires: number,
  // token_type: string,
  // user: string,
  email: string;
  data: any;
  headers: any;
}
export interface Socketoperator {
  Id: string;
  key: string;
}
