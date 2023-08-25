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
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

export function CompanyList() {
  const [userId, setId] = useState(0);
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = Config.prefixUrl + "/common/company";

  const [open, setOpen] = useState(false);

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
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    maxUser: Yup.number().required("Required"),
    // expiredDate: Yup.date()
    //   .min(new Date(), "Must be greater than today")
    //   .required("Required"),
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
    onSubmit: handleSubmitForm,
  });
  console.log("forrmikk try table:", formik);

  function handleSubmitForm() {
    const { name, address, maxUser, expiredDate, reportServer, isActive } =
      formik.values;
    const payload = {
      name,
      address,
      maxUser,
      expiredDate,
      reportServer,
      isActive,
      creationDate: new Date(),
      lastUpdateDate: new Date(),
    };

    if (mode == "edit") {
      setIsLoading(true);
      const response = callApi(`${apiUrl}/${userId}`, "PUT", payload);
      response
        .then((res) => {
          window.location.reload();
          alert("edit succesfully");
          message.success("Save succesfully");
        })
        .catch((err) => {
          alert("edit error: " + err);
          console.log(err.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      const response = callApi(apiUrl, "POST", payload);
      console.log("payload", payload);
      response
        .then((res) => {
          window.location.reload();
          alert("post succesfully");
          message.success("Save succesfully");
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err.message);
          alert("post error: " + err);
          console.log("payload", payload);
        });
    }
  }

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
      },
      {
        title: "Name",
        dataIndex: "name",
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
            <a onClick={handleDelete(row)}>
              <DeleteOutlined />
            </a>
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
              <Input id="name" {...formik.getFieldProps("name")} type="text" />
              {formik.touched.name && formik.errors.name ? (
                <div>{formik.errors.name}</div>
              ) : null}
            </Form.Item>

            <Form.Item label="Address">
              <TextArea
                id="address"
                {...formik.getFieldProps("address")}
                rows={4}
              />
              {/* <Input
                id="address"
                {...formik.getFieldProps("address")}
                type="text"
              /> */}
              {formik.touched.address && formik.errors.address ? (
                <div>{formik.errors.address}</div>
              ) : null}
            </Form.Item>

            <Form.Item label="Max User">
              <Input
                id="maxUser"
                {...formik.getFieldProps("maxUser")}
                type="text"
              />
              {formik.touched.maxUser && formik.errors.maxUser ? (
                <div>{formik.errors.maxUser}</div>
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
              />
              {formik.touched.reportServer && formik.errors.reportServer ? (
                <div>{formik.errors.reportServer}</div>
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
          useCard={true}
          apiUrl={apiUrl}
          readonly={false}
          targetNew="#dataModal"
          targetEdit="#dataModal"
          searchSection={searchSection}
          showModal={setOpen}
        />
      </div>
    </FormikProvider>
  );
}
