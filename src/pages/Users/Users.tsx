import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import "../../css/main.css";

import UserTable from "../Users/UserTable";
import GroupTable from "./GroupTable";

//var history = useHistory();

const Users = () => {
  const [tab, setTab] = useState("groups");
  const [assetMgr, setAssetMgr] = useState("");
  const [actionOccured, setActionOccured] = useState(false);

  const settingAssetMgr = (assetMgr: any) => {
    setTab("users");
    setAssetMgr(assetMgr);
  };
  return (
    <div className="GridWrapper">
      <div className="wrapper">
        <h1>User Management Dashboard</h1>
        <Tabs
          activeKey={tab}
          onSelect={(currentTab: any) => {
            setTab(currentTab);
            setAssetMgr("");
          }}
        >
          <Tab.Pane eventKey="groups" title="Groups" mountOnEnter={true}>
            <div className="datalist mt-2">
              <GroupTable
                SetAssetgr={settingAssetMgr}
                tab={actionOccured}
                setAction={setActionOccured}
              />
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="users" title="Users" mountOnEnter={true}>
            <div className="datalist mt-2">
              <UserTable assetMgr={assetMgr} setAction={setActionOccured} />
            </div>
          </Tab.Pane>
        </Tabs>
      </div>
    </div>
  );
};

export default Users;
