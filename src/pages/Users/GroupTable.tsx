/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
//import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import styled from "styled-components";
import LoaderContent from "../../components/common/LoaderContent";
import Loading from "../../components/common/Loading";
import PaginationComponent from "../../components/common/PaginationComponent";
import TableLoader from "../../components/common/TableLoader";
import "../../css/main.css";
import {
  userGroupDataFields,
  userGroupLabels,
  usersDataFields,
  usersLabels,
} from "../../helpers/constants";
import { allReportDateFormatter } from "../../helpers/tableHelpers";
import { UserUtils } from "../../lib/authenticationUtils";
import store from "../../store";
import {
  initialAssetManager,
  initialNewAssetManager,
  initialUserResponse,
} from "../../types/User";
import {
  AddAssetManager,
  DeleteAssetManager,
  getUserGroups,
  UpdateAssetManager,
} from "./UserService";

const AccordianStyles = styled.div`
  .reset-expansion-style {
    background-color: orange;
    color: ##1b2e57;
  }
`;

const GroupTable = (props: any) => {
  const mystyle = {
    whiteSpace: "pre-wrap",
    padding: "10px",
  } as React.CSSProperties;

  const [userGroupRecords, setUserGroupRecords] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [groupsPerPage, setGroupsPerPage] = useState(10);
  const [groupsOnPage, setGroupsOnPage] = useState(0);
  const [totalPages, setTotalPages] = useState(-2);
  const [totalItems, setTotalItems] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newAssetManager, setNewAssetManager] = useState(
    initialNewAssetManager
  );
  const [validEmailCheck, setvalidEmailCheck] = useState(false);
  const [selectedAssetManager, setSelectedAssetManager] =
    useState(initialAssetManager);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responeStatus, setResponeStatus] = useState(initialUserResponse);
  const [isLoading, setIsLoading] = useState(false);

  const shortNameTarget = useRef<HTMLInputElement>(null);
  const nameTarget = useRef<HTMLInputElement>(null);
  const emailTarget = useRef(null);

  useEffect(() => {
    getAssetGroups(currentPage, groupsPerPage);
  }, [store.getState().auth.userSetting.timeZone]);

  useEffect(() => {
    if (props.tab) {
      getAssetGroups(currentPage, groupsPerPage);
      props.setAction(false);
    }
  }, [props.tab]);

  const getAssetGroups = (pageNumber: any, groupsPerPage: any) => {
    setTotalPages(-2);
    setUserGroupRecords([]);
    getUserGroups(pageNumber, groupsPerPage).then((res) => {
      var userGroup = res.content ? res.content : [];
      userGroup = userGroup.sort((a: any, b: any) =>
        a.shortname.localeCompare(b.shortname)
      );
      setTotalPages(res.totalPages);
      setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
      setUserGroupRecords(userGroup);
      setGroupsOnPage(res.numberOfElements);
    });
  };

  const pageChange = (event: any) => {
    setCurrentPage(event);
    getAssetGroups(event, groupsPerPage);
  };

  const sizeChange = (event: any) => {
    setCurrentPage(0);
    setGroupsPerPage(event);
    getAssetGroups(0, event);
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
      setSelectedRow([row.id]);
      var assetManager = initialAssetManager;
      assetManager.id = row.id;
      assetManager.shortName = row.shortname;
      assetManager.name = row.name;
      assetManager.errorEmail = row.errorEmail;
      setSelectedAssetManager(assetManager);
    } else {
      setSelectedRow(selectedRow.filter((x) => x !== row.id));
    }
  }
  const expandRow = {
    className: "test",
    showExpandColumn: true,
    expandHeaderColumnRenderer: () => {
      return <i className="fas fa-plus"></i>;
    },
    expandColumnRenderer: () => {
      return <i className="fas fa-plus"></i>;
    },
    renderer: (row: any, rowIndex: any) => {
      if (row.members.length > 0) {
        var users = row.members.sort((a: any, b: any) =>
          a.firstname.localeCompare(b.firstname)
        );
        return (
          <div style={{ backgroundColor: "red" }}>
            <GroupUserTable users={users} assetMgr={row.shortname} />
          </div>
        );
      }
      return (
        <div>
          <p>No User for this Asset Group</p>
        </div>
      );
    },

    onExpand: (row: any, isExpand: boolean, rowIndex: number, e: any) => {},
  };

  const columns = [
    {
      dataField: userGroupDataFields.SHORT_NAME.text,
      text: userGroupLabels.SHORT_NAME.text,
      sort: true,
      headerStyle: mystyle,
      key: 1,
    },
    {
      dataField: userGroupDataFields.LONG_NAME.text,
      text: userGroupLabels.LONG_NAME.text,
      sort: true,
      headerStyle: mystyle,
      key: 2,
    },
    {
      dataField: userGroupDataFields.EMAIL_NOTIFICATION.text,
      text: userGroupLabels.EMAIL_NOTIFICATION.text,
      sort: true,
      headerStyle: mystyle,
      key: 3,
      formatter: (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        let user = cell.split(",").map((line: any) => (
          <>
            {line}
            <br />
          </>
        ));
        return user;
      },
    },
  ];
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
      dataField: usersDataFields.CREATED_TIME.text,
      text: usersLabels.CREATED_TIME.text,
      sort: true,
      headerStyle: mystyle,
      formatter: allReportDateFormatter,
      key: 4,
    },
    {
      dataField: usersDataFields.LAST_LOGIN.text,
      text: usersLabels.LAST_LOGIN_TIME.text,
      sort: true,
      headerStyle: mystyle,
      formatter: allReportDateFormatter,
      key: 5,
    },
  ];

  const switchTab = (assetMgr: any) => {
    props.SetAssetgr(assetMgr);
  };

  function editNewAssetManager(event: { target: { name: any; value: any } }) {
    var assetManager = newAssetManager;
    if (event.target.name === "shortName") {
      assetManager.shortName = event.target.value;
    } else if (event.target.name === "name") {
      assetManager.name = event.target.value;
    } else {
      assetManager.errorEmail = event.target.value;
    }
    setNewAssetManager(assetManager);
  }
  //add Group onSubmit && addGroup Modal
  const handleAddSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    setvalidEmailCheck(true);
    if (form.checkValidity()) {
      setIsLoading(true);
      AddAssetManager(newAssetManager)
        .then((res) => {
          setvalidEmailCheck(false);
          setIsLoading(false);
          setShowAddModal(false);
          setShowResponseModal(true);
          if (res.status === 200) {
            setNewAssetManager({ ...initialNewAssetManager });
            setResponeStatus({
              email: res.data.name,
              status: "OK",
              action: "Added",
            });

            console.log(isLoading);
          } else {
            if (res.data.endsWith(UserUtils.getUser()?.customerId)) {
              var resp = res.data;
              resp = resp.slice(0, resp.length - 3);
              setResponeStatus({
                email: newAssetManager.name,
                status: "NOT OK",
                action: resp + store.getState().auth.data,
              });
            } else {
              setResponeStatus({
                email: newAssetManager.name,
                status: "NOT OK",
                action: res.data,
              });
            }
          }
          setIsLoading(false);
          setNewAssetManager({ ...initialNewAssetManager });
        })
        .catch((err) => {
          setvalidEmailCheck(false);
          setResponeStatus({
            email: selectedAssetManager.name,
            status: "NOT OK",
            action: "There is a problem with your request. Please try again",
          });
        });
    }
  };
  function AddGroupModal(props: any) {
    if (isLoading) {
      return (
        <Modal {...props} name="addGroup" style={{ marginTop: "220px" }}>
          <Modal.Header translate="true" closeButton={false}>
            <Modal.Title> Loading Add Asset Manager Request </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ justifyContent: "center" }}>
            <Row>
              <Col></Col>
              <Col>
                <Spinner animation="border" variant="warning" />
              </Col>
              <Col></Col>
            </Row>
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
          onSubmit={handleAddSubmit}
          method="post"
          id="addGroupForm"
        >
          <div className="modal-content">
            <Modal.Header closeButton translate="true">
              <Modal.Title> Add Asset Manager </Modal.Title>
            </Modal.Header>

            <div className="modal-body">
              <Modal.Body>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Short Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      placeholder="Enter Short Name for Group"
                      name="shortName"
                      key="shortName"
                      id="shortName"
                      defaultValue={newAssetManager.shortName}
                      onChange={editNewAssetManager}
                      ref={shortNameTarget}
                      required
                      minLength={3}
                      pattern="[A-Z]*$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter minimum three characters (only capital) for
                      short name
                    </Form.Control.Feedback>
                  </Col>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Long Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus
                      type="text"
                      name="name"
                      placeholder="Enter the full Name of the Group"
                      id="name"
                      key="name"
                      defaultValue={newAssetManager.name}
                      onChange={editNewAssetManager}
                      ref={nameTarget}
                      required
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please enter value for long name
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Email
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      autoFocus={true}
                      type="textarea"
                      placeholder="Please enter valid email address"
                      name="email"
                      id="email"
                      key="email"
                      defaultValue={newAssetManager.errorEmail}
                      onChange={editNewAssetManager}
                      ref={emailTarget}
                      required
                      pattern="^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter an valid email address
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
                  setNewAssetManager({ ...initialNewAssetManager });
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

  function editAssetManager(event: { target: { name: any; value: any } }) {
    var assetManager = selectedAssetManager;
    if (event.target.name === "shortName") {
      assetManager.shortName = event.target.value;
    } else if (event.target.name === "name") {
      assetManager.name = event.target.value;
    } else {
      assetManager.errorEmail = event.target.value;
    }
    setSelectedAssetManager(assetManager);
  }
  //edit group onSubmit && editGroup Modals

  function EditGroupModal(props: any) {
    if (selectedRow.length === 0) {
      return (
        <Modal {...props} name="addGroup">
          {" "}
          <Modal.Header closeButton translate="true">
            <Modal.Title id="example-custom-modal-styling-title">
              No group Selected
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert key="alert" variant="danger">
              Please select any group to update it !!
            </Alert>
          </Modal.Body>
        </Modal>
      );
    }
    if (isLoading) {
      return (
        <Modal {...props} name="addGroup" style={{ marginTop: "220px" }}>
          <Modal.Header translate="true" closeButton={false}>
            <Modal.Title> Loading Edit Asset Manager Request </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ justifyContent: "center" }}>
            <Row>
              <Col></Col>
              <Col>
                <Spinner animation="border" variant="warning" />
              </Col>
              <Col></Col>
            </Row>
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
          onSubmit={handleAddSubmit}
          method="post"
        >
          <div className="modal-content">
            <Modal.Header closeButton translate="true">
              <Modal.Title>
                {selectedRow.length > 0
                  ? "Edit Asset Manager"
                  : "No Asset Manager Selected"}{" "}
              </Modal.Title>
            </Modal.Header>
            {selectedRow.length === 0 && (
              <div className="modal-body">
                <Modal.Body>
                  <Alert key="alert" variant="danger">
                    <Alert.Heading>
                      Please select any Asset Maneger to Edit!
                    </Alert.Heading>
                  </Alert>
                </Modal.Body>
              </div>
            )}
            {selectedRow.length > 0 && (
              <div className="modal-body">
                <Modal.Body>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">
                      Short Name
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        placeholder="Enter Short Name for Group"
                        name="shortName"
                        key="shortName"
                        id="shortName"
                        defaultValue={selectedAssetManager.shortName}
                        onChange={editAssetManager}
                        ref={shortNameTarget}
                        required
                        minLength={3}
                        pattern="^[A-Z]{3,}"
                        disabled
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter minimum three characters (only capital) for
                        short name
                      </Form.Control.Feedback>
                    </Col>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">
                      Long Name
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        autoFocus
                        type="text"
                        name="name"
                        placeholder="Enter the full Name of the Group"
                        id="name"
                        key="name"
                        defaultValue={selectedAssetManager.name}
                        onChange={editAssetManager}
                        ref={nameTarget}
                        required
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Please enter value for long name
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">
                      Email
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        autoFocus={true}
                        type="textarea"
                        placeholder="Please enter valid email address"
                        name="email"
                        id="email"
                        key="email"
                        defaultValue={selectedAssetManager.errorEmail}
                        onChange={editAssetManager}
                        ref={emailTarget}
                        required
                        pattern="^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter an valid email address
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Modal.Body>
              </div>
            )}

            {selectedRow.length === 0 && (
              <div className="modal-footer">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                  }}
                >
                  Close
                </Button>
              </div>
            )}
            {selectedRow.length > 0 && (
              <div className="modal-footer">
                <Button
                  type="submit"
                  variant="outline-primary"
                  onClick={handleUpdateSubmit}
                >
                  Update
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setNewAssetManager({ ...initialNewAssetManager });
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </Form>
      </Modal>
    );
  }

  const handleUpdateSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    let patternRegex = /^[A-Z]{3,}/g;
    setvalidEmailCheck(true);
    if (form.checkValidity() && patternRegex.test(form.form[1].value)) {
      setIsLoading(true);
      UpdateAssetManager(selectedAssetManager)
        .then((res) => {
          setIsLoading(false);
          setShowEditModal(false);
          setShowResponseModal(true);
          setvalidEmailCheck(false);
          if (res.status === 200) {
            setResponeStatus({
              email: selectedAssetManager.name,
              status: "OK",
              action: "Updated",
            });
          } else {
            setvalidEmailCheck(false);
            setResponeStatus({
              email: selectedAssetManager.name,
              status: "NOT OK",
              action: res.data,
            });
          }
        })
        .catch((err) => {
          setShowEditModal(false);
          setShowResponseModal(true);
          setResponeStatus({
            email: selectedAssetManager.name,
            status: "NOT OK",
            action: "There is a problem with your request. Please try again",
          });
        });
    }
  };

  const handleDeleteSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    setvalidEmailCheck(true);
    if (form.checkValidity()) {
      setIsLoading(true);
      DeleteAssetManager(selectedAssetManager)
        .then((res) => {
          setvalidEmailCheck(false);
          setIsLoading(false);
          setShowDeleteModal(false);
          setShowResponseModal(true);
          setResponeStatus({
            email: selectedAssetManager.name,
            status: "OK",
            action: "Deleted",
          });
        })
        .catch((err) => {
          setvalidEmailCheck(false);
          setShowDeleteModal(false);
          setShowResponseModal(true);
          setResponeStatus({
            email: selectedAssetManager.name,
            status: "NOT OK",
            action: "There is a problem with your request. Please try again",
          });
        });
    }
  };

  function DeleteGroupModal(props: any) {
    if (selectedRow.length === 0) {
      return (
        <Modal {...props} name="addGroup">
          {" "}
          <Modal.Header closeButton translate="true">
            <Modal.Title id="example-custom-modal-styling-title">
              No Group Selected
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert key="alert" variant="danger">
              Please select any Group to delete it !!
            </Alert>
          </Modal.Body>
        </Modal>
      );
    }
    if (isLoading) {
      return (
        <Modal {...props} name="addGroup" style={{ marginTop: "220px" }}>
          <Modal.Header translate="true" closeButton={false}>
            <Modal.Title> Loading Edit Asset Manager Request </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ justifyContent: "center" }}>
            <Row>
              <Col></Col>
              <Col>
                <Spinner animation="border" variant="warning" />
              </Col>
              <Col></Col>
            </Row>
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
        <Form noValidate method="post">
          <div className="modal-content">
            <Modal.Header closeButton translate="true">
              <Modal.Title>
                {selectedRow.length > 0
                  ? "Delete Asset Manager"
                  : "No Asset Manager Selected"}{" "}
              </Modal.Title>
            </Modal.Header>

            <div className="modal-body">
              <Modal.Body>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Short Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      name="shortName"
                      key="shortName"
                      id="shortName"
                      defaultValue={selectedAssetManager.shortName}
                      disabled
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Long Name
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="name"
                      id="name"
                      key="name"
                      defaultValue={selectedAssetManager.name}
                      disabled
                    ></Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4">
                    Email
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      as="textarea"
                      name="email"
                      id="email"
                      key="email"
                      defaultValue={selectedAssetManager.errorEmail}
                      disabled
                    />
                  </Col>
                </Form.Group>
              </Modal.Body>
            </div>

            {selectedRow.length === 0 && (
              <div className="modal-footer">
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                  }}
                >
                  Close
                </Button>
              </div>
            )}
            <Alert key="alert" variant="danger" transition={true}>
              <Alert.Heading>
                Please confirm once again before deleting the asset manager
              </Alert.Heading>
            </Alert>

            {selectedRow.length > 0 && (
              <div className="modal-footer">
                <Button
                  type="submit"
                  variant="outline-primary"
                  onClick={handleDeleteSubmit}
                >
                  Delete
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setNewAssetManager({ ...initialNewAssetManager });
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </Form>
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
              ? "Asset Manager with Name " +
                props.status.email +
                " is successfully " +
                props.status.action
              : props.status.action}
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }

  const GroupUserTable = (prop: any) => {
    return (
      <>
        <ToolkitProvider
          keyField="email"
          data={prop.users}
          columns={usersColumns}
          //  columnToggle
          search
        >
          {(props) => (
            <>
              <div style={{ width: "100%", backgroundColor: "white" }}>
                <BootstrapTable
                  {...props.baseProps}
                  //condensed={true}
                  striped={true}
                  bordered={true}
                  pagination={paginationFactory({
                    sizePerPage: 5,
                    alwaysShowAllBtns: false,
                    hideSizePerPage: true,
                    pageListRenderer: () => <></>,
                  })}
                  caption={
                    props.baseProps.data.length > 5 ? (
                      <>
                        <Button
                          variant="outline-primary"
                          onClick={() => switchTab(prop.assetMgr)}
                          style={{ marginLeft: "10px" }}
                        >
                          Show More
                        </Button>
                      </>
                    ) : (
                      <h4 style={{ marginLeft: "10px" }}>
                        Only {props.baseProps.data.length} Users under this
                        Group
                      </h4>
                    )
                  }
                />
              </div>
            </>
          )}
        </ToolkitProvider>
      </>
    );
  };

  const ActionButtons = (
    <>
      {" "}
      <Button
        variant="outline-success"
        onClick={() => {
          setShowAddModal(true);
          setNewAssetManager({ ...initialNewAssetManager });
        }}
      >
        Add Group
      </Button>
      <Button
        variant="outline-primary"
        onClick={() => {
          setShowEditModal(true);
        }}
      >
        Edit Group
      </Button>
      <Button
        variant="outline-danger"
        onClick={() => {
          setShowDeleteModal(true);
        }}
      >
        Delete Group
      </Button>
    </>
  );
  const TableModals = (
    <>
      <AddGroupModal
        backdrop="static"
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setNewAssetManager({ ...initialNewAssetManager });
        }}
      />
      <EditGroupModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
      />
      <DeleteGroupModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      />
      <ResponseModal
        show={showResponseModal}
        onHide={() => {
          setShowResponseModal(false);
          setNewAssetManager({ ...initialNewAssetManager });
          setSelectedAssetManager({ ...initialAssetManager });
          setCurrentPage(0);
          setTotalPages(-2);
          setUserGroupRecords([]);
          getAssetGroups(0, 10);
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
  return (
    <>
      {ActionButtons}
      <br />
      <AccordianStyles>
        {" "}
        <ToolkitProvider
          keyField="id"
          data={userGroupRecords}
          columns={columns}
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
                expandRow={expandRow}
                caption={
                  <h4 style={{ marginLeft: "10px" }}>
                    Please click on Group Short Name to view its users
                  </h4>
                }
                noDataIndication={() => <NoDataIndication />}
              />
              {totalPages > 0 && (
                <PaginationComponent
                  numberOfPages={totalPages}
                  currentPage={currentPage}
                  sizeChange={sizeChange}
                  changePage={pageChange}
                  sizePerPage={groupsPerPage}
                  itemOnPage={groupsOnPage}
                  totalItems={totalItems}
                />
              )}
              {TableModals}
            </div>
          )}
        </ToolkitProvider>
      </AccordianStyles>
    </>
  );
};

export default GroupTable;
