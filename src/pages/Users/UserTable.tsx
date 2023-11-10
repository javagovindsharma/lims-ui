/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
//import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import styled from "styled-components";
import PaginationComponent from "../../components/common/PaginationComponent";
import TableLoader from "../../components/common/TableLoader";
import "../../css/main.css";
import { usersDataFields, usersLabels } from "../../helpers/constants";
import { allReportDateFormatter } from "../../helpers/tableHelpers";
import { UserUtils } from "../../lib/authenticationUtils";
import store from "../../store";
import {
  initialUser,
  initialUserResponse,
  newUserInitial,
} from "../../types/User";
import { getAssetManagersByCustomerId } from "../Administration/ConfigurationService";
import {
  AddUser,
  DeleteUser,
  getUsers,
  resendUserEmail,
  UpdateUser,
} from "./UserService";

const Expand = styled.div`
  .table-expand-column {
    background: rgba(0, 0, 0, 0.05);
  }
`;
const Switch = styled.div`
  .form-check {
    padding-top: calc(0.625rem + 1px);
    padding-bottom: calc(0.625rem + 1px);
  }
`;

const UserTable = (props: any) => {
  const mystyle = {
    whiteSpace: "pre-wrap",
    padding: "10px",
  } as React.CSSProperties;

  const switchStyle = {
    paddingTop: "calc(0.625rem+1px)",
  } as React.CSSProperties;

  const [userGroupRecords, setUserGroupRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(-2);
  const [totalItems, setTotalItems] = useState(0);
  const [usersOnPage, setUsersOnPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUser, setNewUser] = useState(newUserInitial);
  const [validEmailCheck, setvalidEmailCheck] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialUser);
  const [assetManagers, setAssetManagers] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responeStatus, setResponeStatus] = useState(initialUserResponse);
  const [resendResponse, setResendResponse] = useState(false);
  const [timeZone, setTimeZone] = useState(
    store.getState().auth.userSetting.timeZone
  );

  const emailTarget = useRef(null);
  const firstNameTarget = useRef<HTMLInputElement>(null);
  const lastNameTarget = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentPage(0);
    setTotalPages(-2);
    setUserGroupRecords([]);
    getUser(currentPage, 10, props.assetMgr);
    getAssetManagersByCustomerId(UserUtils.getUser()?.customerId)
      .then((res) => {
        setAssetManagers(res);
      })
      .catch((err) => {
        setAssetManagers([]);
      });
  }, [props.assetMgr]);

  useEffect(() => {
    if (timeZone !== store.getState().auth.userSetting.timeZone) {
      setCurrentPage(0);
      setTotalPages(-2);
      setUserGroupRecords([]);
      getUser(currentPage, 10, props.assetMgr);
      getAssetManagersByCustomerId(UserUtils.getUser()?.customerId)
        .then((res) => {
          setAssetManagers(res);
        })
        .catch((err) => {
          setAssetManagers([]);
        });
      setTimeZone(store.getState().auth.userSetting.timeZone);
    }
  }, [store.getState().auth.userSetting.timeZone]);

  const getUser = (currentPage: any, sizePerPage: any, assetManager: any) => {
    getUsers(currentPage, sizePerPage, assetManager).then((res) => {
      const userGroup = res.content ? res.content : [];
      setTotalPages(res.totalPages);
      setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
      setUserGroupRecords(userGroup);
      setUsersOnPage(res.numberOfElements);
    });
  };

  const rowCheck: any = {
    mode: "radio",
    selectColumnPosition: "left",
    selected: selectedRow,
    onSelect: (row: any, isSelect: any, rowIndex: any, e: any) =>
      handleOnSelect(row, isSelect),
  };

  function handleOnSelect(row: any, isSelect: any) {
    if (isSelect) {
      setSelectedRow([]);
      setSelectedRow([row.email]);
      var ihubuser = initialUser;
      ihubuser.firstname = row.firstname;
      ihubuser.lastname = row.lastname;
      ihubuser.email = row.email;
      if (row.assetmgr !== null) {
        ihubuser.assetMgr = row.assetmgr;
        ihubuser.isSuperUser = "No";
      } else {
        ihubuser.assetMgr = "";
        ihubuser.isSuperUser = "Yes";
      }
      setSelectedUser(ihubuser);
    } else {
      setSelectedRow(selectedRow.filter((x) => x !== row.email));
    }
  }

  const usersColumns = [
    {
      dataField: usersDataFields.FIRST_NAME.text,
      text: usersLabels.FIRST_NAME.text,
      sort: true,
      headerStyle: mystyle,
      key: 1,
    },
    {
      dataField: usersDataFields.LAST_NAME.text,
      text: usersLabels.LAST_NAME.text,
      sort: true,
      headerStyle: mystyle,
      key: 2,
    },
    {
      dataField: usersDataFields.EMAIL.text,
      text: usersLabels.EMAIL.text,
      sort: true,
      headerStyle: mystyle,
      key: 3,
    },
    {
      dataField: usersDataFields.ROLE.text,
      text: usersLabels.ROLE.text,
      sort: true,
      headerStyle: mystyle,
      key: 4,
    },
    {
      dataField: usersDataFields.ASSET_MANAGER.text,
      text: usersLabels.ASSET_MANAGER.text,
      sort: true,
      headerStyle: mystyle,
      key: 5,
    },
    {
      dataField: usersDataFields.CREATED_TIME.text,
      text: usersLabels.CREATED_TIME.text,
      sort: true,
      headerStyle: mystyle,
      formatter: allReportDateFormatter,
      key: 6,
    },
    {
      dataField: usersDataFields.LAST_LOGIN_TIME.text,
      text: usersLabels.LAST_LOGIN_TIME.text,
      sort: true,
      headerStyle: mystyle,
      formatter: allReportDateFormatter,
      key: 7,
    },
  ];

  const pageChange = (event: any) => {
    setCurrentPage(event);
    setUserGroupRecords([]);
    setTotalPages(-2);
    getUser(event, usersPerPage, props.assetMgr);
  };

  const sizeChange = (event: any) => {
    setCurrentPage(0);
    setUsersPerPage(event);
    setUserGroupRecords([]);
    setTotalPages(-2);
    getUser(0, event, props.assetMgr);
  };

  const handleAddSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    setvalidEmailCheck(true);
    if (form.checkValidity()) {
      AddUser(newUser)
        .then((res) => {
          setShowAddModal(false);
          setShowResponseModal(true);
          if (res.status === 200) {
            setNewUser({ ...newUserInitial });
            setResponeStatus({
              email: res.data.email,
              status: "OK",
              action: "Added",
            });
            props.setAction(true);
          } else {
            if (res.data.endsWith(UserUtils.getUser()?.customerId)) {
              var resp = res.data;
              resp = resp.slice(0, resp.length - 3);
              setResponeStatus({
                email: newUser.email,
                status: "NOT OK",
                action: resp + store.getState().auth.data,
              });
            } else {
              setResponeStatus({
                email: newUser.email,
                status: "NOT OK",
                action: res.data,
              });
            }
          }
          setNewUser(newUserInitial);
        })
        .catch((err) => {
          setShowEditModal(false);
          setShowResponseModal(true);
          setResponeStatus({
            email: newUser.email,
            status: "NOT OK",
            action: "There is a problem with your request. Please try again",
          });
        });
    }
  };

  function editNewUser(event: { target: { name: any; value: any } }) {
    var NewUser = newUser;
    if (event.target.name === "newassetMgrs") {
      NewUser.assetMgr = event.target.value;
    }
    if (event.target.name === "newfirstname") {
      NewUser.firstname = event.target.value;
    }
    if (event.target.name === "newlastname") {
      NewUser.lastname = event.target.value;
    }
    if (event.target.name === "newisSuperUser") {
      NewUser.isSuperUser = event.target.value;
    }
    if (event.target.name === "newemail") {
      NewUser.email = event.target.value;
    }
    setNewUser(NewUser);
  }
  function AddUserModal(props: any) {
    return (
      <Modal
        {...props}
        name="addGroup"
        // name={this.state.dataModal.data.length}
      >
        <Form
          noValidate
          validated={validEmailCheck}
          onSubmit={handleAddSubmit}
          method="post"
        >
          <div className="modal-content">
            <Modal.Header closeButton translate="true">
              <Modal.Title> Add New User </Modal.Title>
            </Modal.Header>

            <div className="modal-body">
              <Modal.Body>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Email
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus={true}
                      type="text"
                      placeholder="Please enter valid email address"
                      name="newemail"
                      id="newemail"
                      key="newemail"
                      defaultValue={newUser.email}
                      onChange={editNewUser}
                      ref={emailTarget}
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter an valid email address (only smallcase)
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    First Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      placeholder="Enter First Name for User"
                      name="newfirstname"
                      key="newfirstname"
                      id="newfirstname"
                      defaultValue={newUser.firstname}
                      onChange={editNewUser}
                      ref={firstNameTarget}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter value for First Name
                    </Form.Control.Feedback>
                  </Col>
                  <Form.Control.Feedback type="valid">
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Last Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      type="text"
                      name="newlastname"
                      placeholder="Enter the Last Name of the User"
                      id="newlastname"
                      key="newlastname"
                      defaultValue={newUser.lastname}
                      onChange={editNewUser}
                      ref={lastNameTarget}
                      required
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Super User
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      as="select"
                      name="isSuperUser"
                      placeholder="Enter the full Name of the Group"
                      id="newisSuperUser"
                      key="newisSuperUser"
                      //  onChange={editnewUser}
                      //  ref={longNameTarget}
                      required
                      onChange={(event) =>
                        setNewUser({
                          ...newUser,
                          isSuperUser: event.target.value,
                          assetMgr: "",
                        })
                      }
                    >
                      <option
                        key="Yes"
                        value="Yes"
                        selected={newUser.isSuperUser === "Yes"}
                      >
                        Yes
                      </option>
                      <option
                        key="No"
                        value="No"
                        selected={newUser.isSuperUser === "No"}
                      >
                        No
                      </option>
                    </Form.Control>

                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Asset Manager Group
                  </Form.Label>
                  <Col sm="8">
                    <Switch>
                      <Form.Control
                        autoFocus
                        as="select"
                        name="newassetMgrs"
                        placeholder="Enter the full Name of the Group"
                        id="newassetMgrs"
                        key="newassetMgrs"
                        //  onChange={editnewUser}
                        //  ref={longNameTarget}
                        required
                        disabled={newUser.isSuperUser === "Yes"}
                        onChange={editNewUser}
                      >
                        <option value="" selected disabled>
                          Select Asset Manager
                        </option>
                        {assetManagers.map((assetManager) => (
                          <option value={assetManager} key={assetManager}>
                            {assetManager}
                          </option>
                        ))}
                      </Form.Control>
                    </Switch>

                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Modal.Body>
            </div>
            <div className="modal-footer">
              <Button type="submit" variant="outline-primary">
                Submit
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setNewUser(newUserInitial);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }

  function editUser(event: { target: { name: any; value: any } }) {
    var NewUser = selectedUser;
    if (event.target.name === "assetMgrs") {
      NewUser.assetMgr = event.target.value;
    }
    if (event.target.name === "firstname") {
      NewUser.firstname = event.target.value;
    }
    if (event.target.name === "lastname") {
      NewUser.lastname = event.target.value;
    }
    if (event.target.name === "isSuperUser") {
      NewUser.isSuperUser = event.target.value;
    }
    if (event.target.name === "email") {
      NewUser.email = event.target.value;
    }
    setSelectedUser(NewUser);
  }

  const handleEditSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    setvalidEmailCheck(true);
    if (form.checkValidity()) {
      UpdateUser(selectedUser)
        .then((res) => {
          setShowEditModal(false);
          setShowResponseModal(true);
          if (res.status === 200) {
            setResponeStatus({
              email: selectedUser.email,
              status: "OK",
              action: "Updated",
            });
            props.setAction(true);
          } else {
            setResponeStatus({
              email: selectedUser.email,
              status: "NOT OK",
              action: res.data,
            });
          }
        })
        .catch((err) => {
          setShowEditModal(false);
          setShowResponseModal(true);
          setResponeStatus({
            email: selectedUser.email,
            status: "NOT OK",
            action: "There is a problem with your request. Please try again",
          });
        });
    }
  };

  function EditUserModal(props: any) {
    if (selectedRow.length === 0) {
      return (
        <Modal {...props} name="addGroup">
          {" "}
          <Modal.Header closeButton translate="true">
            <Modal.Title id="example-custom-modal-styling-title">
              No User Selected
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert key="alert" variant="danger">
              Please select any user to update it !!
            </Alert>
          </Modal.Body>
        </Modal>
      );
    }

    return (
      <Modal
        {...props}
        name="addGroup"
        // name={this.state.dataModal.data.length}
      >
        <Form
          noValidate
          validated={validEmailCheck}
          onSubmit={handleEditSubmit}
          method="post"
        >
          <div className="modal-content">
            <Modal.Header closeButton translate="true">
              <Modal.Title> Edit User </Modal.Title>
            </Modal.Header>

            <div className="modal-body">
              <Modal.Body>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Email
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus={true}
                      type="text"
                      placeholder="Enter valid email address"
                      name="email"
                      id="email"
                      key="email"
                      defaultValue={selectedUser.email}
                      ref={emailTarget}
                      required
                      disabled
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter an valid email address (only smallcase)
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    First Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      placeholder="Enter First Name for User"
                      name="firstname"
                      key="firstname"
                      id="firstname"
                      defaultValue={selectedUser.firstname}
                      onChange={editUser}
                      ref={firstNameTarget}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter value for First Name
                    </Form.Control.Feedback>
                  </Col>
                  <Form.Control.Feedback type="valid">
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Last Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      type="text"
                      name="lastname"
                      placeholder="Enter Last Name of the User"
                      id="lastname"
                      key="lastname"
                      defaultValue={selectedUser.lastname}
                      onChange={editUser}
                      ref={lastNameTarget}
                      required
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Super User
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      as="select"
                      name="isSuperUser"
                      placeholder="Enter the full Name of the Group"
                      id="isSuperUser"
                      key="isSuperUser"
                      //  onChange={editnewUser}
                      //  ref={longNameTarget}
                      required
                      disabled
                    >
                      <option
                        key="Yes"
                        value="Yes"
                        selected={selectedUser.isSuperUser === "Yes"}
                      >
                        Yes
                      </option>
                      <option
                        key="No"
                        value="No"
                        selected={selectedUser.isSuperUser === "No"}
                      >
                        No
                      </option>
                    </Form.Control>

                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Asset Manager Group
                  </Form.Label>
                  <Col sm="8">
                    <Switch>
                      <Form.Control
                        autoFocus
                        as="select"
                        name="assetMgrs"
                        placeholder="Enter the full Name of the Group"
                        id="assetMgrs"
                        key="assetMgrs"
                        //  onChange={editnewUser}
                        //  ref={longNameTarget}
                        required
                        disabled
                        onChange={editUser}
                      >
                        <option value="" disabled selected>
                          Select Asset Manager
                        </option>
                        {}
                        {selectedUser.assetMgr.length > 0 &&
                          assetManagers.map((assetManager) => (
                            <option
                              key={assetManager}
                              value={assetManager}
                              selected={selectedUser.assetMgr === assetManager}
                            >
                              {assetManager}
                            </option>
                          ))}
                      </Form.Control>
                    </Switch>

                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Modal.Body>
            </div>
            <div className="modal-footer">
              <Button type="submit" variant="outline-primary">
                Submit
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowEditModal(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }

  function resendMail() {
    resendUserEmail(selectedUser.email)
      .then((res) => {
        setResendResponse(true);
        if (res.status === 200) {
          setResponeStatus({
            email: selectedUser.email,
            status: "OK",
            action: "Added",
          });
        } else {
          setResponeStatus({
            email: selectedUser.email,
            status: "NOT OK",
            action: res.response.data,
          });
        }
      })
      .catch((err) => {
        setShowResponseModal(true);
        setResponeStatus({
          email: newUser.email,
          status: "NOT OK",
          action: "There is a problem with your request. Please try again",
        });
      });
  }

  const handleDeleteSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    setvalidEmailCheck(true);
    if (form.checkValidity()) {
      DeleteUser(selectedUser)
        .then((res) => {
          if (res.status === 200) {
            setShowDeleteModal(false);
            setShowResponseModal(true);
            setResponeStatus({
              email: selectedUser.email,
              status: "OK",
              action: "Deleted",
            });
            props.setAction(true);
          } else {
            setShowDeleteModal(false);
            setShowResponseModal(true);
            setResponeStatus({
              email: selectedUser.email,
              status: "NOT OK",
              action: res.data,
            });
          }
        })
        .catch((err) => {
          setShowDeleteModal(false);
          setShowResponseModal(true);
          setResponeStatus({
            email: selectedUser.email,
            status: "NOT OK",
            action: "There is a problem with your request. Please try again",
          });
        });
    }
  };

  function DeleteUserModal(props: any) {
    if (selectedRow.length === 0) {
      return (
        <Modal {...props} name="addGroup">
          {" "}
          <Modal.Header closeButton translate="true">
            <Modal.Title id="example-custom-modal-styling-title">
              No User Selected
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert key="alert" variant="danger">
              Please select any user to delete it !!
            </Alert>
          </Modal.Body>
        </Modal>
      );
    }

    return (
      <Modal
        {...props}
        name="addGroup"
        // name={this.state.dataModal.data.length}
      >
        <Form
          noValidate
          validated={validEmailCheck}
          onSubmit={handleDeleteSubmit}
          method="post"
        >
          <div className="modal-content">
            <Modal.Header closeButton translate="true">
              <Modal.Title> Delete User </Modal.Title>
            </Modal.Header>

            <div className="modal-body">
              <Modal.Body>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Email
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus={true}
                      type="text"
                      placeholder="Please enter valid email address"
                      name="email"
                      id="email"
                      key="email"
                      defaultValue={selectedUser.email}
                      ref={emailTarget}
                      required
                      disabled
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter an valid email address (only smallcase)
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    First Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      placeholder="Enter Short Name for Group"
                      name="firstname"
                      key="firstname"
                      id="firstname"
                      defaultValue={selectedUser.firstname}
                      onChange={editUser}
                      ref={firstNameTarget}
                      required
                      disabled
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter value for First Name
                    </Form.Control.Feedback>
                  </Col>
                  <Form.Control.Feedback type="valid">
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Last Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      type="text"
                      name="lastname"
                      placeholder="Enter the full Name of the Group"
                      id="lastname"
                      key="lastname"
                      defaultValue={selectedUser.lastname}
                      onChange={editUser}
                      ref={lastNameTarget}
                      required
                      disabled
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Super User
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      as="select"
                      name="isSuperUser"
                      placeholder="Enter the full Name of the Group"
                      id="isSuperUser"
                      key="isSuperUser"
                      //  onChange={editnewUser}
                      //  ref={longNameTarget}
                      required
                      disabled
                    >
                      <option
                        key="Yes"
                        value="Yes"
                        selected={selectedUser.isSuperUser === "Yes"}
                      >
                        Yes
                      </option>
                      <option
                        key="No"
                        value="No"
                        selected={selectedUser.isSuperUser === "No"}
                      >
                        No
                      </option>
                    </Form.Control>

                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Asset Manager Group
                  </Form.Label>
                  <Col sm="8">
                    <Switch>
                      <Form.Control
                        autoFocus
                        as="select"
                        name="assetMgrs"
                        placeholder="Enter the full Name of the Group"
                        id="assetMgrs"
                        key="assetMgrs"
                        //  onChange={editnewUser}
                        //  ref={longNameTarget}
                        required
                        disabled
                        onChange={editUser}
                      >
                        <option value="" disabled selected>
                          Select Asset Manager
                        </option>
                        {}
                        {selectedUser.assetMgr.length > 0 &&
                          assetManagers.map((assetManager) => (
                            <option
                              key={assetManager}
                              value={assetManager}
                              selected={selectedUser.assetMgr === assetManager}
                            >
                              {assetManager}
                            </option>
                          ))}
                      </Form.Control>
                    </Switch>

                    <Form.Control.Feedback type="invalid">
                      Please enter value for Last Name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Modal.Body>
            </div>
            <div className="modal-footer">
              <Button type="submit" variant="outline-primary">
                Submit
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }

  function ResendResponse(props: any) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body>
          <Alert
            key={Math.random().toString()}
            variant={props.status.status === "OK" ? "success" : "danger"}
          >
            {props.status.status === "OK"
              ? "Verification email resent to " + props.status.email
              : props.status.action}
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }

  function ResponseModal(props: any) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body>
          <Alert
            key={Math.random().toString()}
            variant={props.status.status === "OK" ? "success" : "danger"}
          >
            {props.status.status === "OK"
              ? "User with email " +
                props.status.email +
                " is successfully " +
                props.status.action
              : props.status.action}
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }
  const ActionButtons = (
    <>
      {" "}
      <Button
        variant="outline-success"
        onClick={() => {
          setShowAddModal(true);
          setNewUser(newUserInitial);
        }}
      >
        Add User
      </Button>
      <Button variant="outline-primary" onClick={() => setShowEditModal(true)}>
        Edit User
      </Button>
      <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
        Delete User
      </Button>
      <Button
        variant="outline-info"
        hidden={selectedRow.length > 0 ? false : true}
        onClick={resendMail}
      >
        Resend Verification Email
      </Button>
    </>
  );

  const TableModals = (
    <>
      <AddUserModal show={showAddModal} onHide={() => setShowAddModal(false)} />
      <EditUserModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
      />
      <DeleteUserModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      />
      <ResponseModal
        show={showResponseModal}
        onHide={() => {
          setShowResponseModal(false);
          setNewUser({ ...initialUser });
          setCurrentPage(0);
          setTotalPages(-2);
          setUserGroupRecords([]);
          setSelectedRow([]);
          getUser(0, 10, props.assetMgr);
        }}
        status={responeStatus}
      />
      <ResendResponse
        show={resendResponse}
        onHide={() => {
          setResendResponse(false);
          setSelectedRow([]);
        }}
        status={responeStatus}
      />
    </>
  );

  const NoDataIndication = () => (
    <>
      {totalPages === -2 && <TableLoader />}
      {totalPages === 0 && <b>No Record Found</b>}
      {totalPages === -3 && (
        <b style={{ color: "red" }}>There is a Problem in getting data</b>
      )}
    </>
  );
  const Pagination = (
    <PaginationComponent
      numberOfPages={totalPages}
      currentPage={currentPage}
      sizeChange={sizeChange}
      changePage={pageChange}
      sizePerPage={usersPerPage}
      itemOnPage={usersOnPage}
      totalItems={totalItems}
    />
  );
  return (
    <Expand>
      {ActionButtons}
      <br />
      <ToolkitProvider
        keyField="email"
        data={userGroupRecords}
        columns={usersColumns}
        //  columnToggle
        search
        columnToggle={true}
      >
        {(props) => (
          <div style={{ width: "100%", backgroundColor: "white" }}>
            <BootstrapTable
              {...props.baseProps}
              //condensed={true}
              bordered={true}
              selectRow={rowCheck}
              noDataIndication={() => <NoDataIndication />}
            />
            {totalPages > 0 && Pagination}
          </div>
        )}
      </ToolkitProvider>
      {TableModals}
    </Expand>
  );
};

export default UserTable;
