// @ts-ignore
import { callApi, TableAntd, Config } from "@intellinum/flexa-util";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  Row,
  Col,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { navigateToUrl } from "single-spa";

const initialValues = {
  id: "",
  module: "",
  controller: "",
  action: "",
  creationDate: "",
  updateDate: "",
};

const MASchema = Yup.object().shape({});

export function ModuleAction() {
  const [iduser, idchange] = useState(0);
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const { moduleId } = useParams();
  const apiUrl = Config.prefixUrl + "/common/moduleaction";
  const apiUrlGet = `${apiUrl}/findByModule?module=${moduleId}`;

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

  const formik = useFormik({
    initialValues,
    validationSchema: MASchema,
    onSubmit: handleSubmitForm,
  });

  const handleDelete = useCallback(
    (row) => async () => {
      if (window.confirm("Are you sure to remove this?")) {
        const response = await callApi(`${apiUrl}/${row.id}`, "DELETE");
        setFetch(true);
      }
    },
    []
  );

  const handleEdit = useCallback(
    (row) => async () => {
      setMode("edit");
      idchange(row.id);
      formik.setFieldValue("controller", row.controller);
      formik.setFieldValue("action", row.action);
      setOpen(true);
    },
    []
  );

  function handleSubmitForm() {
    const { controller, action, creationDate, updateDate } = formik.values;
    const payload = {
      module: {
        id: moduleId,
      },
      controller,
      action,
      creationDate,
      updateDate,
    };

    if (mode == "edit") {
      setIsLoading(true);
      const response = callApi(`${apiUrl}/${iduser}`, "PUT", payload);
      response
        .then((res) => {
          message.success("Edit succesfully");
          setFetch(true);
          setIsLoading(false);
          handleCancel();
          formik.resetForm();
        })
        .catch((err) => {
          handleCancel();
          message.error("Edit Failed");
          console.log(err.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      const response = callApi(apiUrl, "POST", payload);
      response
        .then((res) => {
          message.success("Save succesfully");
          setFetch(true);
          setIsLoading(false);
          handleCancel();
        })
        .catch((err) => {
          handleCancel();
          message.error("Save Failed");
          console.log(err.message);
          setIsLoading(false);
        });
    }
  }

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "Controller",
        dataIndex: "controller",
      },
      {
        title: "Action",
        dataIndex: "action",
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

  return (
    <FormikProvider value={formik}>
      <div style={{ margin: "10px", display: "flex", justifyContent: "end" }}>
        <Button onClick={() => navigateToUrl("/common/module")}>Cancel</Button>
      </div>
      <Modal
        open={open}
        title={mode == "edit" ? `Edit` : "New"}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Card>
          <Form name="basic" onFinish={formik.handleSubmit}>
            <Row className="align-items-center mb-4">
              <Col xs={6} md={6} lg={6}>
                <span style={{ marginRight: "3px" }}>Controller:</span>
              </Col>
              <Col xs={12} md={12} lg={18}>
                {" "}
                <Input
                  id="controller"
                  {...formik.getFieldProps("controller")}
                  type="text"
                  name="controller"
                />
                {formik.touched.controller && formik.errors.controller ? (
                  <div>{formik.errors.controller}</div>
                ) : null}
              </Col>
            </Row>
            <Row className="align-items-center mb-4">
              <Col xs={6} md={6} lg={6}>
                <span style={{ marginRight: "3px" }}>Action:</span>
              </Col>
              <Col xs={12} md={12} lg={18}>
                {" "}
                <Input
                  name="action"
                  id="action"
                  {...formik.getFieldProps("action")}
                  type="text"
                />
                {formik.touched.action && formik.errors.action ? (
                  <div>{formik.errors.action}</div>
                ) : null}
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
                {!isLoading && (
                  <span className="indicator-label">
                    {" "}
                    {mode == "edit" ? "Edit" : "Save"}
                  </span>
                )}
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
          title="Module Action"
          columns={columns}
          loading={tableLoading}
          setLoading={setTableLoading}
          useCard={true}
          apiUrl={apiUrlGet}
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
