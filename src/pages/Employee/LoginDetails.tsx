import React from "react";
import { Row, Col, Form, Button, Modal, Alert } from "react-bootstrap";
import "../../css/main.css";

export default class LoginDetails extends React.Component<
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
                     Department :
                  </Form.Label>
                  <Col sm="10">
                     <fieldset>
                        <Row>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="Flow CYTOMERY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="HAEMATOLOGY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="BIOCHEMISTRY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="IMMUNOASSAY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="Immunology"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="SEROLOGY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                        </Row>
                        <Row>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="CLINICAL PATHOLOGY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="MICROBIOLOGY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="MOLECULAR DIAGNOSTIC"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="CYTOLOGY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="HISTOPATHOLOGY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="OTHERS"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                        </Row>
                        <Row>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="Cardiology"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="NEUROPHYSIOLOGIC"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="Pathology Special"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="Molecular Biology"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="SPECIAL TESTS"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="UNOLOGY"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                        </Row>
                        <Row>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="CLICNICAL WELLNESS"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="DS"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="SATPAL"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                        </Row>
                     </fieldset>
                  </Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     Zone :
                  </Form.Label>
                  <Col sm="2">
                     <select className="form-control" value="NA">
                        <option>NA</option>
                     </select>
                  </Col>
                  <Form.Label column sm="2">
                     State :
                  </Form.Label>
                  <Col sm="2">
                     <select className="form-control" value="NA">
                        <option>NA</option>
                     </select>
                  </Col>
                  <Form.Label column sm="1">
                     Centre :
                  </Form.Label>
                  <Col sm="1">
                     <select className="form-control" value="NA">
                        <option>NA</option>
                        <option>A</option>
                        <option>B</option>
                     </select>
                  </Col>
                  <Col sm="1">
                     <button>Add</button>
                  </Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Col sm="2"></Col>
                  <Col sm="10">
                     <fieldset></fieldset>
                  </Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     Default Centre :
                  </Form.Label>
                  <Col sm="2">
                     <select className="form-control" value="NA">
                        <option>NA</option>
                     </select>
                  </Col>
                  <Col sm="8"></Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     Roles :
                  </Form.Label>
                  <Col sm="10">
                     <fieldset>
                        <Row>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="Accounts"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="IT Admin"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="EDP"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                           <Col sm="2">
                              <Form.Check
                                 inline
                                 label="Front Office"
                                 name="group1"
                                 type="checkbox"
                                 id="mobileApp"
                              />
                           </Col>
                        </Row>
                     </fieldset>
                  </Col>
               </Form.Group>

               <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
               >
                  <Form.Label column sm="2">
                     Default Roles :
                  </Form.Label>
                  <Col sm="2">
                     <select className="form-control" value="NA">
                        <option>NA</option>
                     </select>
                  </Col>
                  <Form.Label column sm="1">
                     Is Login Expiry :
                  </Form.Label>
                  <Form.Label column sm="1">
                     Login Expiry Days :
                  </Form.Label>
                  <Col sm="2">
                     <Form.Control
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value=""
                     />
                  </Col>
                  <Col sm="3"></Col>
               </Form.Group>
            </Form>
         </div>
      );
   }
}
