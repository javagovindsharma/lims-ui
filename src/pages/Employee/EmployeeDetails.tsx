import React from "react";
import { Row, Col, Button, Modal, Alert, Form } from "react-bootstrap";
import "../../css/main.css";

export default class EmployeeDetails extends React.Component<
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
                     Employee Code :
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
                  <Col sm="2">
                     <select className="form-control" value="NA">
                        <option>NA</option>
                     </select>
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
                     Name :
                  </Form.Label>
                  <Col sm="1">
                     <select className="form-control" value="NA">
                        <option>Mr.</option>
                     </select>
                  </Col>
                  <Col sm="1">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
                  <Col sm="2">
                     <Form.Label>Designation :</Form.Label>
                  </Col>
                  <Col sm="2">
                     <select className="form-control" value="NA">
                        <option>Select</option>
                     </select>
                  </Col>
                  <Col sm="2">
                     <button>New</button>
                  </Col>
                  <Col sm="2"></Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     Street No :
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
                     <Form.Label>Locality :</Form.Label>
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
                     <Form.Label>City :</Form.Label>
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
               <Row>
                  <strong> Office Address :</strong>
               </Row>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     House No
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
                     <Form.Label>Street No :</Form.Label>
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
                     <Form.Label>Locality :</Form.Label>
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
                     City :
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
                     <Form.Label>Pin Code :</Form.Label>
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
                     <Form.Label>Email :</Form.Label>
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
                     Phone No :
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
                     <Form.Label>Mobile :</Form.Label>
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
                     
                  </Col>
                  <Col sm="2">
                   
                  </Col>
               </Form.Group>
            </Form>
         </div>
      );
   }
}
