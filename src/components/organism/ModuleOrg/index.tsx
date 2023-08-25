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
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Config } from "../../../config/config";
import { navigateToUrl } from "single-spa";
import { AiOutlineQuestionCircle } from "react-icons/ai";
const { Option } = Select;
const { TextArea } = Input;

export default function ModuleOrg() {
  const [userId, setId] = useState(0);
  const [mode, setMode] = useState("");
  const [crbydate, setCrbydate] = useState("");
  const [upcrbydate, setUpcrbydate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalMAction, setModalMAction] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/common/module/search"
  );
  const [apiUrl, setApiUrl] = useState(Config.prefixUrl + "/common/module");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("flexa_auth"))
  );

  const showModalNew = () => {
    setMode("new");
    formik.resetForm();
    setIsLoading(false);
    setOpen(true);
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

  const handleCancelMA = () => {
    setModalMAction(false);
  };

  const handleSubmit = useCallback(
    async (values, setSubmitting) => {
      const payload = {
        name: values.name,
        description: values.description,
        category: values.category,
        isExternal: values.external,
        controller: values.control,
        action: values.action,
        isActive: values.activ,
        applicationPath: values.apppath,
        projectName: values.prjname,
        company: values.company,
        creationDate: new Date(),
        createdBy: crbydate,
        updateDate: new Date(),
        updatedBy: upcrbydate,
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    // description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      company: "",
      external: "",
      control: "",
      action: "",
      activ: "",
      apppath: "",
      prjname: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, setSubmitting);
    },
  });

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
      setMode("edit");
      setId(row.id);
      formik.setFieldValue("name", row.name);
      formik.setFieldValue("company", row.company);
      formik.setFieldValue("description", row.description);
      formik.setFieldValue("category", row.category);
      formik.setFieldValue("external", row.isExternal);
      formik.setFieldValue("control", row.controller);
      formik.setFieldValue("action", row.action);
      formik.setFieldValue("activ", row.isActive);
      formik.setFieldValue("apppath", row.applicationPath);
      formik.setFieldValue("prjname", row.projectName);
      showModal();
    },
    []
  );

  const handleModuleAction = useCallback(
    (row) => async () => {
      setMode("moduleaction");
      setId(row.id);
      navigateToUrl(`/common/module-action/${row.id}`);
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
        title: "Description",
        dataIndex: "controller",
      },
      {
        title: "Action",
        key: "action",
        render: (row) => (
          <Space size="middle">
            <span
              onClick={handleModuleAction(row)}
              title="module action"
              style={{ cursor: "pointer" }}
            >
              <SnippetsOutlined />
            </span>
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
    [handleDelete, handleEdit, handleModuleAction]
  );

  const searchSection = "";
  const handleSelectChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <FormikProvider value={formik}>
      <Modal
        width={800}
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
            <Row>
              <Col span={12}>
                <Form.Item label="Name" required>
                  <Input
                    id="name"
                    {...formik.getFieldProps("name")}
                    type="text"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div>{formik.errors.name}</div>
                  ) : null}
                </Form.Item>
                <Form.Item label="Description">
                  <TextArea
                    id="description"
                    {...formik.getFieldProps("description")}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div>{formik.errors.description}</div>
                  ) : null}
                </Form.Item>
                <Form.Item label="Category">
                  <Input
                    id="category"
                    {...formik.getFieldProps("category")}
                    type="text"
                  />
                  {formik.touched.category && formik.errors.category ? (
                    <div>{formik.errors.category}</div>
                  ) : null}
                </Form.Item>
                {user.userType == "Admin" ? (
                  <Form.Item label="Company" required>
                    <CustomSelect
                      apiUrl={Config.prefixUrl + "/common/company"}
                      field={formik.getFieldProps("company")}
                      form={formik}
                      label="Company"
                      style={{ width: "199.99px" }}
                    />
                  </Form.Item>
                ) : (
                  ""
                )}
                {/* Select External */}
                <Form.Item label="External">
                  <Select
                    placeholder="Select External"
                    onBlur={formik.handleBlur}
                    value={formik.values.external}
                    id="external"
                    onChange={(value) => handleSelectChange("external", value)}
                  >
                    <Option>----</Option>
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* .... */}
              <Col span={12}>
                <Form.Item label="Controller">
                  <Input
                    id="control"
                    {...formik.getFieldProps("control")}
                    type="text"
                  />
                  {formik.touched.control && formik.errors.control ? (
                    <div>{formik.errors.control}</div>
                  ) : null}
                </Form.Item>
                <Form.Item label="Action">
                  <Input
                    id="action"
                    {...formik.getFieldProps("action")}
                    type="text"
                  />
                  {formik.touched.action && formik.errors.action ? (
                    <div>{formik.errors.action}</div>
                  ) : null}
                </Form.Item>
                {/* Select Active */}
                <Form.Item label="Active">
                  <Select
                    onBlur={formik.handleBlur}
                    value={formik.values.activ}
                    id="activ"
                    onChange={(value) => handleSelectChange("activ", value)}
                  >
                    <Option>Select Active</Option>
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="App Path">
                  <Input
                    id="apppath"
                    {...formik.getFieldProps("apppath")}
                    type="text"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ fontSize: "13px" }}>Project Name</label>
                  }
                >
                  <Input
                    id="prjname"
                    {...formik.getFieldProps("prjname")}
                    type="text"
                  />
                </Form.Item>
              </Col>
            </Row>
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
      <div>
        <TableAntd
          title="Module List"
          loading={tableLoading}
          searchUrl={searchUrl}
          setLoading={setTableLoading}
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
    </FormikProvider>
  );
}
