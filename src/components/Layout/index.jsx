import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout as LayoutAntd, Menu, Spin } from "antd";
import "./layout.css";

import { CoffeeOutlined, UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetListGroup } from "src/api/group";
import ChangePasswordModal from "../ChangePasswordModal";
import CreateGroupModal from "../CreateGroupModal";
import ProfileModal from "../ProfileModal";
const { Header, Sider, Content } = LayoutAntd;

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(0);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const { data: groupData = [] } = useGetListGroup();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const { pathname } = location;

    const key = groupData.findIndex(
      (router) => router.id === pathname.split("/")[2]
    );
    setActiveKey(key);
  }, [location, groupData]);

  console.log(groupData);

  return (
    <Spin spinning={isFetching + isMutating > 0}>
      <LayoutAntd>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo h-[64px] flex items-center justify-center">
            <p className="text-white font-semibold">MIDTERM</p>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            activeKey={[activeKey]}
            items={groupData.map((item) => ({
              label: item.name.toUpperCase(),
              icon: <CoffeeOutlined />,
              key: item.id,
              onClick: () => navigate(`/group/${item.id}`),
            }))}
          />
        </Sider>
        <LayoutAntd className="site-LayoutAntd">
          <Header className="site-layout-background flex items-center justify-between p-0">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <div className="mr-10 mb-2 relative">
              <div className="user-icon-header">
                <UserOutlined className="text-white text-[20px] cursor-pointer hover:opacity-60" />
                <ul className="hidden absolute right-0 top-[100%] bg-white z-10 min-w-[170px] shadow-2xl p-0 m-0 list-none user-icon-header-dropdown transition-all">
                  <li
                    className="text-[14px] leading-1 pl-5 cursor-pointer transition-all duration-200 hover:bg-[#44523f] hover:text-white"
                    onClick={() => setProfileModal(true)}
                  >
                    Profile
                  </li>
                  <li
                    className="text-[14px] pl-5 cursor-pointer transition-all duration-200 hover:bg-[#44523f] hover:text-white"
                    onClick={() => setChangePasswordModal(true)}
                  >
                    Change password
                  </li>
                  <li
                    className="text-[14px] pl-5 cursor-pointer transition-all duration-200 hover:bg-[#44523f] hover:text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </Header>
          <Content className="site-layout-background mx-[16px] my-[24px] p-[24px] min-h-[280px]">
            <Outlet />
            <CreateGroupModal
              visible={createGroupModal}
              setVisible={setCreateGroupModal}
            />
            <ChangePasswordModal
              visible={changePasswordModal}
              setVisible={setChangePasswordModal}
            />
            <ProfileModal visible={profileModal} setVisible={setProfileModal} />
          </Content>
        </LayoutAntd>
      </LayoutAntd>
    </Spin>
  );
};

export default Layout;
