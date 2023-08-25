import { useEffect, useState } from "react";
// @ts-ignore
// import { Config, callApi } from "@intellinum/flexa-util";
import { UserList } from "../user/userList";
import { Button, Tabs } from "antd";
import { MenuList } from "../menu/menuList";
import { RoleList } from "../role/roleList";
import { CompanyList } from "../company/companyList";
import { ModuleList } from "../module/moduleList";
import { Config } from "../../config/config";
import { callApi } from "../../config/callApi";
import { Link } from "react-router-dom";

import { MenuTop } from "../menu/menuTop";

export function MenuTabsLStorage() {
  const user = JSON.parse(localStorage.getItem("flexa_auth"));
  const [menuList, setMenuList] = useState([]);
  const [menuList2, setMenuList2] = useState([]);

  function getMenu() {
    //Get All Menu
    const response = callApi(
      Config.prefixUrl +
        "/common/menu/findAllMenu?company=" +
        (user.company || "-1"),
      "GET",
      null
    );
    response
      .then((res) => {
        setMenuList(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const allMenus = menuList.flatMap((dataItem) => dataItem.menu);

  function getMenu2() {
    //Get All Menu
    const response = callApi(
      Config.prefixUrl + "/common/menu?company=-1&pageNumber=0&size=15",
      "GET",
      null
    );
    response
      .then((res) => {
        setMenuList2(res.data.content);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    getMenu();
    getMenu2();
  }, []);
  const filterMenu = menuList2.filter((item) => item.parentMenu !== 0);
  console.log("menulist2", menuList2);

  const [selectedMenu, setSelectedMenu] = useState([]);

  useEffect(() => {
    const storedSelectedMenu = localStorage.getItem("selectedMenu");
    if (storedSelectedMenu) {
      setSelectedMenu(JSON.parse(storedSelectedMenu));
    }
  }, []);
  console.log("selectedMenu", selectedMenu);

  if (selectedMenu.length > 0) {
    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="middle"
          items={selectedMenu.map((item, index) => {
            const id = String(index + 1);
            return {
              label: (
                <>
                  <i className={item.icon} style={{ color: "red" }}></i>{" "}
                  {item.name}
                </>
              ),
              key: id,
              children: (
                <>
                  <div
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "end",
                    }}
                  >
                    <Link to="/common">
                      <Button type="primary">Cancel</Button>
                    </Link>
                  </div>
                  <div>{getMenuAll(item.name)}</div>
                </>
              ),
            };
          })}
        />
      </div>
    );
  } else {
    return (
      <div
        style={{
          marginBottom: "8px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          <h3 style={{ textAlign: "center" }}>No data</h3>
          <div>
            <Link to="/common">
              <Button type="primary">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const getMenuAll = (comp: string) => {
  switch (comp) {
    case "Menu":
      return <MenuList />;
    case "User":
      return <UserList />;
    case "Company":
      return <CompanyList />;
    case "Role":
      return <RoleList />;
    case "Module":
      return <ModuleList />;
    default:
      return null;
  }
};
