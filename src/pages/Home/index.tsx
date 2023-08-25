import { Card } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { FaDynamicIcons } from "../../components/atoms";
import { callApi } from "../../config/callApi";
import { Config } from "../../config/config";
// @ts-ignore
import { themeToken, Config as UtilConfig } from "@intellinum/flexa-util";

type Props = { isDarkMode: boolean };

const Home = (props: Props) => {
  const { isDarkMode } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [idDashboard, setIdDashboard] = useState([]);
  const apiUrlDashboard = Config.prefixUrl + "/reporting/dashboard";
  const getDashboard = () => {
    setIsLoading(true);
    const response = callApi(apiUrlDashboard, "GET", null);
    response.then((res) => {
      setIdDashboard(res.data.content[0].id);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const menus = useMemo(() => {
    const menus = JSON.parse(localStorage.getItem("userMenu"));

    const resultMenu = menus.map((r) => {
      return {
        path:
          r.name.toLowerCase() === "reporting"
            ? `/dashboard/show-dashboard/${idDashboard}`
            : r.menu?.find((res: any, ind: number) => ind === 0)?.path || "/",
        icon: r.icon,
        name: r.name,
        id: r.id,
      };
    });
    return resultMenu;
  }, [idDashboard]);

  if (isLoading) {
    return (
      <div className="flex justify-center my-6">
        <Spin />
      </div>
    );
  }
  return (
    <div>
      <div className=" h-full">
        {menus.map((item, i) => (
          <div key={"iitem-" + i} className="col-4 col-md-3 p-4 ">
            <Link
              to={item.path}
              className="clickable d-flex flex-column justify-content-center align-items-center"
            >
              <div
                className="res-menu-icon  rounded-circle d-flex flex-column justify-content-center align-items-center"
                style={{
                  border: `2px solid ${
                    isDarkMode ? "white" : themeToken.colorDark400
                  }`,
                }}
              >
                <span className="res-menu-icon-icon d-flex align-items-center">
                  <FaDynamicIcons
                    name={item.icon}
                    color={isDarkMode ? "white" : themeToken.colorDark400}
                  />
                </span>
              </div>
              <h3
                style={{
                  textAlign: "center",

                  color: isDarkMode ? "white" : themeToken.colorDark400,
                }}
                className="mt-3 fs-4 fs-md-1"
              >
                {item.name}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
