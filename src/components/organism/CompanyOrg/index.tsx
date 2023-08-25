import React, { useEffect, useCallback, useState, useMemo } from "react";
// @ts-ignore
import { Config, callApi, TableAntd } from "@intellinum/flexa-util";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  Space,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Card,
  message,
  DatePicker,
  Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

export default function CompanyOrg() {
  const [userId, setId] = useState(0);
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [searchUrl, setSearchUrl] = useState(
    Config.prefixUrl + "/common/company/search"
  );
  const [apiUrl, setapiUrl] = useState(Config.prefixUrl + "/common/company");

  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const showModalNew = () => {
    setMode("new");
    formik.resetForm();
    setIsLoading(false);
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
      const { name, address, maxUser, expiredDate, reportServer, isActive } =
        values;
      // console.log();
      // return;
      const payload = {
        name,
        address,
        maxUser,
        expiredDate: moment(expiredDate).format("Y-MM-DD"),
        reportServer,
        isActive,
        creationDate: new Date(),
        lastUpdateDate: new Date(),
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
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("This field is required"),
    maxUser: Yup.number().required("This field is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      maxUser: "",
      expiredDate: "",
      reportServer: "",
      isActive: "",
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
      formik.setFieldValue("address", row.address);
      formik.setFieldValue("maxUser", row.maxUser);
      formik.setFieldValue("expiredDate", row.expiredDate);
      formik.setFieldValue("reportServer", row.reportServer);
      formik.setFieldValue("isActive", row.isActive);
      showModal();
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        sorter: true,
      },
      {
        title: "Name",
        dataIndex: "name",
        sorter: true,
      },
      {
        title: "Address",
        dataIndex: "address",
      },
      {
        title: "Max User",
        dataIndex: "maxUser",
      },
      {
        title: "Expired Date",
        dataIndex: "expiredDate",
      },
      {
        title: "Action",
        key: "action",
        render: (row) => (
          <Space size="middle">
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
    [handleDelete, handleEdit]
  );

  const searchSection = "";
  const handleSelectChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };
  const onChange = (date, dateString) => {
    formik.setFieldValue("expiredDate", dateString);
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
                <p style={{ color: "#ff0000" }}>{formik.errors.name}</p>
              ) : null}
            </Form.Item>

            <Form.Item label="Address">
              <TextArea
                id="address"
                {...formik.getFieldProps("address")}
                rows={4}
                status={
                  formik.touched.address && formik.errors.address
                    ? "error"
                    : null
                }
              />
              {/* <Input
                id="address"
                {...formik.getFieldProps("address")}
                type="text"
              /> */}
              {formik.touched.address && formik.errors.address ? (
                <p style={{ color: "#ff0000" }}>{formik.errors.address}</p>
              ) : null}
            </Form.Item>

            <Form.Item label="Max User">
              <Input
                id="maxUser"
                {...formik.getFieldProps("maxUser")}
                type="text"
                status={
                  formik.touched.maxUser && formik.errors.maxUser
                    ? "error"
                    : null
                }
              />
              {formik.touched.maxUser && formik.errors.maxUser ? (
                <p style={{ color: "#ff0000" }}>{formik.errors.maxUser}</p>
              ) : null}
            </Form.Item>
            <Form.Item label="Expired Date">
              {/* <Input
                id="expiredDate"
                {...formik.getFieldProps("expiredDate")}
                type="text"
              /> */}
              <DatePicker
                onChange={onChange}
                name="expiredDate"
                style={{ width: "281.77px" }}
              />
            </Form.Item>
            <Form.Item label="Report Server">
              <Input
                id="reportServer"
                {...formik.getFieldProps("reportServer")}
                type="text"
                status={
                  formik.touched.reportServer && formik.errors.reportServer
                    ? "error"
                    : null
                }
              />
              {formik.touched.reportServer && formik.errors.reportServer ? (
                <p style={{ color: "#ff0000" }}>{formik.errors.reportServer}</p>
              ) : null}
            </Form.Item>
            <Form.Item label="Active">
              <Select
                id="isActive"
                onBlur={formik.handleBlur}
                value={formik.values.isActive}
                onChange={(value) => handleSelectChange("isActive", value)}
              >
                <Option value="1">Yes</Option>
                <Option value="0">No</Option>
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
      <div>
        <TableAntd
          title="Company"
          columns={columns}
          searchUrl={searchUrl}
          loading={tableLoading}
          setLoading={setTableLoading}
          useCard={true}
          apiUrl={apiUrl}
          readonly={false}
          targetNew="#dataModal"
          targetEdit="#dataModal"
          searchSection={searchSection}
          // showModal={setOpen}
          showModal={showModalNew}
          fetch={fetch}
          setFetch={setFetch}
        />
      </div>
    </FormikProvider>
  );
}
