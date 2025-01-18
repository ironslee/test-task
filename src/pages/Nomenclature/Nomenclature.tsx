import "./Nomenclature.scss";
import {
  Button,
  Flex,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tooltip,
  Typography,
} from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { TableProps } from "antd/lib";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useDebounce } from "../../hooks/useDebounce";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { UpsertItemButton } from "./UpsertItemButton";
import { ApiItemPageResponse, ApiItemResponse } from "../../types/Nomenclature";
import { nomenclatureSlice } from "./NomenclatureSlice";
import { fetchItems } from "../../api/api";

const Nomenclature = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<null | ApiItemResponse>(
    null
  );
  const [searchField, setSearchField] = useState("");

  const [data, setData] = useState<ApiItemPageResponse | null>(null);
  const debouncedSearchField = useDebounce(searchField, 500);
  const tableConfig = useAppSelector(
    (state) => state.nomenclatureStore.tableConfig
  );
  const dispatch = useAppDispatch();

  const loadData = useCallback(async () => {
    try {
      const response = await fetchItems({
        page: tableConfig.page,
        pageSize: tableConfig.limit,
        sortBy: tableConfig.sortKey,
        sortOrder:
          tableConfig.sortOrder === "ascend"
            ? "ASC"
            : tableConfig.sortOrder === "descend"
            ? "DESC"
            : null,
        itemName: debouncedSearchField,
        code: debouncedSearchField,
      });
      setData(response);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  }, [tableConfig, debouncedSearchField]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns: TableProps<ApiItemResponse>["columns"] = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      className: "column-name",
      render: (name) => name,
      sortOrder:
        tableConfig.sortKey === "name"
          ? tableConfig.sortOrder
            ? tableConfig.sortOrder === "descend"
              ? "descend"
              : "ascend"
            : null
          : null,
      sorter: true,
    },
    {
      title: "Единица измерения",
      dataIndex: "measurement_units",
      key: "measurement_units",
      className: "column-units",
      render: (measurement_units) => measurement_units,
      sortOrder:
        tableConfig.sortKey === "measurement_units"
          ? tableConfig.sortOrder
            ? tableConfig.sortOrder === "descend"
              ? "descend"
              : "ascend"
            : null
          : null,
      sorter: true,
    },
    {
      title: "Артикул/код",
      dataIndex: "code",
      key: "code",
      className: "column-code",
      render: (code) => code,
      sortOrder:
        tableConfig.sortKey === "code"
          ? tableConfig.sortOrder
            ? tableConfig.sortOrder === "descend"
              ? "descend"
              : "ascend"
            : null
          : null,
      sorter: true,
    },
    {
      title: "",
      key: "actions",
      className: "column-actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={"Редактировать"}>
            <Button
              type="link"
              onClick={() => onChangeModal(record)}
              icon={<EditOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onChangeSearchField = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchField(event.target.value);
  };

  const handleChangeTable = (
    pagination: TablePaginationConfig,
    _: Record<string, FilterValue | null>,
    sorter: SorterResult<ApiItemResponse> | SorterResult<ApiItemResponse>[]
  ) => {
    if (!Array.isArray(sorter)) {
      dispatch(
        nomenclatureSlice.actions.setTableConfig({
          ...tableConfig,
          page: pagination.current || 1,
          sortKey: String(sorter.columnKey) || "",
          sortOrder: sorter.order
            ? sorter.order === "descend"
              ? "descend"
              : "ascend"
            : "",
          limit: pagination.pageSize || 10,
        })
      );
    }
  };

  const onChangeModal = (item?: ApiItemResponse) => {
    if (item) {
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Flex className="nomenclature-header">
        <Typography.Title>
          Номенклатура <span>{`${data?.total ? data?.total : 0} единиц`}</span>
        </Typography.Title>
        <Flex className="search-and-actions">
          <Input
            placeholder="Поиск"
            addonAfter="Поиск"
            value={searchField}
            onChange={onChangeSearchField}
            allowClear={{
              clearIcon: (
                <CloseOutlined
                  style={{
                    color: "#a85757",
                    fontSize: "15px",
                    width: "100%",
                  }}
                />
              ),
            }}
          />
          <Flex className="button-wrap" style={{ width: "100%" }}>
            <UpsertItemButton
              onChangeModal={onChangeModal}
              isOpen={isOpen}
              selectedItem={selectedItem}
              refetchItems={loadData}
            />
          </Flex>
        </Flex>
      </Flex>

      <Table
        rowKey={"id"}
        columns={columns}
        dataSource={data?.result || []}
        onChange={handleChangeTable}
        rowClassName={() => "nomenclature-row"}
        pagination={false}
      />
      <Flex
        justify="space-between"
        align="center"
        style={{
          padding: "16px 0",
        }}
        className="pagination-container"
      >
        <Pagination
          total={data?.total || 0}
          pageSize={tableConfig.limit}
          showSizeChanger={false}
        />
        <Flex align="center" gap="small">
          <span
            style={{ fontSize: "14px", lineHeight: "20px", fontWeight: "475" }}
          >
            Показывать по:
          </span>
          <Select
            value={tableConfig.limit}
            style={{ height: 40 }}
            onChange={(value) => {
              dispatch(
                nomenclatureSlice.actions.setTableConfig({
                  ...tableConfig,
                  page: 1,
                  limit: value,
                })
              );
            }}
            options={[
              { label: "10", value: 10 },
              { label: "20", value: 20 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default Nomenclature;
