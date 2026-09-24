export interface LoginRequest{
  username:string;
  password:string;
}
export interface LoginResponse{
  id:number;
  token:string;
  username:string;
  role:string;
}
