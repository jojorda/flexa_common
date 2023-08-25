import React, { useEffect, useCallback, useState, useMemo } from "react";
// @ts-ignore
import { callApi, TableAntd, CustomSelect } from "@intellinum/flexa-util";
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
} from "antd";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Config } from "../../config/config";

export function RoleList() {
  const [id, setId] = useState(0);
  const [mode, setMode] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [crbydate, setCrbydate] = useState("");
  const [upcrbydate, setUpcrbydate] = useState("");
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalURole, setModalURole] = useState(false);

  const apiUrlRoleModule = Config.prefixUrl + "/common/rolemodule";
  const apiUrl = Config.prefixUrl + "/common/role";
  const apiUrlGetRM = `${Config.prefixUrl}/common/rolemodule/findByRole?role=`;
  const user = JSON.parse(localStorage.getItem("flexa_auth"));
  const apiUrlModule =
    Config.prefixUrl +
    "/common/module/findByIsActiveAndCompany?isActive=1&company=" +
    user.company;

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

  const validationSchema = Yup.object().shape({});
  const formik = useFormik({
    initialValues: {
      name: "",
      company: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        name: values.name,
        company: values.company,
        creationDate: new Date(),
        createdBy: crbydate,
        updateDate: new Date(),
        updatedBy: upcrbydate,
      };

      if (mode == "edit") {
        setIsLoading(true);
        const response = callApi(apiUrl + `/${id}`, "PUT", payload);
        response
          .then((res) => {
            message.success("Edit succesfully");
            setIsLoading(false);
            handleCancel();
            setFetch(true);
          })
          .catch((err) => {
            console.log(err.message);
            setIsLoading(false);
          });
      } else {
        setIsLoading(true);
        const response = callApi(apiUrl, "POST", payload);
        response
          .then((res) => {
            message.success("Save succesfully");
            setIsLoading(false);
            handleCancel();
            setFetch(true);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err.message);
          });
      }
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

  useEffect(() => {
    getRoleModule(id);
    getModule();
  }, []);

  const handleDelete = useCallback(
    (row) => async () => {
      if (window.confirm("Are you sure to remove this?")) {
        const response = await callApi(apiUrl + `/${row.id}`, "DELETE", null);
        window.location.reload();
      }
    },
    []
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
        render: (row) => (
          <Space size="middle">
            <a onClick={handleRoleModule(row)}>
              <CopyOutlined />
            </a>
            <a onClick={handleEdit(row)}>
              <EditOutlined />
            </a>
            <a onClick={handleDelete(row)}>
              <DeleteOutlined />
            </a>
          </Space>
        ),
      },
    ],
    [handleDelete, handleEdit, handleRoleModule]
  );

  const searchSection = "";
  const styleComp = {
    display: "flex",
    justifyContent: "space-between",
  };

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
              <Input id="name" {...formik.getFieldProps("name")} type="text" />
              {formik.touched.name && formik.errors.name ? (
                <div>{formik.errors.name}</div>
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
                />
                {formik.touched.company && formik.errors.company ? (
                  <div>{formik.errors.company}</div>
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
        <TableAntd
          title="Role List"
          columns={columns}
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
      <Card
        title="Create Role Module"
        bordered={false}
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <div>
          <div style={{ backgroundColor: "#F6F1F1", padding: "8px" }}>
            <div className="" style={styleComp}>
              <div>
                <h3>ABP Identity User</h3>
              </div>
              <h3 style={{ cursor: "pointer", color: "#19A7CE" }}>
                <span>Check All</span> . <span>Uncheck All</span>
              </h3>
            </div>
            <hr />
            <Checkbox.Group>
              <Row>
                <Col span={24} sm={12} md={8} lg={8} xl={8}>
                  <Checkbox value="create">Create</Checkbox>
                </Col>
                <Col span={24} sm={12} md={8} lg={8} xl={8}>
                  <Checkbox value="edit">Edit</Checkbox>
                </Col>
                <Col span={24} sm={12} md={8} lg={8} xl={8}>
                  <Checkbox value="delete">Delete</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>

          <div style={{ backgroundColor: "#D8D9CF", padding: "8px" }}>
            <div className="" style={styleComp}>
              <div>
                <h3>Action</h3>
              </div>
              <h3 style={{ cursor: "pointer", color: "#19A7CE" }}>
                <span>Check All</span> . <span>Uncheck All</span>
              </h3>
            </div>
            <hr />
            <Checkbox.Group>
              <Checkbox>All</Checkbox>
            </Checkbox.Group>
          </div>
          <hr />
          <>
            <Button type="primary" htmlType="submit">
              Save Module Role
            </Button>
          </>
        </div>
      </Card>
    </FormikProvider>
  );
}
