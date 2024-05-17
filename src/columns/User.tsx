import { ColumnsType } from "antd/es/table";

export interface User {
  key: number;
  name: string;
  age: number;
  address: string;
}

export const userColumns: ColumnsType<User> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];
