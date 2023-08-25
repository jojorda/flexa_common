import React, { useEffect, useCallback, useState, useMemo } from "react";
// @ts-ignore
import * as FlexaUtil from "@intellinum/flexa-util";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  Col,
  Row,
  Space,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Card,
  message,
  Typography,
  Popconfirm,
  Alert,
} from "antd";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Config } from "../../../config/config";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const { callApi, TableAntd, CustomSelect, useNetwork } = FlexaUtil;
export default function RoleOrg() {
  const { networkStatus, addApiPendingRequest } = useNetwork();

  const [id, setId] = useState(0);
  const [mode, setMode] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [crbydate, setCrbydate] = useState("");
  const [upcrbydate, setUpcrbydate] = useState("");
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalURole, setModalURole] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/common/role/search"
  );
  const [apiUrlRoleModule, setApiUrlRoleModule] = useState(
    Config.prefixUrl + "/common/rolemodule"
  );
  const [apiUrl, setApiUrl] = useState(Config.prefixUrl + "/common/role");
  const [apiUrlGetRM, setApiUrlGetRM] = useState(
    `${Config.prefixUrl}/common/rolemodule/findByRole?role=`
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("flexa_auth"))
  );
  const [apiUrlModule, setApiUrlModule] = useState(
    Config.prefixUrl +
      `/common/module/findByIsActiveAndCompany?isActive=1&company=${
        user.company || "-1"
      }`
  );

  const showModalNew = () => {
    setMode("new");
    formik.resetForm();
    setIsLoading(false);
    setOpen(true);
  };

  const getModule = () => {
    const response = callApi(`${apiUrlModule}`, "GET", null);
    response
      .then((res) => {
        setModules(res.data);
      })
      .catch((err) => {
        alert(err);
        console.log(err.message);
      });
  };
  useEffect(() => {
    getModule();
  }, []);
  const handleCheckboxChange = (checkedRoles) => {
    setSelectedRoles(checkedRoles);
  };

  const postUserRole = () => {
    const payload = selectedRoles.map((moduleId) => ({
      role: { id: id },
      module: { id: moduleId },
      company: -1,
    }));
    const response = callApi(apiUrlRoleModule, "POST", payload);
    response
      .then((res) => {
        message.success("Success add Module");
        setModalURole(false);
        setFetch(true);
      })
      .catch((err) => {
        message.error("can't post");
        console.log(err.message);
      });
  };

  const handleCancelRM = () => {
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
  const handleSubmit = useCallback(
    async (values, setSubmitting) => {
      const payload = {
        name: values.name,
        company: values.company,
        creationDate: new Date(),
        createdBy: crbydate,
        updateDate: new Date(),
        updatedBy: upcrbydate,
      };
      setIsLoading(true);
      if (mode == "edit") {
        if (networkStatus === "offline") {
          addApiPendingRequest(apiUrl + `/${id}`, "PUT", payload);
          setOpen(false);
          setSubmitting(false);
          setIsLoading(false);
          return;
        }

        try {
          await callApi(apiUrl + `/${id}`, "PUT", payload);
          message.success("Succesfully edited data");
          setFetch(true);
          setOpen(false);
        } catch (error) {
          message.error("Something went wrong!");
        }
      } else {
        if (networkStatus === "offline") {
          addApiPendingRequest(apiUrl, "POST", payload);
          setOpen(false);
          setSubmitting(false);
          setIsLoading(false);
          return;
        }
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
    [isLoading, fetch, mode, networkStatus, id]
  );

  const validationSchema = () => {
    let validation = Yup.object().shape({
      name: Yup.string().required("This field is required"),
    });
    if (user.userType == "Admin") {
      validation = Yup.object().shape({
        name: Yup.string().required("This field is required"),
        company: Yup.string().required("This field is required"),
      });
    }
    return validation;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      company: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, setSubmitting);
    },
  });

  const getRoleModule = (idRole: number) => {
    const response = callApi(`${apiUrlGetRM} ${idRole}`, "GET", null);
    response
      .then((res) => {
        setSelectedRoles(res.data.map((roleModule) => roleModule.module.id));
      })
      .catch((err) => {
        alert(err);
        console.log(err.message);
      });
  };

  const handleDelete = useCallback(
    async (row) => {
      if (networkStatus === "offline") {
        addApiPendingRequest(apiUrl + `/${row.id}`, "DELETE", null);
        setOpen(false);
        setIsLoading(false);
        return;
      }
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
    [fetch, networkStatus]
  );

  const handleEdit = useCallback(
    (row) => async () => {
      setMode("edit");
      setId(row.id);
      formik.setFieldValue("name", row.name);
      formik.setFieldValue("company", row.company);
      showModal();
    },
    []
  );

  const handleRoleModule = useCallback(
    (row) => async () => {
      setMode("editrolemodule");
      setId(row.id);
      setModalURole(true);
      getRoleModule(row.id);
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
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Action",
        key: "action",
        render: (row) => {
          return (
            <Space size="middle">
              <a onClick={handleRoleModule(row)}>
                <CopyOutlined />
              </a>
              <a onClick={handleEdit(row)}>
                <EditOutlined />
              </a>
              <Popconfirm
                title={<span className="ms-2">Delete the task</span>}
                description={
                  <span className="ms-2">
                    Are you sure to delete this data?
                  </span>
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
          );
        },
      },
    ],
    [handleDelete, handleEdit, handleRoleModule]
  );

  const searchSection = "";

  return (
    <FormikProvider value={formik}>
      <Modal
        open={open}
        title={mode == "edit" ? `Edit` : "New"}
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
            <Form.Item label="Name" required>
              <Input
                id="name"
                {...formik.getFieldProps("name")}
                type="text"
                status={
                  formik.touched.name && formik.errors.name ? "error" : null
                }
              />
              {formik.touched.name && formik.errors.name ? (
                <Typography.Text type="danger">
                  {formik.errors.name}
                </Typography.Text>
              ) : null}
            </Form.Item>
            {user.userType == "Admin" ? (
              <Form.Item label="Company" required>
                <CustomSelect
                  apiUrl={Config.prefixUrl + "/common/company"}
                  field={formik.getFieldProps("company")}
                  form={formik}
                  label="Company"
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
                {isLoading ? (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...
                  </span>
                ) : (
                  <span className="indicator-label"> Save</span>
                )}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Modal
        width={600}
        open={modalURole}
        title="Set Role"
        onCancel={handleCancelRM}
        footer={[
          <Button htmlType="submit" onClick={postUserRole}>
            Save
          </Button>,
        ]}
      >
        <Card>
          <Checkbox.Group
            options={modules.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            // value={checkedRM}
            value={selectedRoles}
            onChange={handleCheckboxChange}
          >
            <Row>
              {modules.map((role) => (
                <Col key={role.id} span={12}>
                  <Checkbox value={role.id}>
                    {role.id}. {role.name}{" "}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Card>
      </Modal>
      <div>
        {networkStatus === "offline" && (
          <div className="d-flex justify-content-center py-2">
            <Alert
              message={
                <>
                  <Typography.Text>
                    <span className="fw-bold">
                      You are currently in offline mode!
                    </span>{" "}
                    All data changes will be saved when you go back online.
                  </Typography.Text>
                </>
              }
              type="warning"
            />
          </div>
        )}
        <TableAntd
          title="Role List"
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
      {/* module section has been deleted, if want to get it agai, go to github before 26-jully-2023 */}
    </FormikProvider>
  );
}
