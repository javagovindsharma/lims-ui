import React, { useRef, useState } from "react";
import "../../css/main.css";
import { Tab, Tabs } from "react-bootstrap";
import Configurations from "./Configurations";
import MappingConfigurations from "./MappingConfigurations";
import ListConfiguration from "./ListConfiguration";

const AdminTool = () => {
  const [tab, setTab] = useState("listconfigurations");
  const [subTab, setSubTab] = useState("configurations");
  const [configAction, setConfigAction] = useState("MODIFY");
  const [configId, setConfigId] = useState(0);
  const configref = useRef<Configurations>(null);
  const mappingref = useRef<MappingConfigurations>(null);
  const listref = useRef<ListConfiguration>(null);
  const sendDataToParent = (row: any,action: any) => {
    setTab("createconfigurations");
    setConfigAction(action);
    setConfigId(row.id);
  };
  const getDataToParent = (id: number) => {
    setConfigId(id);
  };
  return (
    <div className="wrapper">
      <Tabs activeKey={tab} onSelect={(currentTab: any) => setTab(currentTab)}>
        <Tab
          eventKey="listconfigurations"
          title="List Configurations"
          mountOnEnter={true}
        >
          <div className="datalist mt-2">
            <ListConfiguration
              ref={listref}
              sendDataToParent={sendDataToParent}
            />
          </div>
        </Tab>
        <Tab
          eventKey="createconfigurations"
          title="Create Configurations"
          mountOnEnter={true}
        >
          <div className="datalist mt-2">
            <Tabs
              activeKey={subTab}
              onSelect={(currentTab: any) => setSubTab(currentTab)}
            >
              <Tab eventKey="configurations" title="Configurations">
                <div className="datalist mt-2">
                  <Configurations
                    ref={configref}
                    mapping={mappingref}
                    configId={configId}
                    configIdSet={getDataToParent}
                    configAction={configAction}
                  />
                </div>
              </Tab>
              <Tab eventKey="mapping" title="Mapping Configuration">
                <div className="datalist mt-2 ml-2">
                  <MappingConfigurations
                    config={configref}
                    ref={mappingref}
                    list={listref}
                  />
                </div>
                {/* <h1>404</h1>
                  <h2>Page under construction !</h2> */}
              </Tab>
            </Tabs>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminTool;
