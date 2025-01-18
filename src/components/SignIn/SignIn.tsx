import "./SignIn.scss";
import { Button, Flex, Form, Input, Typography, message } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import api from "../../utils/axiosMiddleware";
import { setTokens } from "./SignIn.slice";

const SigninForm = (): JSX.Element => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const localTokens = window.localStorage.getItem("tokens");
      const parsedTokens = localTokens ? JSON.parse(localTokens) : null;

      if (parsedTokens) {
        dispatch(setTokens(parsedTokens));
      }
      console.log("token:", parsedTokens);
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const onFinish = async () => {
    setIsLoading(true);
    try {
      const data = {
        login: formData.login,
        password: formData.password,
      };

      const res = await api.post(`/api/auth/login`, data);
      dispatch(setTokens(res.data));
      window.localStorage.setItem("tokens", JSON.stringify(res.data));

      message.success("Авторизация прошла успешно");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      message.error(error?.response?.data?.message || "Ошибка");

      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const onChange =
    (key: keyof typeof formData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        return {
          ...prev,
          [key]: event.target.value,
        };
      });
    };

  const logout = () => {
    dispatch(
      setTokens({
        access_token: "",
      })
    );
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="form">
      <Flex vertical style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Typography.Title level={3} style={{ marginBottom: "4px" }}>
          Добро пожаловать!
        </Typography.Title>
        <Typography.Text
          type="secondary"
          style={{ display: "block", marginBottom: "32px" }}
        >
          Войдите в свою учетную запись, чтобы продолжить
        </Typography.Text>
        <Form.Item
          label="Учетная запись"
          name="login"
          rules={[{ required: true, message: "" }]}
          style={{ width: "100%" }}
        >
          <Input
            placeholder="Логин"
            value={formData.login}
            onChange={onChange("login")}
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "" }]}
          style={{ width: "100%" }}
        >
          <Input.Password
            value={formData.password}
            onChange={onChange("password")}
          />
        </Form.Item>

        <Form.Item
          style={{
            justifyContent: "flex-end",
            width: "100%",
            marginBottom: "24px",
            textAlign: "right",
          }}
        >
          <Button
            type="link"
            style={{
              width: "auto",
            }}
          >
            Забыли пароль?
          </Button>
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={isLoading}>
          {isLoading ? "Загрузка..." : "Войти"}
        </Button>
      </Flex>
    </Form>
  );
};

export default SigninForm;
