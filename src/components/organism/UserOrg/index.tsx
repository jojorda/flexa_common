import React, { useEffect, useCallback, useState, useMemo } from "react";
// @ts-ignore
import { callApi, TableAntd, CustomSelect } from "@intellinum/flexa-util";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  Space,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Card,
  message,
  Popconfirm,
} from "antd";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Config } from "../../../config/config";
import { AiOutlineQuestionCircle } from "react-icons/ai";
const { Option } = Select;

export default function UserOrg() {
  const [userId, setId] = useState(0);
  const [mode, setMode] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/common/users/search"
  );
  const [apiUrl, setapiUrl] = useState(Config.prefixUrl + "/common/users");
  const [apiUrlUserRole, setApiUrlUserRole] = useState(
    Config.prefixUrl + "/common/userrole"
  );
  const [apiUrlGetUR, setApiUrlGetUR] = useState(
    `${Config.prefixUrl}/common/userrole/findByUser?user=`
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("flexa_auth"))
  );
  const [apiUrlRole, setApiUrlRole] = useState(
    Config.prefixUrl + "/common/role"
  );

  const showModalNew = () => {
    setMode("new");
    formik.resetForm();
    setIsLoading(false);
    setOpen(true);
  };

  const getRole = () => {
    const response = callApi(`${apiUrlRole}`, "GET", null);
    response
      .then((res) => {
        setRolesData(res.data.content);
      })
      .catch((err) => {
        alert(err);
        console.log(err.message);
      });
  };

  const handleCheckboxChange = (checkedRoles) => {
    setSelectedRoles(checkedRoles);
  };

  const postUserRole = () => {
    const payload = selectedRoles.map((roleId) => ({
      user: { id: userId },
      role: { id: roleId },
      company: -1,
    }));
    const response = callApi(apiUrlUserRole, "POST", payload);
    response
      .then((res) => {
        message.success("Add Role Success");
        setModalURole(false);
        setFetch(true);
      })
      .catch((err) => {
        console.log(err.message);
        message.error("can't post");
        window.location.reload();
      });
  };

  const [open, setOpen] = useState(false);
  const [modalURole, setModalURole] = useState(false);
  const showModalUR = () => {
    setModalURole(true);
  };
  const handleOpenUR = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setModalURole(false);
    }, 3000);
  };

  const handleCancelUR = () => {
    setModalURole(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Username is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    company: Yup.string().required("Company is required"),
  });
  const handleSubmit = useCallback(
    async (values, setSubmitting) => {
      const {
        userName,
        password,
        email,
        language,
        userType,
        timezone,
        company,
      } = values;
      const payload = {
        userName,
        password,
        email,
        language,
        userType,
        decimalSeparator: ",.",
        invalidAuthAttempt: 0,
        isLocked: 0,
        timezone,
        lastUpdatePassword: new Date(),
        isActive: 1,
        company: {
          id: company,
        },
        creationDate: new Date(),
        updateDate: new Date(),
      };

      if (mode == "edit") {
        setIsLoading(true);
        try {
          await callApi(`${apiUrl}/${userId}`, "PUT", payload);
          message.success("Succesfully edited data");
          setFetch(true);
          setOpen(false);
        } catch (error) {
          message.error("Something went wrong!");
        }
      } else {
        try {
          await callApi(apiUrl, "POST", payload);
          message.success("Succesfully added data");
          setFetch(true);
          setOpen(false);
        } catch (error) {
          message.error("Something went wrong!");
        }
      }
      setSubmitting(false);
      setIsLoading(false);
    },
    [isLoading, fetch, mode, userId]
  );
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      language: "",
      company: "",
      timezone: "",
      userType: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, setSubmitting);
    },
  });

  const getUserRole = (idUser: number) => {
    const response = callApi(`${apiUrlGetUR} ${idUser}`, "GET", null);
    response
      .then((res) => {
        setSelectedRoles(res.data.map((userRole) => userRole.role.id));
      })
      .catch((err) => {
        alert(err);
        console.log(err.message);
      });
  };

  useEffect(() => {
    getUserRole(userId);
    getRole();
  }, []);

  const handleDelete = useCallback(
    async (row) => {
      setTableLoading(true);
      try {
        await callApi(apiUrl + `/${row.id}`, "DELETE", null);
        message.success("Successfully deleted data");
        setFetch(true);
      } catch (error) {
        message.error("Failed | Something went wrong");
        setTableLoading(false);
      }
    },
    [fetch]
  );

  const handleEdit = useCallback(
    (row) => async () => {
      console.log(row);

      setMode("edit");
      setId(row.id);
      formik.setFieldValue("userName", row.userName);
      formik.setFieldValue("email", row.email);
      formik.setFieldValue("password", row.password);
      formik.setFieldValue("language", row.language);
      formik.setFieldValue("timezone", row.timezone);
      formik.setFieldValue("userType", row.userType);
      formik.setFieldValue("company", row.company?.id || "-1");
      showModal();
    },
    []
  );

  const handleRole = useCallback(
    (row) => async () => {
      setMode("editrole");
      setId(row.id);
      setModalURole(true);
      getUserRole(row.id);
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "User Name",
        dataIndex: "userName",
      },
      {
        title: "Language",
        dataIndex: "language",
      },
      {
        title: "Action",
        key: "action",
        render: (row) => (
          <Space size="middle">
            <a onClick={handleRole(row)}>
              <CopyOutlined />
            </a>
            <a onClick={handleEdit(row)}>
              <EditOutlined />
            </a>
            <Popconfirm
              title={<span className="ms-2">Delete the task</span>}
              description={
                <span className="ms-2">Are you sure to delete this data?</span>
              }
              okText="Yes"
              cancelText="No"
              icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
              onConfirm={() => {
                handleDelete(row);
              }}
            >
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete, handleEdit, handleRole]
  );

  const searchSection = "";
  const handleSelectChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <FormikProvider value={formik}>
      <Modal
        open={open}
        title={mode == "edit" ? `Edit id: ${userId}` : "New"}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Card>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={formik.handleSubmit}
            style={{ maxWidth: 600, marginTop: "20px" }}
          >
            <Form.Item label="Username" required>
              <Input
                id="userName"
                {...formik.getFieldProps("userName")}
                type="text"
                status={
                  formik.touched.userName && formik.errors.userName
                    ? "error"
                    : null
                }
              />
              {formik.touched.userName && formik.errors.userName ? (
                <p style={{ color: "#ff0000" }}> {formik.errors.userName}</p>
              ) : null}
            </Form.Item>

            <Form.Item label="Password" required>
              <Input.Password
                id="password"
                {...formik.getFieldProps("password")}
                status={
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : null
                }
              />
              {formik.touched.password && formik.errors.password ? (
                <p style={{ color: "#ff0000" }}> {formik.errors.password}</p>
              ) : null}
            </Form.Item>
            <Form.Item label="Email:" required>
              <Input
                // style={{ marginLeft: "5px" }}
                id="email"
                {...formik.getFieldProps("email")}
                type="text"
                status={
                  formik.touched.email && formik.errors.email ? "error" : null
                }
              />
              {formik.touched.email && formik.errors.email ? (
                <p style={{ color: "#ff0000" }}> {formik.errors.email}</p>
              ) : null}
            </Form.Item>
            {user.userType == "Admin" ? (
              <Form.Item label="Company" required>
                <CustomSelect
                  apiUrl={Config.prefixUrl + "/common/company"}
                  field={formik.getFieldProps("company")}
                  form={formik}
                  label="Company"
                  style={{ width: "281.77px" }}
                  status={
                    formik.touched.company && formik.errors.company
                      ? "error"
                      : null
                  }
                />
                {formik.touched.company && formik.errors.company ? (
                  <p style={{ marginTop: "-20px", color: "#ff0000" }}>
                    {" "}
                    {formik.errors.company}
                  </p>
                ) : null}
              </Form.Item>
            ) : (
              ""
            )}
            <Form.Item label="Language">
              <Select
                placeholder="Select Language"
                onBlur={formik.handleBlur}
                value={formik.values.language}
                id="language"
                onChange={(value) => handleSelectChange("language", value)}
              >
                <Option>----</Option>
                <Option value="en">English</Option>
                <Option value="ind">Indonesia</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Timezone:">
              <Select
                id="timezone"
                onBlur={formik.handleBlur}
                value={formik.values.timezone}
                onChange={(value) => handleSelectChange("timezone", value)}
              >
                <Option>Select Timezone</Option>
                <Option value="US">USA</Option>
                <Option value="ID">Indonesia</Option>
              </Select>
            </Form.Item>
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "16px",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                disabled={formik.isSubmitting}
              >
                {!isLoading && <span className="indicator-label"> Save</span>}
                {isLoading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...
                  </span>
                )}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      {/*  */}
      <Modal
        open={modalURole}
        title="Set Role"
        onCancel={handleCancelUR}
        footer={[
          <Button htmlType="submit" onClick={postUserRole}>
            Save
          </Button>,
        ]}
      >
        <Card>
          <Checkbox.Group
            options={rolesData.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            value={selectedRoles}
            onChange={handleCheckboxChange}
          />
        </Card>
      </Modal>
      {/*  */}
      <div>
        <TableAntd
          title="User List"
          loading={tableLoading}
          setLoading={setTableLoading}
          columns={columns}
          searchUrl={searchUrl}
          useCard={true}
          apiUrl={apiUrl}
          readonly={false}
          targetNew="#dataModal"
          targetEdit="#dataModal"
          searchSection={searchSection}
          showModal={showModalNew}
          fetch={fetch}
          setFetch={setFetch}
        />
      </div>
    </FormikProvider>
  );
}
