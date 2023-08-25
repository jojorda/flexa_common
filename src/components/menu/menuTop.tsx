import { useEffect, useCallback, useState, useMemo } from "react";
// @ts-ignore
import { Config, showMessage, callApi, TreeMenu } from "@intellinum/flexa-util";
import { message, Card, Row, Col, Avatar } from "antd";
import { Link } from "react-router-dom";

interface DataItem {
  id: number;
  name: string;
  menu: any;
}

export function MenuTop() {
  const [menuList, setMenuList] = useState<DataItem[]>([]);
  const user = JSON.parse(localStorage.getItem("flexa_auth"));
  const [isHovered, setIsHovered] = useState(null);

  const handleMouseEnter = (data) => {
    setIsHovered(data);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  // console.log("menuni", menuList);

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

  // console.log("menu2", menuList2);

  useEffect(() => {
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
  const [selectedMenu, setSelectedMenu] = useState([]);

  const handleMenuTabs = (dataId) => {
    const selectedData = menuList.find((data) => data.id === dataId);
    console.log("selected Data", selectedData);
    setSelectedMenu(selectedData.menu);
    localStorage.setItem("selectedMenu", JSON.stringify(selectedData.menu));
  };

  return (
    <div>
      <Row gutter={[16, 24]}>
        {menuList.map((item) => (
          <Col span={4} key={item.id}>
            <div
              style={{
                // backgroundColor:
                //   isHovered && isHovered.id == item.id ? "pink" : "",
                paddingTop: "8px",
                borderRadius: "8px",
              }}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => handleMouseEnter(item)}
              onClick={() => handleMenuTabs(item.id)}
            >
              <div style={avatarContainer}>
                <Avatar
                  size={64}
                  icon={<>i</>}
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
          </Col>
        ))}
      </Row>
    </div>
  );
}
