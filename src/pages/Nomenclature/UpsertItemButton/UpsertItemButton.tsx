import { Button, Flex, Form, Input, Modal, message } from "antd";
import "./UpsertItemButton.scss";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { PlusOutlined } from "@ant-design/icons";
import { ApiItemRequest, ApiItemResponse } from "../../../types/Nomenclature";
import { createItem, updateItem } from "../../../api/api";

interface UpsertItemButtonProps {
  refetchItems?: () => void;
  onChangeModal: (entity?: ApiItemResponse) => void;
  selectedItem: null | ApiItemResponse;
  isOpen: boolean;
}

const UpsertItemButton = ({
  refetchItems,
  onChangeModal,
  isOpen,
  selectedItem,
}: UpsertItemButtonProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<ApiItemRequest>({
    name: "",
    description: "",
    measurement_units: "",
    code: "",
  });

  const [form] = useForm();

  useEffect(() => {
    if (selectedItem) {
      setModalData({
        name: selectedItem.name,
        description: selectedItem.description,
        measurement_units: selectedItem.measurement_units,
        code: selectedItem.code,
      });

      form.setFieldsValue(selectedItem);
    }
  }, [selectedItem, form]);

  const changeModal = () => {
    onChangeModal();
    setModalData({
      name: "",
      description: "",
      measurement_units: "",
      code: "",
    });

    form.setFieldValue("name", "");
    form.setFieldValue("description", "");
    form.setFieldValue("measurement_units", "");
    form.setFieldValue("code", "");
  };

  const handleCreate = async () => {
    try {
      setIsLoading(true);

      await createItem(modalData);
      message.success("Элемент успешно создан!");
      changeModal();

      if (refetchItems) {
        refetchItems();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "Ошибка создания элемента"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem?.id) return;

    try {
      setIsLoading(true);

      await updateItem(selectedItem.id, modalData);
      message.success("Элемент успешно обновлён!");
      changeModal();

      if (refetchItems) {
        refetchItems();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "Ошибка обновления элемента"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    if (selectedItem?.id) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const onChangeModalData =
    (key: keyof ApiItemRequest) => (event: ChangeEvent<HTMLInputElement>) => {
      setModalData((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  return (
    <>
      <Button
        type="primary"
        onClick={() => onChangeModal()}
        icon={<PlusOutlined />}
      >
        Новая позиция
      </Button>

      <Modal
        title={selectedItem ? `${selectedItem.name}` : "Новая позиция"}
        open={isOpen}
        footer={null}
        onCancel={changeModal}
      >
        <Form
          form={form}
          name="item"
          initialValues={modalData || undefined}
          labelCol={{ span: 25 }}
          wrapperCol={{ span: 25 }}
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: "Введите название элемента!" }]}
          >
            <Input
              value={modalData.name}
              onChange={onChangeModalData("name")}
            />
          </Form.Item>

          <Form.Item
            label="Описание"
            name="description"
            rules={[{ required: true, message: "Введите описание!" }]}
          >
            <Input
              value={modalData.description}
              onChange={onChangeModalData("description")}
            />
          </Form.Item>

          <Form.Item
            label="Единица измерения"
            name="measurement_units"
            rules={[{ required: true, message: "Введите единицу измерения!" }]}
          >
            <Input
              value={modalData.measurement_units}
              onChange={onChangeModalData("measurement_units")}
            />
          </Form.Item>

          <Form.Item
            label="Артикул/код"
            name="code"
            rules={[
              { required: true, message: "Введите артикул/код элемента!" },
            ]}
          >
            <Input
              value={modalData.code}
              onChange={onChangeModalData("code")}
            />
          </Form.Item>

          <Flex justify="flex-end" gap="middle" style={{ marginTop: "24px" }}>
            <Button onClick={changeModal} loading={isLoading}>
              Отмена
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {selectedItem ? "Обновить" : "Создать"}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

export default UpsertItemButton;
