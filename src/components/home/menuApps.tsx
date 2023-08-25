import { useEffect, useState } from "react";
// @ts-ignore
import { Config, callApi } from "@intellinum/flexa-util";
import { Card, Row, Col, Avatar, Spin } from "antd";
import { Link } from "react-router-dom";
import { FaDynamicIcons } from "../atoms";

interface DataItem {
  id: number;
  name: string;
  menu: any;
  icon?: any;
}

export function MenuApps() {
  const [menuList, setMenuList] = useState<DataItem[]>([]);
  const [menuList2, setMenuList2] = useState([]);
  const user = JSON.parse(localStorage.getItem("flexa_auth"));
  const [isHovered, setIsHovered] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuTabs = (dataId) => {
    const selectedData = menuList.find((data) => data.id === dataId);
    setSelectedMenu(selectedData.menu);
    localStorage.setItem("selectedMenu", JSON.stringify(selectedData.menu));
  };

  const handleMouseEnter = (data) => {
    setIsHovered(data);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  function getMenu() {
    //Get All Menu
    const response = callApi(
      Config.prefixUrl +
        "/common/menu/findAllMenu?company=" +
        (user.company || "-1"),
      "GET"
    );
    setIsLoading(true);
    response
      .then((res) => {
        setMenuList(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function getMenu2() {
    const response = callApi(
      Config.prefixUrl + "/common/menu?company=-1&pageNumber=0&size=15",
      "GET"
    );
    // setIsLoading(true);
    response
      .then((res) => {
        setMenuList2(res.data.content);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    getMenu2();
    getMenu();
  }, []);

  const avatarContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5px",
    borderRadius: "8px",
    transition: "background-color 0.3s",
  };

  const allMenus = menuList.flatMap((dataItem) => dataItem.menu);
  const topMenu = menuList2.filter((item) => item.parentMenu == 0);
  const subMenu = menuList2.filter((item) => item.parentMenu !== 0);

  // icon
  const menuParentIcon = menuList.map((dataMenu) => {
    const matchingData = menuList2.find(
      (dataMenuIcon) => dataMenuIcon.name === dataMenu.name
    );
    if (matchingData) {
      return {
        ...dataMenu,
        icon: matchingData.icon,
      };
    }
    return dataMenu;
  });

  if (isLoading) {
    return <Spin />;
  } else {
    return (
      <div>
        <Card style={{ minHeight: "100vh", padding: "15px" }}>
          <Row gutter={[16, 24]}>
            {menuParentIcon.map((item) => (
              <Col
                xs={{ span: 12 }}
                sm={{ span: 8 }}
                md={{ span: 5 }}
                lg={{ span: 3 }}
                key={item.id}
              >
                <Link to="/common/menu-top">
                  <div
                    style={{ paddingTop: "8px", borderRadius: "8px" }}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onClick={() => handleMenuTabs(item.id)}
                  >
                    <div style={avatarContainer}>
                      <Avatar
                        size={64}
                        icon={
                          <FaDynamicIcons
                            name={item.icon}
                            color="rgba(91, 34, 3, 0.6)"
                          />
                        }
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            isHovered && isHovered.id == item.id
                              ? "rgba(229, 130, 76, 0.6)"
                              : "",
                        }}
                      />
                    </div>
                    <h3 style={{ textAlign: "center" }}>{item.name}</h3>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
          <hr />
          <Row gutter={[16, 24]}>
            {subMenu.map((item) => (
              <Col
                xs={{ span: 12 }}
                sm={{ span: 8 }}
                md={{ span: 5 }}
                lg={{ span: 3 }}
                key={item.id}
              >
                <Link to={item.module.applicationPath}>
                  <div
                    style={{ paddingTop: "8px", borderRadius: "8px" }}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={() => handleMouseEnter(item)}
                  >
                    <div style={avatarContainer}>
                      <Avatar
                        size={64}
                        icon={
                          <FaDynamicIcons
                            name={item.icon}
                            color="rgba(91, 34, 3, 0.6)"
                          />
                        }
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            isHovered && isHovered.id == item.id
                              ? "rgba(229, 130, 76, 0.6)"
                              : "",
                        }}
                      />
                    </div>
                    <h3 style={{ textAlign: "center" }}>{item.name}</h3>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    );
  }
}
