import { useEffect, useCallback, useState, useMemo } from "react";
// @ts-ignore
import { Config, showMessage, callApi, TreeMenu } from "@intellinum/flexa-util";
import {
  Modal,
  Space,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Card,
  message,
} from "antd";
import type { MenuProps } from "antd";

export function MenuList() {
  const [id, setId] = useState("");
  const [mode, setMode] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [company, setCompany] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [parentMenu, setParentMenu] = useState({ id: "", label: "" });
  const user = JSON.parse(localStorage.getItem("flexa_auth"));
  const apiUrl = Config.prefixUrl + "/common/menu";
  const [moduleList, setModuleList] = useState([]);
  const [currentMenu, setCurrentMenu] = useState({
    id: 0,
    name: "",
    icon: "",
    moduleId: 0,
    moduleName: "",
    parentId: 0,
    parentName: "",
  });
  const [form] = Form.useForm();

  console.log("menuni", menuList);

  let menu = ``;

  function getModules() {
    callApi(
      Config.prefixUrl +
        "/common/module/findByIsActiveAndCompany?isActive=1&company=" +
        user.company,
      "GET"
    ).then((res) => {
      for (var i = 0; i < res.data.length; i++) {
        moduleList.push({ value: res.data[i].id, label: res.data[i].name });
      }
    });
  }

  function renderMenu(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].menu.length > 0) {
        menu +=
          `<div class="menu-item menu-sub-indention menu-accordion" data-kt-menu-trigger="click" id="` +
          data[i].id +
          `">
                <a href="javascript:void(0)" class="menu-link py-3">
                    <span class="menu-icon">
                        <i class="ki-duotone ki-burger-menu fs-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
                    </span>
                    <span class="menu-title">` +
          data[i].name +
          `</span>
                    <span class="menu-arrow"></span>
                </a>`;
      } else {
        menu +=
          `<div class="menu-item" id="` +
          data[i].id +
          `">
                    <a href="javascript:void(0)" class="menu-link py-3">
                        <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                        </span>
                        <span class="menu-title">` +
          data[i].name +
          `</span>
                    </a>
                </div>`;
      }

      if (data[i].menu.length > 0) {
        menu += `<div class="menu-sub menu-sub-accordion pt-3">`;
        renderMenu(data[i].menu);
        menu += `</div>`;
      }
      if (data[i].menu.length > 0) menu += `</div>`;
    }

    return menu;
  }

  function getMenu() {
    //Get All Menu
    const response = callApi(
      Config.prefixUrl +
        "/common/menu/findAllMenu?company=" +
        (user.company || "-1"),
      "GET"
    );
    response
      .then((res) => {
        setMenuList(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    getMenu();
    getModules();
  }, []);

  const onFinish = (values: any) => {
    (values.creationDate = new Date()),
      (values.updateDate = new Date()),
      (values.company = user.company);
    if (parentMenu.id) values.parentMenu = parseInt(parentMenu.id);
    else values.parentMenu = 0;
    if (values.moduleId) {
      values.module = {
        id: parseInt(values.moduleId),
      };
    }
    //console.log(values);
    if (mode == "edit") {
      const response = callApi(`${apiUrl}/${id}`, "PUT", values);
      response
        .then((res) => {
          showMessage("Save succesfully");
          setModalVisible(false);
        })
        .catch((err) => {
          message.error("Error when saving : " + err.message);
        });
    } else {
      const response = callApi(apiUrl, "POST", values);
      response
        .then((res) => {
          showMessage("Save succesfully");
          setModalVisible(false);
          getMenu();
        })
        .catch((err) => {
          message.error("Error when saving : " + err.message);
        });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const resetForm = () => {
    form.setFieldValue("name", "");
    form.setFieldValue("parentMenu", "");
    form.setFieldValue("moduleId", "");
    form.setFieldValue("icon", "");
  };

  const findMenu = (data, menuId) =>
    data.map((item) => {
      if (item.id == parseInt(menuId)) {
        setCurrentMenu(item);
        console.log(item);
        return;
      } else if (item.menu) {
        findMenu(item.menu, menuId);
      }
    });

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    //console.log(info);
    setId(selectedKeys[0] + "");
    findMenu(menuList, selectedKeys[0]);
  };

  return (
    <>
      <Modal
        title="Manage"
        centered
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Card>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{
              name: "",
              icon: "",
              parentMenu: 0,
              moduleId: null,
              isActive: 1,
              company: -1,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input menu name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Parent Menu" name="parentMenu">
              <Input readOnly={true} />
            </Form.Item>

            <Form.Item name="moduleId" label="Module">
              <Select defaultValue={currentMenu.moduleId}>
                {moduleList.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Icon"
              name="icon"
              rules={[{ required: true, message: "Please input menu icon!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="isActive" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Card title="List" style={{ minHeight: "72vh" }}>
        <Space direction="horizontal">
          <Button
            type="primary"
            onClick={() => {
              resetForm();
              currentMenu.moduleName = "";
              setParentMenu({ id: "0", label: "" });
              setModalVisible(true);
            }}
          >
            Add Top Menu
          </Button>
          <Button
            type="primary"
            onClick={() => {
              resetForm();
              setParentMenu({
                id: currentMenu.id + "",
                label: currentMenu.name,
              });
              form.setFieldValue("name", "");
              form.setFieldValue("parentMenu", currentMenu.name);
              setModalVisible(true);
            }}
          >
            Add Sub Menu
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (id) {
                resetForm();
                setMode("edit");
                setId(id);
                setParentMenu({
                  id: currentMenu.parentId + "",
                  label: currentMenu.name,
                });
                form.setFieldValue("name", currentMenu.name);
                form.setFieldValue("parentMenu", currentMenu.parentName);
                form.setFieldValue("moduleId", currentMenu.moduleId);
                form.setFieldValue("icon", currentMenu.icon);
                setModalVisible(true);
              } else {
                message.info("Please Select Menu");
              }
            }}
          >
            Edit
          </Button>
        </Space>
        <TreeMenu
          company={user.company}
          onSelect={onSelect}
          setData={setMenuList}
        ></TreeMenu>
      </Card>
    </>
  );
}
