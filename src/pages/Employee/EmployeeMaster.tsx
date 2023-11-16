import React, { useRef, useState } from "react";
import "../../css/main.css";
import { Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import EmployeeDetails from "./EmployeeDetails";
import PersonalDetails from "./PersonalDetails";
import LoginDetails from "./LoginDetails";

const EmployeeMaster = () => {
   const [tab, setTab] = useState("employeeDetails");
   const [employeeId, setEmployeeId] = useState(0);
   const [employeeName, setEmployeeName] = useState("");
   const employeref = useRef<EmployeeDetails>(null);

   const sendDataToParent = (row: any, action: any) => {
      setTab("employeeDetails");
      setEmployeeId(row.id);
   };
   const getDataToParent = (id: number) => {
      setEmployeeId(id);
   };

   return (
      <div className="wrapper">
         <Row>
            <h3>Employee Registration</h3>
         </Row>
         <Row>
            <Col>
               <Form.Label >
                  Employee Name
               </Form.Label>
             </Col>
             <Col>  
               <Form.Control
                  type="text"
                  id="employeeName"
                  name="name"
                  value={employeeName}
               />
            </Col>
            <Col></Col><Col></Col>
         </Row>
         <Tabs
            activeKey={tab}
            onSelect={(currentTab: any) => setTab(currentTab)}
         >
            <Tab
               eventKey="employeeDetails"
               title="Employee Details"
               mountOnEnter={true}
            >
               <div className="datalist mt-2">
                  <EmployeeDetails
                     employeref={employeref}
                     employeeId={employeeId}
                  />
               </div>
            </Tab>
            <Tab
               eventKey="personalDetails"
               title="Personal Details"
               mountOnEnter={true}
            >
               <div className="datalist mt-2">
                  <PersonalDetails
                     employeref={employeref}
                     employeeId={employeeId}
                  />
               </div>
            </Tab>
            <Tab
               eventKey="loginDetails"
               title="Login Details"
               mountOnEnter={true}
            >
               <div className="datalist mt-2">
                  <LoginDetails
                     employeref={employeref}
                     employeeId={employeeId}
                  />
               </div>
            </Tab>
         </Tabs>
      </div>
   );
};

export default EmployeeMaster;
