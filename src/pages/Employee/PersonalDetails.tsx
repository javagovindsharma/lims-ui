import React from "react";
import { Row, Col, Form, Button, Modal, Alert } from "react-bootstrap";
import "../../css/main.css";

export default class PersonalDetails extends React.Component<
   { employeref: any; employeeId: number },
   {}
> {
   state: any = {
      showSubmitModal: true,
      submitError: false,
   };

   initialState: any;

   constructor(props: { employeref: any; employeeId: number }) {
      super(props);
      this.initialState = this.state;
   }

   render() {
      return (
         <div className="GridWrapper">
            <Form>
               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     Father Name :
                  </Form.Label>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeCode"
                        name="employeeCode"
                        value=""
                     />
                  </Col>
                  <Form.Label column sm="2">
                     Mother Name :
                  </Form.Label>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeCode"
                        name="employeeCode"
                        value=""
                     />
                  </Col>
                  <Form.Label column sm="2"></Form.Label>
                  <Col sm="2"></Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     Date of Birth :
                  </Form.Label>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Label>Qualification :</Form.Label>
                  </Col>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Label>ESI Number :</Form.Label>
                  </Col>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     EPF Number :
                  </Form.Label>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Label>Pan No :</Form.Label>
                  </Col>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Label>Passport No. :</Form.Label>
                  </Col>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     Sart Date :
                  </Form.Label>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Label>Blood Group :</Form.Label>
                  </Col>
                  <Col sm="2">
                     <select className="form-control" value="NA">
                        <option>AB-</option>
                     </select>
                  </Col>
                  <Col sm="2"></Col>
                  <Col sm="2"></Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Col sm="2">
                     <Form.Check
                        inline
                        label="Access Mobile App"
                        name="group1"
                        type="checkbox"
                        id="mobileApp"
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Check
                        inline
                        label="Allow Sharing"
                        name="group1"
                        type="checkbox"
                        id="allowsharing"
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Check
                        inline
                        label="Aprove Special Rate"
                        name="group1"
                        type="checkbox"
                        id="mobileApp"
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Check
                        inline
                        label="Amr Value Access"
                        name="group1"
                        type="checkbox"
                        id="mobileApp"
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Check
                        inline
                        label="Hide Rate"
                        name="group1"
                        type="checkbox"
                        id="mobileApp"
                     />
                  </Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Col sm="5">
                     <Form.Check
                        inline
                        label="Can Save/Approve amendment of machine reading"
                        name="group1"
                        type="checkbox"
                        id="mobileApp"
                     />
                  </Col>
                  <Col sm="3">
                     <Form.Check
                        inline
                        label="Simple Logistic Reject"
                        name="group1"
                        type="checkbox"
                        id="mobileApp"
                     />
                  </Col>
                  <Col sm="4">
                     <Form.Check
                        inline
                        label="Global Report Access"
                        name="group1"
                        type="checkbox"
                        id="mobileApp"
                     />
                  </Col>
               </Form.Group>
            </Form>
         </div>
      );
   }
}
