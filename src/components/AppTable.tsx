import React from "react";
import { Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TableProps, ColumnsType } from "antd/es/table";

// Define the props for the AppTable component
interface Props<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
}

const AppTable = <T extends { key: React.Key }>({
  columns,
  data,
  loading,
  ...restProps
}: Props<T>) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <Spin spinning={loading} indicator={antIcon}>
      <Table<T> columns={columns} dataSource={data} {...restProps} />
    </Spin>
  );
};

export default AppTable;
