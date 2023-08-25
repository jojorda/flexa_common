import { useEffect, useState } from "react";
// @ts-ignore
// import { Config, callApi } from "@intellinum/flexa-util";
import { UserList } from "../user/userList";
import { Tabs } from "antd";
import { MenuList } from "../menu/menuList";
import { RoleList } from "../role/roleList";
import { CompanyList } from "../company/companyList";
import { ModuleList } from "../module/moduleList";
import { Config } from "../../config/config";
import { callApi } from "../../config/callApi";

export function SubMenuTabs() {
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

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="middle"
        items={filterMenu.map((item, index) => {
          const id = String(index + 1);
          return {
            label: (
              <>
                <i className={item.icon} style={{ color: "red" }}></i>{" "}
                {item.name}
              </>
            ),
            key: id,
            children: <>{getMenuAll(item.name)}</>,
          };
        })}
      />
    </div>
  );
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
