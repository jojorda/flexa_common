import { Button, Tabs } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaDynamicIcons } from "../../components/atoms";
import {
  CompanyOrg,
  MenuOrg,
  ModuleOrg,
  RoleOrg,
  UserOrg,
} from "../../components/organism";
import TabPane from "antd/es/tabs/TabPane";
//@ts-ignore
import { themeToken } from "@intellinum/flexa-util";
type Props = { isDarkMode: boolean };

const Menu = (props: Props) => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState(params.activetab);
  useEffect(() => {
    setActiveTab(params.activetab);
  }, [params.activetab]);
  const callComponent = useCallback(
    (activeTab) => {
      switch (activeTab.toLowerCase()) {
        case "menu":
          return <MenuOrg isDarkMode={props.isDarkMode} />;
        case "company":
          return <CompanyOrg />;
        case "user":
          return <UserOrg />;
        case "role":
          return <RoleOrg />;
        case "module":
          return <ModuleOrg />;
        default:
          return "";
      }
    },
    [params.tabmenu, props.isDarkMode]
  );
  const menus = useMemo(() => {
    let userMenu = JSON.parse(localStorage.getItem("userMenu"));
    userMenu = userMenu.find((r) => r.name.toLowerCase() === "common");
    const result = userMenu.menu.map((r) => {
      return {
        path: r.menu?.find((res: any, ind: number) => ind === 0)?.path || "/",
        icon: r.icon,
        key: r.name.toLowerCase(),

        label: (
          <span>
            <FaDynamicIcons name={r.icon} />
            <span className="ms-1"> {r.name}</span>
          </span>
        ),
        children: (
          <>
            <div>{callComponent(r.name)}</div>
          </>
        ),
      };
    });
    return result;
  }, [props.isDarkMode]);

  return (
    <div className="card-container">
      {/* <Tabs
        type="card"
        activeKey={activeTab}
        style={{ backgroundColor: "rgba(146,191,226,0.8)" }}
        size="small"
        items={menus}
        onTabClick={(active) => {
          setActiveTab(active);
        }}
      /> */}
      <Tabs
        activeKey={activeTab}
        type="card"
        style={{ backgroundColor: "rgba(146,191,226,0.8)" }}
        onTabClick={(active) => {
          setActiveTab(active);
        }}
      >
        {menus.map((r: any, i: number) => {
          return (
            <TabPane
              tab={r.label}
              key={r.key}
              style={{
                backgroundColor: props.isDarkMode
                  ? themeToken.colorDark100
                  : "white",
              }} // Set the background color here
            >
              <div className="p-4">{r.children}</div>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default Menu;
