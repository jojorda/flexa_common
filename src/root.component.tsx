import { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
//@ts-ignore
import * as Util from "@intellinum/flexa-util";
const { PageLayout, themeToken, OfflineSupport, Config } = Util;
import { ConfigProvider, Layout } from "antd";
// import { Home } from "./components/home/home";
import { MenuTabsLStorage } from "./components/menuAll/menuTabsLStorage";
import { Home, TabMenu } from "./pages";
import "./style/global.css";
import { ModuleAction } from "./pages/ModuleAction";
import { Profi } from "./pages/Profile/index";
const { Header, Footer, Sider, Content } = Layout;

export default function Root(props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider theme={{ token: themeToken }}>
      <>
        <OfflineSupport />
        <Router>
          <APP />
        </Router>
      </>
    </ConfigProvider>
  );
}

const APP = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      navigate={navigate}
      pageContent={({ isDarkMode }) => {
        return (
          <Routes>
            <>
              <Route
                path="/common"
                element={<Home isDarkMode={isDarkMode} />}
              />
              <Route
                path="/common/:activetab"
                element={<TabMenu isDarkMode={isDarkMode} />}
              />
              <Route
                path="/common/module-action/:moduleId"
                element={<ModuleAction />}
              />
              {/* <Route path="/common/user" element={<UserList />} />
                  <Route path="/common/company" element={<CompanyList />} />
                  <Route path="/common/role" element={<RoleList />} />
                  <Route path="/common/module" element={<ModuleList />} />
                  <Route path="/common/menu" element={<MenuList />} />
                  <Route path="/common/menu-tabs" element={<SubMenuTabs />} /> */}
              <Route path="/common/menu-top" element={<MenuTabsLStorage />} />
              <Route path="/common/company-profile" element={<Profi />} />
            </>
          </Routes>
        );
      }}
    />
  );
};
