import React from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Tooltip,
  Overlay,
  Alert,
} from "react-bootstrap";
import styled from "styled-components";
import "../../css/main.css";
import { UserUtils } from "../../lib/authenticationUtils";
import {
  Configuration,
  FieldMapping,
  initialFieldMapping,
  initialTransactionField,
  initialReplaceValue,
} from "../../types/ImportCongurations";
import getConfiguration, {
  getTransactionalFields,
  submitConfigurationData,
} from "./ConfigurationService";
import { commonError } from "../common/commonError";

const Styles = styled.div`

  .submitSuccess{
    background-color:#17d44a
  }
  .submitError{
    background-color:#f00c1b
  }
  .field {
    border: 1px solid white;
    margin: 10px;
    box-shadow: 1px 3px 20px gray;
    height: 8vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .header-field{
    margin-bottom: 1rem;
    color: white;
    background-color: #525f7f;
    border: 1px solid white;
    margin: 10px;
    box-shadow: 1px 3px 20px gray;
    height: 8vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .header-field-col{
    background-color:#1B2E57;
    justify-content: center;
    display:grid;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 0.79rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border:1px solid #e9ecef;
  }
  .field-column-ops{
    display:flex;
    justify-content: center;
  }
  .field-column{
    justify-content: center;
    display:grid;
  }
  .dragged {
    background-color: rgba(200, 200, 200, 0.3);
    opacity: 0.5;
    cursor: pointer;
  }
  .dragged-over {
    background: rgba(255, 0, 0, 0.2);
    .field {
      background: rgba(255,0,0,0.1);
    }
  .added{
    align-items: center;
    justify-content: center;
  }
`;

export default class MappingConfigurations extends React.Component<
  { config: any; list: any },
  {}
> {
  state = {
    configId: 0,
    fields: [initialFieldMapping],
    draggedField: initialFieldMapping,
    targetField: initialFieldMapping,
    newOrder: 0,
    oldOrder: 0,
    showModal: false,
    showEditModal: false,
    newFieldName: "",
    editFieldId: initialFieldMapping,
    count: 5,
    transactionFields: [initialTransactionField],
    showSubmitModal: true,
    errorMessage: [],
    submitError: false,
    replacedValue: "",
    replaceWith: "",
    editReplaceIcon: "pencil-alt",
    validValueString: "",
    showToolTip: false,
    showToolTipOnSubmit: false,
  };

  initialState: any;
  replaceValueTarget = React.createRef();
  replaceWithTarget = React.createRef();

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: { config: any; list: any }) {
    super(props);
    this.initialState = this.state;
  }
  /* componentWillReceiveProps(props: { config: any }) {
    if (this.props.config.current.state.configuration.id > 0) {
      getConfiguration(
        this.props.config.current.state.configuration.id,
        UserUtils.getUser()?.customerId
      )
        .then((res) => {
          const Configuration: Configuration = res ? res : [];
          var FieldsArray: FieldMapping[] = Configuration.fieldMappings;
          this.setState({
            fields: FieldsArray,
          });
        })
        .catch((err) => {
          commonError(err.response.status, "MAPPINGCONFIGURATION");
        });
    }
  } */
  componentDidMount() {
    getTransactionalFields().then((res) => {
      this.setState({
        transactionFields: res,
      });
    });

    // this.setState({
    //   fields: FIELDS,
    // });
  }
  onDragStart = (evt: any, field: FieldMapping) => {
    let element = evt.currentTarget;
    this.setState({
      draggedField: field,
    });
    element.classList.add("dragged");
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = "move";
  };
  onDragEnd = (evt: any) => {
    evt.currentTarget.classList.remove("dragged");
  };
  onDragEnter = (evt: any) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add("dragged-over");
    evt.dataTransfer.dropEffect = "move";
  };
  onDragLeave = (evt: any) => {
    let currentTarget = evt.currentTarget;
    let newTarget = evt.relatedTarget;

    if (newTarget.id !== "") {
      let target = this.state.fields.filter(
        (field: FieldMapping) =>
          // eslint-disable-next-line
          field.position.toString() == newTarget.id
      );

      this.setState({
        targetField: target[0],
      });
    }

    if (newTarget.parentNode === currentTarget || newTarget === currentTarget) {
      return;
    }
    evt.preventDefault();
    let element = evt.currentTarget;

    element.classList.remove("dragged-over");
  };
  onDragOver = (evt: any) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };
  onDrop = (evt: any, value: any) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    let fields = this.state.fields;

    var draggedIndex = fields.findIndex(
      (field) => field === this.state.draggedField
    );
    var targetIndex = fields.findIndex(
      (field) => field === this.state.targetField
    );

    var oldOrder = this.state.draggedField.position;
    var newOrder = this.state.targetField.position;
    var updated: FieldMapping[] = fields.map((field: FieldMapping, index) => {
      // if (field.id == data) {
      //   field.added = value;
      // }
      if (index === draggedIndex) {
        field = this.state.targetField;
      }
      if (index === targetIndex) {
        field = this.state.draggedField;
      }
      return field;
    });
    updated[draggedIndex].position = oldOrder;
    updated[targetIndex].position = newOrder;

    this.setState({ fields: updated });
  };

  removeFormFields(i: number) {
    let formValues = this.state.fields;
    formValues.splice(i, 1);
    this.setState({ fields: formValues });
    let fv = this.state.fields;
    for (let j = i; j < fv.length; j++) {
      formValues[j].position -= 1;
    }
    this.setState({ fields: fv });
  }

  addField = () => {
    this.setState({
      fields: [
        ...this.state.fields,
        {
          id: this.state.fields.length,
          dataType: "",
          description: "",
          multiValue_delimiter: "",
          multiValue_readIndex: 0,
          ignoreValue: false,
          required: false,
          position: this.state.fields.length,
          source: this.state.newFieldName,
          name: "",
          defaultValue: "",
          overrideValue: "",
          maxChar: 100,
          minChar: 0,
          substringBegin: 0,
          substringEnd: 0,
          validValues: [],
          replaceValue: null,
          datePattern: "",
          minValue:null,
          maxValue:null,
        },
      ],
      showModal: !this.state.showModal,
    });
  };

  editField = () => {
    if (this.state.replacedValue !== "" || this.state.replaceWith !== "") {
      this.setState({
        showToolTipOnSubmit: true,
      });
    } else {
      let updatedFields = this.state.fields;
      updatedFields = updatedFields.map((field: FieldMapping) => {
        // eslint-disable-next-line
        if (field.position === this.state.editFieldId.position) {
          //delete this.state.editFieldId.replaceValue[""];
          field = { ...this.state.editFieldId };
        }
        //   var index = field.options.indexOf("");
        //   field.options.splice(index, 1);
        return field;
      });
      this.setState({
        fields: updatedFields,
        showToolTip: false,
        showToolTipOnSubmit: false,
        showEditModal: !this.state.showEditModal,
      });
    }
  };

  typeChangeHandler = (event: { target: { name: any; value: any } }) => {
    this.setState({
      editFieldId: { ...this.state.editFieldId, type: event.target.value },
    });
  };

  transactionTypeChangeHandler = (
    event: { target: { name: any; value: any } },
    field: FieldMapping
  ) => {
    var fields = this.state.fields;
    var ucaseName = event.target.value;
    var type = "";
    this.state.transactionFields.map((transactionField) => {
      if (transactionField.ucaseName === ucaseName) {
        type = transactionField.dataType;
      }
    });
    fields = fields.map((feild: FieldMapping) => {
      if (feild.position === field.position) {
        feild.dataType = type;
        feild.type = type;
        feild.name = event.target.value;
      }
      return feild;
    });
    this.setState({
      fields: fields,
    });
  };

  FieldSourcedChangeHandler = (
    event: { target: { name: any; value: any } },
    field: FieldMapping
  ) => {
    var fields = this.state.fields;
    fields.map((feild: FieldMapping) => {
      if (feild.position === field.position) {
        feild.source = event.target.value;
      }
    });
    this.setState({
      fields: fields,
    });
  };

  dateFormatterChangeHandler = (event: {
    target: { name: any; value: any };
  }) => {
    this.setState({
      editFieldId: {
        ...this.state.editFieldId,
        dateFormat: event.target.value,
      },
    });
  };
  dateSeperatorChangeHandler = (event: {
    target: { name: any; value: any };
  }) => {
    this.setState({
      editFieldId: {
        ...this.state.editFieldId,
        dateSeperator: event.target.value,
      },
    });
  };
  resetState = () => {
    var fields = this.state.fields;
    while (fields.length) {
      fields.pop();
    }
    this.setState({ ...this.initialState, fields: [initialFieldMapping] });
    getTransactionalFields().then((res) => {
      this.setState({
        transactionFields: res,
      });
    });
    this.props.config.current.setState({
      ...this.props.config.current.initialState,
    });
    this.props.config.current.resetState();
    this.props.list.current.loadConfiguration(0, 10);
    this.props.list.current.setState({ currentPage: 0 });
  };

  saveData = () => {
    if (this.props.config.current.state.configuration.fileFormat === "") {
      this.setState({
        showSubmitModal: false,
        errorMessage:
          "No Value for File format selected. Please select the file format you want for the configuration",
        submitError: true,
      });
    } else {
      var _configData;
      if (this.props.config.current.state.modeofConfiguration === "MODIFY") {
        _configData = {
          ...this.props.config.current.state.configuration,
          fieldMappings: this.state.fields,
        };
      } else {
        _configData = {
          allowUpdates:
            this.props.config.current.state.configuration.allowUpdates,
          assetManagers:
            this.props.config.current.state.configuration.assetManagers,
          autoConfirm:
            this.props.config.current.state.configuration.autoConfirm,
          cancelAndResend:
            this.props.config.current.state.configuration.cancelAndResend,
          checkAmount:
            this.props.config.current.state.configuration.checkAmount,
          customerId: UserUtils.getUser()?.customerId,
          defaultDateFormatPattern:
            this.props.config.current.state.configuration
              .defaultDateFormatPattern,
          delimiter: this.props.config.current.state.configuration.delimiter,
          enrichBankAccount:
            this.props.config.current.state.configuration.enrichBankAccount,
          enrichBroker:
            this.props.config.current.state.configuration.enrichBroker,
          enrichCounterparty:
            this.props.config.current.state.configuration.enrichCounterparty,
          enrichCurrencyCross:
            this.props.config.current.state.configuration.enrichCurrencyCross,
          enrichCustody:
            this.props.config.current.state.configuration.enrichCustody,
          enrichPortfolio:
            this.props.config.current.state.configuration.enrichPortfolio,
          enrichSubportfolio:
            this.props.config.current.state.configuration.enrichSubportfolio,
          enrichSecurity:
            this.props.config.current.state.configuration.enrichSecurity,
          enrichOtcSecurity:
            this.props.config.current.state.configuration.enrichOtcSecurity,
          exportConfigurationId:
            this.props.config.current.state.configuration.exportConfigurationId,
          fieldMappings: this.state.fields,
          fileFormat: this.props.config.current.state.configuration.fileFormat,
          fileUpload: this.props.config.current.state.configuration.fileUpload,
          formSubmitConfig:
            this.props.config.current.state.configuration.formSubmitConfig,
          mapMethod: this.props.config.current.state.configuration.mapMethod,
          name: this.props.config.current.state.configuration.name,
          sftp: this.props.config.current.state.configuration.sftp,
          startRow: Number(
            this.props.config.current.state.configuration.startRow
          ),
          toleranceLevelPercent:
            this.props.config.current.state.configuration.toleranceLevelPercent,
          transactionType:
            this.props.config.current.state.configuration.transactionType,
          validateBankAccount:
            this.props.config.current.state.configuration.validateBankAccount,
          validateBroker:
            this.props.config.current.state.configuration.validateBroker,
          validateCounterparty:
            this.props.config.current.state.configuration.validateCounterparty,
          validateCurrencyCross:
            this.props.config.current.state.configuration.validateCurrencyCross,
          validateCustody:
            this.props.config.current.state.configuration.validateCustody,
          validatePortfolio:
            this.props.config.current.state.configuration.validatePortfolio,
          validateSubportfolio:
            this.props.config.current.state.configuration.validateSubportfolio,
          validateSecurity:
            this.props.config.current.state.configuration.validateSecurity,
          validateOtcSecurity:
            this.props.config.current.state.configuration.validateOtcSecurity,
          validatePosition:
            this.props.config.current.state.configuration.validatePosition,
          updatePosition:
            this.props.config.current.state.configuration.updatePosition,
          xmlTradeLeg:
            this.props.config.current.state.configuration.xmlTradeLeg,
          xmlTradeRoot:
            this.props.config.current.state.configuration.xmlTradeRoot,
        };
      }
      submitConfigurationData(_configData, UserUtils.getUser()?.customerId)
        .then((res) => {
          switch (res.status) {
            case 200:
              this.setState({
                showSubmitModal: false,
                errorMessage: res,
                submitError: false,
              });
              break;
            default:
              this.setState({
                showSubmitModal: false,
                errorMessage: res.response.data,
                submitError: true,
              });
              break;
          }
        })
        .catch((err) => {
          this.setState({
            showSubmitModal: false,
            errorMessage:
              "There seems to be a problem in saving the configuration.",
            submitError: true,
          });
        });
    }
  };

  addReplaceValues = () => {
    if (this.state.replacedValue === "" || this.state.replaceWith === "")
      this.setState({ showToolTip: true });
    else {
      var replacingValues = this.state.editFieldId.replaceValue;
      if (replacingValues === null) {
        replacingValues = [];
      }
      var newValue = {
        from: this.state.replacedValue,
        to: this.state.replaceWith,
      };
      replacingValues.push(newValue);
      this.setState({
        editFieldId: {
          ...this.state.editFieldId,
          replaceValue: replacingValues,
        },
        replacedValue: "",
        replaceWith: "",
        showToolTip: false,
        showToolTipOnSubmit: false,
      });
    }
  };

  changeReplaceValue = (event: { target: { id: any; value: any } }) => {
    if (event.target.id === "replacedValue") {
      this.setState({ replacedValue: event.target.value, showToolTip: false });
    } else if (event.target.id === "replacingValue") {
      this.setState({ replaceWith: event.target.value, showToolTip: false });
    }
  };

  editReplaceEntry = (value: any) => {
    var replacingValues = this.state.editFieldId.replaceValue;
    const isReplaceValue = (element: any) => element === value;
    var index = replacingValues.findIndex(isReplaceValue);
    replacingValues.splice(index, 1);
    this.setState({
      replacedValue: value.from,
      replaceWith: value.to,
      editFieldId: { ...this.state.editFieldId, replaceValue: replacingValues },
    });
  };

  deleteReplaceEntry = (value: any) => {
    var replacingValues = this.state.editFieldId.replaceValue;
    const isReplaceValue = (element: any) => element === value;
    var index = replacingValues.findIndex(isReplaceValue);
    replacingValues.splice(index, 1);
    this.setState({
      editFieldId: { ...this.state.editFieldId, replaceValue: replacingValues },
    });
  };

  render() {
    const { fields } = this.state;

    return (
      <Styles>
        <Row>
          <Col>
            <fieldset className="scheduler-border">
              <legend className="scheduler-border">
                Mapping Fields{" "}
                {this.props.config.current?.state.configurationName}
              </legend>

              <div className="header-field rounded" draggable={false}>
                <Col className="header-field-col rounded">
                  <label>Order</label>
                </Col>
                <Col className="header-field-col rounded">
                  <label>Name</label>
                </Col>
                <Col className="header-field-col rounded">
                  <label>Transaction Field</label>
                </Col>
                <Col className="header-field-col rounded">
                  <label>Data Type</label>
                </Col>
                <Col className="header-field-col rounded">
                  <label>Operations</label>
                </Col>
              </div>
              <div
                className="added small-box"
                onDragLeave={(e) => this.onDragLeave(e)}
                onDragEnter={(e) => this.onDragEnter(e)}
                onDragEnd={(e) => this.onDragEnd(e)}
                onDragOver={(e) => this.onDragOver(e)}
                onDrop={(e) => this.onDrop(e, false)}
              >
                {fields
                  .sort((a: any, b: any) => a.postion - b.position)
                  .map((field: FieldMapping, index) => {
                    return (
                      <div
                        className="field rounded"
                        id={field.position.toString()}
                        key={field.position}
                        draggable
                        onDragStart={(e) => this.onDragStart(e, field)}
                        onDragEnd={(e) => this.onDragEnd(e)}
                      >
                        <Col className="field-column">
                          <label>{field.position}</label>
                        </Col>
                        <Col className="field-column">
                          <input
                            type="text"
                            name="name"
                            value={field.source || ""}
                            onChange={(e) =>
                              this.FieldSourcedChangeHandler(e, field)
                            }
                          />
                        </Col>
                        <Col className="field-column">
                          <Form.Control
                            as="select"
                            className="field-type"
                            name="fieldType"
                            onChange={(e) => {
                              this.transactionTypeChangeHandler(e, field);
                            }}
                          >
                            {this.state.transactionFields
                              ?.sort((a: any, b: any) =>
                                a.ucaseName.localeCompare(b.ucaseName)
                              )
                              .map((TransactionField, index) => {
                                return (
                                  <option
                                    value={TransactionField.ucaseName}
                                    id={TransactionField.ucaseName}
                                    key={index}
                                    selected={
                                      field.name.toUpperCase() ===
                                      TransactionField.ucaseName
                                        ? true
                                        : false
                                    }
                                  >
                                    {TransactionField.ucaseName}
                                  </option>
                                );
                              })}
                          </Form.Control>
                        </Col>
                        <Col className="field-column">
                          <input
                            type="text"
                            name="TransactionField"
                            value={field.dataType || ""}
                          />
                        </Col>
                        <Col className="field-column-ops">
                          <i
                            style={{
                              fontSize: "15px",
                              color: "Dodgerblue",
                            }}
                            className="fas fa-pencil-alt mr-4"
                            onClick={() =>
                              this.setState({
                                editFieldId: field,
                                showEditModal: true,
                              })
                            }
                          />
                          {index ? (
                            <i
                              className="fas fa-trash"
                              style={{
                                fontSize: "15px",
                                color: "Red",
                                marginLeft: "10px",
                              }}
                              onClick={() => this.removeFormFields(index)}
                            />
                          ) : null}
                        </Col>
                        {
                          <Modal
                            className={
                              this.state.submitError
                                ? "submitSuccess"
                                : "submitFailure"
                            }
                            show={!this.state.showSubmitModal}
                            onHide={this.resetState}
                          >
                            <Modal.Body>
                              <Alert
                                variant={
                                  this.state.submitError ? "danger" : "success"
                                }
                              >
                                {!this.state.submitError
                                  ? "You have successfully submitted the configuration"
                                  : this.state.errorMessage}
                              </Alert>
                            </Modal.Body>
                          </Modal>
                        }
                      </div>
                    );
                  })}
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    this.setState({ showModal: !this.state.showModal })
                  }
                >
                  Add Field
                </Button>
                <Button variant="outline-success" onClick={this.saveData}>
                  Submit
                </Button>
                {/**
                 * below model shows up when add field is clicked
                 */}
                {
                  <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showModal}
                    onHide={() =>
                      this.setState({ showModal: !this.state.showModal })
                    }
                  >
                    <Modal.Body>
                      <Form>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicNewField"
                        >
                          <Form.Label>New Field Add</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter new Field"
                            onChange={(e) =>
                              this.setState({ newFieldName: e.target.value })
                            }
                          />
                        </Form.Group>
                        <Button
                          variant="outline-primary"
                          onClick={() => this.addField()}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            this.setState({ showModal: !this.state.showModal })
                          }
                        >
                          Close
                        </Button>
                      </Form>
                    </Modal.Body>
                  </Modal>
                }
                {/**
                 * below model shows up when edit field is clicked
                 */}
                {
                  <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showEditModal}
                    onHide={() =>
                      this.setState({
                        showEditModal: !this.state.showEditModal,
                      })
                    }
                  >
                    <Modal.Body>
                      <Form>
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formEditFieldName"
                        >
                          <Form.Label column sm="4">
                            Name of the field
                          </Form.Label>
                          <Col sm="8">
                            <Form.Control
                              plaintext
                              readOnly
                              defaultValue={this.state.editFieldId.name}
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formEditFieldType"
                        >
                          <Form.Label column sm="4">
                            Type of the field
                          </Form.Label>
                          <Col sm="8">
                            <Form.Control
                              plaintext
                              readOnly
                              defaultValue={this.state.editFieldId.type}
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formEditFieldType"
                        >
                          <Form.Label column sm="3">
                            Ignore Value
                          </Form.Label>
                          <Col sm="3">
                            <Form.Control
                              type="checkbox"
                              size="sm"
                              checked={this.state.editFieldId.ignoreValue}
                              onChange={() =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    ignoreValue:
                                      !this.state.editFieldId.ignoreValue,
                                  },
                                })
                              }
                            />
                          </Col>
                          <Form.Label column sm="3">
                            Mandatory
                          </Form.Label>
                          <Col sm="3">
                            <Form.Control
                              type="checkbox"
                              size="sm"
                              checked={this.state.editFieldId.required}
                              onChange={() =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    required: !this.state.editFieldId.required,
                                  },
                                })
                              }
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group 
                        as={Row}
                        className="mb-3"
                        controlId="formEditFieldMinValue"
                        hidden={
                          this.state.editFieldId.type!=="NUMBER"
                        }

                        >
                           <Form.Label column sm="3">
                            Min Value
                          </Form.Label>
                          <Col sm="3">
                            <Form.Control
                              type="number"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.minValue}
                              onChange={(e) =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    minValue: e.target.value,
                                  },
                                })
                              }
                            />
                          </Col>
                          <Form.Label column sm="3">
                            Max Value
                          </Form.Label>
                          <Col sm="3">
                            <Form.Control
                              type="number"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.maxValue}
                              onChange={(e) =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    maxValue: e.target.value,
                                  },
                                })
                              }
                            />
                          </Col>
                         
                        </Form.Group>

                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formEditFieldTextRange"
                          hidden={this.state.editFieldId.type !== "TEXT"}
                        >
                          <Form.Label column sm="3">
                            Default Value
                          </Form.Label>
                          <Col sm="9">
                            <Form.Control
                              type="text"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.defaultValue}
                              onChange={(e) =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    defaultValue: e.target.value,
                                  },
                                })
                              }
                            />
                          </Col>
                          <Form.Label column sm="3">
                            Override Value
                          </Form.Label>
                          <Col sm="9">
                            <Form.Control
                              type="text"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.overrideValue}
                              onChange={(e) =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    overrideValue: e.target.value,
                                  },
                                })
                              }
                            />
                          </Col>
                          <Form.Label column sm="3">
                            Min Char
                          </Form.Label>
                          <Col sm="3">
                            <Form.Control
                              type="number"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.minChar}
                              onChange={(e) =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    minChar: e.target.value,
                                  },
                                })
                              }
                            />
                          </Col>
                          <Form.Label column sm="3">
                            Max Value
                          </Form.Label>
                          <Col sm="3">
                            <Form.Control
                              type="number"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.maxChar}
                              onChange={(e) =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    maxChar: e.target.value,
                                  },
                                })
                              }
                            />
                          </Col>
                          <Form.Label column sm="3">
                            Substring Start
                          </Form.Label>
                          <Col sm="3">
                            <Form.Control
                              type="text"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.substringBegin}
                              onChange={(e) =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    substringBegin: e.target.value,
                                  },
                                })
                              }
                            />
                          </Col>
                          <Form.Label column sm="3">
                            Substring End
                          </Form.Label>
                          <Col sm="3">
                            <Form.Control
                              type="text"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.substringEnd}
                              onChange={(e) => {
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    substringEnd: e.target.value,
                                  },
                                });
                              }}
                            />
                          </Col>
                          <Form.Label column sm="3">
                            Valid Values
                          </Form.Label>
                          <Col sm="9">
                            <Form.Control
                              as="textarea"
                              placeholder="Please Enter All Valid Values"
                              style={{ height: "100px" }}
                              value={this.state.editFieldId.validValues?.toString()}
                              onChange={(e) => {
                                var s = e.target.value.split(",");
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    validValues: s,
                                  },
                                });
                              }}
                            />
                            <Form.Text id="passwordHelpBlock" muted>
                              Please enter multiple values seperated by comma
                            </Form.Text>
                          </Col>
                          <Form.Label column sm="5">
                            Replace Value
                          </Form.Label>
                          <Form.Label column sm="5">
                            With
                          </Form.Label>
                          {this.state.editFieldId.replaceValue != null &&
                            this.state.editFieldId.replaceValue.map(
                              (values) => (
                                <>
                                  <Col sm="5">
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter new Field"
                                      value={values.from}
                                      disabled={
                                        values.from != this.state.replacedValue
                                          ? true
                                          : false
                                      }
                                    />
                                  </Col>{" "}
                                  <Col sm="5">
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter new Field"
                                      value={values.to}
                                      disabled={
                                        values.from != this.state.replaceWith
                                          ? true
                                          : false
                                      }
                                    />
                                  </Col>
                                  <Col sm="1">
                                    <i
                                      className="fas fa-pen fa-lg"
                                      onClick={() =>
                                        this.editReplaceEntry(values)
                                      }
                                    ></i>
                                  </Col>
                                  <Col sm="1">
                                    <i
                                      className="fas fa-times fa-lg"
                                      onClick={() =>
                                        this.deleteReplaceEntry(values)
                                      }
                                    ></i>
                                  </Col>
                                </>
                              )
                            )}

                          <>
                            <Col sm="5">
                              <Form.Control
                                type="text"
                                id="replacedValue"
                                placeholder="Enter new Field"
                                value={this.state.replacedValue}
                                onChange={this.changeReplaceValue}
                                ref={
                                  this
                                    .replaceValueTarget as React.RefObject<HTMLInputElement>
                                }
                              />
                              <Overlay
                                target={
                                  this.replaceValueTarget
                                    .current as HTMLInputElement
                                }
                                show={this.state.showToolTip}
                                placement="bottom"
                              >
                                {(props) => (
                                  <Tooltip id="overlay-example" {...props}>
                                    Please enter any value to add a replace pair
                                  </Tooltip>
                                )}
                              </Overlay>
                              <Overlay
                                target={
                                  this.replaceValueTarget
                                    .current as HTMLInputElement
                                }
                                show={this.state.showToolTipOnSubmit}
                                placement="bottom"
                              >
                                {(props) => (
                                  <Tooltip id="overlay-example" {...props}>
                                    Please clear this field or press add button
                                  </Tooltip>
                                )}
                              </Overlay>
                            </Col>{" "}
                            <Col sm="5">
                              <Form.Control
                                type="text"
                                id="replacingValue"
                                placeholder="Enter new Field"
                                value={this.state.replaceWith}
                                onChange={this.changeReplaceValue}
                                ref={
                                  this
                                    .replaceWithTarget as React.RefObject<HTMLInputElement>
                                }
                              />
                            </Col>
                            <Overlay
                              target={
                                this.replaceWithTarget
                                  .current as HTMLInputElement
                              }
                              show={this.state.showToolTip}
                              placement="bottom"
                            >
                              {(props) => (
                                <Tooltip id="overlay-example" {...props}>
                                  Please enter any value to add a replace pair
                                </Tooltip>
                              )}
                            </Overlay>
                            <Overlay
                              target={
                                this.replaceWithTarget
                                  .current as HTMLInputElement
                              }
                              show={this.state.showToolTipOnSubmit}
                              placement="bottom"
                            >
                              {(props) => (
                                <Tooltip id="overlay-example" {...props}>
                                  Please clear this field or press add button
                                </Tooltip>
                              )}
                            </Overlay>
                            <Col sm="2">
                              <div onClick={this.addReplaceValues}>
                                <i className="fa fa-plus fa-2x"></i>
                              </div>
                            </Col>
                          </>
                        </Form.Group>
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formEditFieldDateFormat"
                          hidden={
                            this.state.editFieldId.type !== "LOCAL_DATE_TIME"
                          }
                        >
                          <Form.Label column sm="4">
                            Date Time Pattern
                          </Form.Label>
                          <Col sm="8">
                            <Form.Control
                              type="text"
                              placeholder="Enter new Field"
                              value={this.state.editFieldId.datePattern}
                              defaultValue={
                                this.props.config.current?.state.configuration
                                  .defaultDateFormatPattern
                              }
                              onChange={(e) =>
                                this.setState({
                                  editFieldId: {
                                    ...this.state.editFieldId,
                                    datePattern: e.target.value,
                                  },
                                })
                              }
                            />
                          </Col>
                        </Form.Group>
                        <Button
                          variant="outline-primary"
                          type="button"
                          onClick={() => this.editField()}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            this.setState({
                              showEditModal: !this.state.showEditModal,
                            })
                          }
                        >
                          Close
                        </Button>
                      </Form>
                    </Modal.Body>
                  </Modal>
                }
              </div>
            </fieldset>
          </Col>
        </Row>
      </Styles>
    );
  }
}
