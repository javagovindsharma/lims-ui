import React from "react";
import { Row, Col, Form, Button, Modal, Alert } from "react-bootstrap";

import "../../css/main.css";
import {
  Configuration,
  exportConfiguration,
  initialConfiguration,
} from "../../types/ImportCongurations";
import getConfiguration, {
  deleteConfiguration,
  getAllConfiguration,
  getAllExportConfig,
  getAllTransactionTypes,
  getAssetManagersByCustomerId,
  getTransactionalFields,
  submitConfigurationData,
} from "./ConfigurationService";
import { UserUtils } from "../../lib/authenticationUtils";
import { commonError } from "../common/commonError";

export default class Configurations extends React.Component<
  { mapping: any; configId: any; configIdSet: any ;configAction:string},
  {}
> {
  state: any = {
    showSubmitModal: true,
    submitError: false,
    modeofConfiguration: "NEW",
    modifySelected: false,
    allconfigurations: [],
    configuration: initialConfiguration,
    OldConfiguration: initialConfiguration,
    configurationName: "",
    configurationFileType: "",
    csvDelimiter: "",
    csvMapMethod: "",
    csvStartRow: "",
    xmlTradeRoot: "",
    xmlTradeLeg: "",
    dateTimePattern: "",
    enrichmentFirst: [
      { text: "Counterparty", checked: false },
      { text: "Security", checked: false },
      { text: "Portfolio", checked: false },
      { text: "Subportfolio", checked: false },
    ],
    enrichmentSecond: [
      { text: "Broker", checked: false },
      { text: "Bank Account", checked: false },
      { text: "Custody", checked: false },
    ],
    validationFirst: [
      {
        text: "Counterparty",
        checked: false,
        disabled: true,
      },
      { text: "Security", checked: false, disabled: true },
      {
        text: "Portfolio",
        checked: false,
        disabled: true,
      },
      {
        text: "Subportfolio",
        checked: false,
        disabled: true,
      },
    ],
    validationSecond: [
      { text: "Broker", checked: false, disabled: true },
      {
        text: "Bank Account",
        checked: false,
        disabled: true,
      },
      { text: "Custody", checked: false, disabled: true },
    ],
    fileFormatSelected: false,

    csvDelimiterTypes: ["TAB", "COMMA", "SEMI_COLON", "PIPELINE"],
    csvMapMethodTypes: ["MAP_BY_HEADER", "MAP_BY_COLUMN_INDEX", "MAP_ALL"],
    allExportConfigurations: [],
    transactionTypes: [],
    allAssetManagers: [],
  };
  modesofConfiguration = [
    { id: "NEW", name: "Create New Configuration" },
    { id: "MODIFY", name: "Modify existing Configuration" },
    { id: "COPY", name: "Copy existing configuration" },
    { id: "DELETE", name: "Delete existing configuration" },
  ];

  initialState: any;

  numericChangeHandler = (event: { target: { name: any; value: any } }) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({
      configuration: { ...this.state.configuration, [nam]: val },
    });
  };
  textFieldChangeHandler = (event: { target: { name: any; value: any } }) => {
    let nam = event.target.name;
    let val = event.target.value;

    this.setState({
      configuration: { ...this.state.configuration, [nam]: val },
    });
  };

  modeChangeHandler = (event: { target: { name: any; value: any } }) => {
    if (event.target.value === "MODIFY" || event.target.value === "DELETE") {
      this.setState({
        modeofConfiguration: event.target.value,
      });
      let object = { target: { value: this.state.allconfigurations[0].id } };
      this.props.configIdSet(this.state.allconfigurations[0].id);
      this.configurationChangeHandler(object);
    } else if( event.target.value === "COPY"){
        this.setState({
          modeofConfiguration: event.target.value,
        });
        let object = { target: { value: this.state.allconfigurations[0].id } };
        this.props.configIdSet(this.state.allconfigurations[0].id);
        this.configurationChangeHandler(object);
    }else {
      this.props.configIdSet(0);
      this.setState(
        {
          modeofConfiguration: event.target.value,
          configurationName: "",
          configurationFileType: "",
          configuration: initialConfiguration,
          oldConfiguration: initialConfiguration,
        },
        () => this.props.configIdSet(0)
      );
      this.props.mapping.current.setState(
        this.props.mapping.current.initialState
      );
      getTransactionalFields().then((res) => {
        this.props.mapping.current.setState({
          transactionFields: res,
        });
      });
    }
  };

  modifyConfigurationChangeHandler(id: any) {
    getConfiguration(id, UserUtils.getUser()?.customerId).then((res) => {
      var _config: Configuration = res ? res : {};
      this.setState({
        configuration: { ..._config },
        oldConfiguration: { ..._config },
        modeofConfiguration: "MODIFY",
        modifySelected: true,
      });
      this.props.mapping.current.setState({ fields: _config.fieldMappings });
    });
  }

  copyConfigurationChangeHandler(id: any) {
    getConfiguration(id, UserUtils.getUser()?.customerId).then((res) => {
      var _config: Configuration = res ? res : {};
      console.log(_config)
      this.setState({
        configuration: { ..._config ,assetManagers:[],name:_config.name+'-COPY'},
        oldConfiguration: { ..._config },
        modeofConfiguration: "COPY",
        modifySelected: false
      });
      this.props.mapping.current.setState({ fields: _config.fieldMappings });
    });
  }


  delConfigurationChangeHandler = (configId:any) => {
    var res = window.confirm(
      "Are you sure you want to delete this configuration"
    );
    if (res) {
      deleteConfiguration(
        configId,
        UserUtils.getUser()?.customerId
      ).then((res) => {
        alert("configuration deleted with id: " + configId);
        this.setState({
          ...this.initialState,
          modeofConfiguration: "DELETE",
        });
        getAllConfiguration(UserUtils.getUser()?.customerId).then((res) => {
          this.setState(
            {
              ...this.state,
              modeofConfiguration: "DELETE",
              allconfigurations: [...res],
            },
            () => {
              let object = {
                target: { value: this.state.allconfigurations[0].id },
              };
              this.props.configIdSet(this.state.allconfigurations[0].id);
              this.configurationChangeHandler(object);
            }
          );
        });
      });
    }
  };

  configurationChangeHandler = (event: { target: { value: any } }) => {
    getConfiguration(event.target.value, UserUtils.getUser()?.customerId).then(
      (res) => {
        var _config: Configuration = res ? res : {};
        this.setState({
          configuration: { ..._config },
          oldConfiguration: { ..._config }
        });
        this.props.mapping.current.setState({ fields: _config.fieldMappings });
      }
    );
    this.props.configIdSet(parseInt(event.target.value));
  };

  dropDownChangeHandler = (event: { target: { name: any; value: any } }) => {
    if (event.target.name === "transactionType") {
      this.setState({
        configuration: {
          ...this.state.configuration,
          [event.target.name]: event.target.value,
        },
      });
    } else {
      this.setState({
        configuration: {
          ...this.state.configuration,
          [event.target.name]: JSON.parse(event.target.value),
        },
      });
    }
  };

  underlyingSecurityChangeHandler = (event: {
    target: { name: any; value: any };
  }) => {
    if (event.target.name === "underlyingSecurity") {
      this.setState({
        configuration: {
          ...this.state.configuration,
          [event.target.name]: event.target.value,
        },
      });
    } else {
      this.setState({
        configuration: {
          ...this.state.configuration,
          [event.target.name]: JSON.parse(event.target.value),
        },
      });
    }
  };

  assetManagerChangeHandler = (event: { target: any }) => {
    var AssetManagers = event.target.selectedOptions;
    var selectedAssetManagers = [];
    for (let i = 0; i < AssetManagers.length; i++) {
      selectedAssetManagers.push(AssetManagers[i].value);
    }
    this.setState({
      configuration: {
        ...this.state.configuration,
        assetManagers: [...selectedAssetManagers],
      },
    });
  };

  enrichmentValidationCheckHandler = (event: {
    target: { name: any; value: any };
  }) => {
    this.setState({
      configuration: {
        ...this.state.configuration,
        [event.target.name]: !JSON.parse(event.target.value),
      },
    });
  };
  resetState = () => {
    getAllConfiguration(UserUtils.getUser()?.customerId).then((res) => {
      this.setState({ allconfigurations: [...res] });
    });
    getAssetManagersByCustomerId(UserUtils.getUser()?.customerId)
      .then((res) => {
        this.setState({ allAssetManagers: [...res] });
      })
      .catch((err) => {
        this.setState({ allAssetManagers: [] });
        // commonError(err.response.status, "CONFIGURATIONS");
      });
    getAllTransactionTypes(UserUtils.getUser()?.customerId)
      .then((res) => {
        this.setState({ transactionTypes: [...res] });
      })
      .catch((err) => {
        this.setState({ transactionTypes: [] });
        //  commonError(err.response.status, "CONFIGURATIONS");
      });
    getAllExportConfig(UserUtils.getUser()?.customerId)
      .then((res) => {
        this.setState({ allExportConfigurations: [...res] });
      })
      .catch((err) => {
        this.setState({ allExportConfigurations: [] });
        //   commonError(err.response.status, "CONFIGURATIONS");
      });
  };

  delConfiguration = () => {
    var res = window.confirm(
      "Are you sure you want to delete this configuration"
    );
    if (res) {
      deleteConfiguration(
        this.state.configuration.id,
        UserUtils.getUser()?.customerId
      ).then((res) => {
        alert("configuration deleted with id: " + this.state.configuration.id);
        this.setState({
          ...this.initialState,
          modeofConfiguration: "DELETE",
        });
        getAllConfiguration(UserUtils.getUser()?.customerId).then((res) => {
          this.setState(
            {
              ...this.state,
              modeofConfiguration: "DELETE",
              allconfigurations: [...res],
            },
            () => {
              let object = {
                target: { value: this.state.allconfigurations[0].id },
              };
              this.props.configIdSet(this.state.allconfigurations[0].id);
              this.configurationChangeHandler(object);
            }
          );
        });
      });
    }
  };

  constructor(props: { mapping: any; configId: any; configIdSet: any,configAction:string }) {
    super(props);
    this.numericChangeHandler = this.numericChangeHandler.bind(this);
    this.initialState = this.state;
  }

  componentDidMount() {
    getAllConfiguration(UserUtils.getUser()?.customerId)
      .then((res) => {
        this.setState({ allconfigurations: [...res] });
      })
      .catch((err) => {
        this.setState({ allconfigurations: [] });
        //commonError(err.response.status, "CONFIGURATIONS");
      });
    getAssetManagersByCustomerId(UserUtils.getUser()?.customerId)
      .then((res) => {
        this.setState({ allAssetManagers: [...res] });
      })
      .catch((err) => {
        this.setState({ allAssetManagers: [] });
        commonError(err.response.status, "CONFIGURATIONS");
      });
    getAllTransactionTypes(UserUtils.getUser()?.customerId)
      .then((res) => {
        this.setState({ transactionTypes: [...res] });
      })
      .catch((err) => {
        this.setState({ transactionTypes: [] });
        commonError(err.response.status, "CONFIGURATIONS");
      });
    getAllExportConfig(UserUtils.getUser()?.customerId)
      .then((res) => {
        this.setState({ allExportConfigurations: [...res] });
      })
      .catch((err) => {
        this.setState({ allExportConfigurations: [] });
        commonError(err.response.status, "CONFIGURATIONS");
      });
  }
  componentDidUpdate() {
    if (
      this.state.configuration.id !== this.props.configId &&
      (this.props.configAction === "NEW" || this.props.configAction === "MODIFY")
    ) {
      this.modifyConfigurationChangeHandler(this.props.configId);
    }else if ( this.state.configuration.id !== this.props.configId &&
      this.props.configAction === "COPY"){
      this.copyConfigurationChangeHandler(this.props.configId);
    }else if ( this.state.configuration.id !== this.props.configId &&
      this.props.configAction === "DELETE"){
        this.delConfigurationChangeHandler(this.props.configId);
    }
  }

  saveData = () => {
    if (
      this.state.configuration.fileFormat === "" ||
      this.state.configuration.name === ""
    ) {
      this.setState({
        showSubmitModal: false,
        errorMessage: this.state.configuration.fileFormat
          ? "No Value for File format selected. Please select the file format you want for the configuration"
          : "No Value for Name selected. Please Enter the Name you want for the configuration",
        submitError: true,
      });
    } else {
      var _configData;
      if (this.state.modeofConfiguration === "MODIFY") {
           _configData = {
              ...this.state.configuration,
              fieldMappings:
                 this.props.mapping.current?.state.fields === undefined
                    ? []
                    : this.props.mapping.current?.state.fields,
           };
      } else {
        _configData = {
          allowUpdates: this.state.configuration.allowUpdates,
          assetManagers: this.state.configuration.assetManagers,
          autoConfirm: this.state.configuration.autoConfirm,
          cancelAndResend: this.state.configuration.cancelAndResend,
          checkAmount: this.state.configuration.checkAmount,
          customerId: UserUtils.getUser()?.customerId,
          defaultDateFormatPattern:
            this.state.configuration.defaultDateFormatPattern,
          delimiter: this.state.configuration.delimiter,
          enrichBankAccount: this.state.configuration.enrichBankAccount,
          enrichBroker: this.state.configuration.enrichBroker,
          enrichCounterparty: this.state.configuration.enrichCounterparty,
          enrichCurrencyCross: this.state.configuration.enrichCurrencyCross,
          enrichCustody: this.state.configuration.enrichCustody,
          enrichPortfolio: this.state.configuration.enrichPortfolio,
          enrichSubportfolio: this.state.configuration.enrichSubportfolio,
          enrichSecurity: this.state.configuration.enrichSecurity,
          enrichOtcSecurity: this.state.configuration.enrichOtcSecurity,
          exportConfigurationId: this.state.configuration.exportConfigurationId,
          fieldMappings: this.props.mapping.current?.state.fields,
          fileFormat: this.state.configuration.fileFormat,
          fileUpload: this.state.configuration.fileUpload,
          formSubmitConfig: this.state.configuration.formSubmitConfig,
          mapMethod: this.state.configuration.mapMethod,
          name: this.state.configuration.name,
          sftp: this.state.configuration.sftp,
          startRow: Number(this.state.configuration.startRow),
          toleranceLevelPercent: this.state.configuration.toleranceLevelPercent,
          transactionType: this.state.configuration.transactionType,
          validateBankAccount: this.state.configuration.validateBankAccount,
          validateBroker: this.state.configuration.validateBroker,
          validateCounterparty: this.state.configuration.validateCounterparty,
          validateCurrencyCross: this.state.configuration.validateCurrencyCross,
          validateCustody: this.state.configuration.validateCustody,
          validatePortfolio: this.state.configuration.validatePortfolio,
          validateSubportfolio: this.state.configuration.validateSubportfolio,
          validateSecurity: this.state.configuration.validateSecurity,
          validateOtcSecurity: this.state.configuration.validateOtcSecurity,
          validatePosition: this.state.configuration.validatePosition,
          updatePosition: this.state.configuration.updatePosition,
          xmlTradeLeg: this.state.configuration.xmlTradeLeg,
          xmlTradeRoot: this.state.configuration.xmlTradeRoot,
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

  render() {
    return (
      <div
        className="GridWrapper"
        onClick={() => this.setState({ showSubmitModal: true })}
      >
        <Form>
          <Row>
            <Col>
              <Form.Label column sm="4">
                Select Mode for Configuration
              </Form.Label>
              <Form.Control
                as="select"
                name="configuration"
                onChange={this.modeChangeHandler}
                value={this.state.modeofConfiguration}
              >
                {this.modesofConfiguration.map((configuration: any) => {
                  return (
                     <option
                        value={configuration.id}
                        key={configuration.id}
                      disabled={
                        configuration.id.toString() === "COPY" ? true : false
                      }
                     >
                        {configuration.name}
                     </option>
                  );
                })}
              </Form.Control>
            </Col>
            {this.state.modeofConfiguration !== "NEW" && (
              <>
                <Col>
                  {" "}
                  <Form.Label column sm="4">
                    Select Configuration
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="configuration"
                    onChange={this.configurationChangeHandler}
                    hidden={this.state.modeofConfiguration === "NEW"}
                  >
                    {this.state.allconfigurations.map(
                      (configuration: Configuration) => {
                        return (
                          <option
                            value={configuration.id}
                            key={configuration.id}
                            selected={configuration.id == this.props.configId}
                          >
                            {configuration.name}
                          </option>
                        );
                      }
                    )}
                  </Form.Control>
                </Col>
                {this.state.modeofConfiguration === "DELETE" && (
                  <Button
                    variant="outline-danger"
                    onClick={() => this.delConfiguration()}
                  >
                    Delete
                  </Button>
                )}
              </>
            )}
            {/* <Col>
              <Form.Label column sm="4">
                Select Configuration
              </Form.Label>
              <Form.Control
                as="select"
                name="configuration"
                onChange={this.configurationChangeHandler}
              >
                {this.state.allconfigurations.map(
                  (configuration: Configuration) => {
                    return (
                      <option value={configuration.id} key={configuration.id}>
                        {configuration.name}
                      </option>
                    );
                  }
                )}
              </Form.Control>
              <Button
                variant={
                  this.state.modeofConfiguration === "NEW"
                    ? "success"
                    : "primary"
                }
                size="sm"
                onClick={() =>
                  this.setState({
                    modeofConfiguration: "NEW",
                    configurationName: "",
                    configurationFileType: "",
                  })
                }
                active={this.state.modeofConfiguration === "NEW"}
              >
                Create New Configuration
              </Button>
              <Button
                variant={
                  this.state.modeofConfiguration === "MODIFY"
                    ? "success"
                    : "primary"
                }
                size="sm"
                onClick={() =>
                  this.setState({
                    modeofConfiguration: "MODIFY",
                    configurationName: "",
                    configurationFileType: "",
                  })
                }
              >
                Modify a Configuration
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() =>
                  this.setState({
                    modeofConfiguration: "COPY",
                    configurationName: "",
                    configurationFileType: "",
                  })
                }
                disabled
              >
                Copy a Configuration
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={this.deleteConfiguration}
                disabled={this.state.modifySelected != true}
              >
                Delete a Configuration
              </Button>
            </Col>
          </Row> */}
          </Row>

          <Row>
            <Col>
              <Form.Label column sm="4">
                Configuration Name
              </Form.Label>
              <Form.Control
                type="text"
                id="configurationName"
                name="name"
                value={this.state.configuration.name}
                onChange={this.textFieldChangeHandler}
                style={{ minWidth: "500px" }}
                disabled={
                  this.state.modeofConfiguration === "MODIFY" &&
                  this.state.modifySelected === false
                }
              />
            </Col>
            <Col>
              <Form.Label column sm="4">
                Select File Type
              </Form.Label>
              <Form.Control
                as="select"
                name="fileFormat"
                value={this.state.configuration.fileFormat}
                onChange={this.numericChangeHandler}
                disabled={
                  this.state.modeofConfiguration === "MODIFY" &&
                  this.state.modifySelected === false
                }
              >
                <option value="">Select File Type</option>
                <option value="CSV">CSV</option>
                <option value="XML">XML</option>
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">Enrichments</legend>
                <div
                  hidden={
                    this.state.modeofConfiguration === "MODIFY" &&
                    this.state.modifySelected === false
                  }
                >
                  <Row>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        name="enrichCounterparty"
                        label="Counterparty"
                        checked={
                          this.state.configuration.enrichCounterparty
                            ? true
                            : false
                        }
                        value={this.state.configuration.enrichCounterparty}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        name="enrichSecurity"
                        label="Security/Underlying Security"
                        checked={
                          this.state.configuration.enrichSecurity ? true : false
                        }
                        value={this.state.configuration.enrichSecurity}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        name="enrichPortfolio"
                        label="Portfolio"
                        checked={
                          this.state.configuration.enrichPortfolio
                            ? true
                            : false
                        }
                        value={this.state.configuration.enrichPortfolio}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        name="enrichBroker"
                        label="Broker"
                        checked={
                          this.state.configuration.enrichBroker ? true : false
                        }
                        value={this.state.configuration.enrichBroker}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        name="enrichBankAccount"
                        label="Bank Account"
                        checked={
                          this.state.configuration.enrichBankAccount
                            ? true
                            : false
                        }
                        value={this.state.configuration.enrichBankAccount}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        name="enrichCustody"
                        label="Custody"
                        checked={
                          this.state.configuration.enrichCustody ? true : false
                        }
                        value={this.state.configuration.enrichCustody}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        name="enrichSubportfolio"
                        label="Sub Portfolio"
                        checked={
                          this.state.configuration.enrichSubportfolio
                            ? true
                            : false
                        }
                        value={this.state.configuration.enrichSubportfolio}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        name="enrichOtcSecurity"
                        label="OTC-Instrument"
                        checked={
                          this.state.configuration.enrichOtcSecurity
                            ? true
                            : false
                        }
                        value={this.state.configuration.enrichOtcSecurity}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                    </Col>
                  </Row>
                  <Row>
                    {" "}
                    <Col>
                      <Form.Group
                        className="mb-3"
                        controlId="formEditFieldType"
                      >
                        <Form.Label column sm="4">
                          Transaction Type
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="transactionType"
                          onChange={this.dropDownChangeHandler}
                        >
                          {this.state.transactionTypes.map(
                            (transactionType: any) => {
                              return (
                                <option
                                  value={transactionType.name}
                                  key={transactionType.name}
                                  selected={
                                    transactionType.name ===
                                    this.state.configuration.transactionType
                                  }
                                >
                                  {transactionType.name}
                                </option>
                              );
                            }
                          )}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      {this.state.configuration.enrichOtcSecurity && (
                        <Form.Group
                          className="mb-3"
                          controlId="formEditFieldType"
                        >
                          <Form.Label column sm="4">
                            Select Underlying Security
                          </Form.Label>
                          <Form.Control
                            as="select"
                            name="underlyingSecurity"
                            onChange={this.underlyingSecurityChangeHandler}
                          >
                            <option value="" key=""></option>
                            {this.state.transactionTypes.map(
                              (transactionType: any) => {
                                return (
                                  <option
                                    value={transactionType.name}
                                    key={transactionType.name}
                                    selected={
                                      transactionType.name ===
                                      this.state.configuration
                                        .underlyingSecurity
                                    }
                                  >
                                    {transactionType.name}
                                  </option>
                                );
                              }
                            )}
                          </Form.Control>
                        </Form.Group>
                      )}
                    </Col>
                  </Row>
                </div>
              </fieldset>
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">Validation</legend>
                <div
                  hidden={
                    this.state.modeofConfiguration === "MODIFY" &&
                    this.state.modifySelected === false
                  }
                >
                  <Row>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        disabled={!this.state.configuration.enrichCounterparty}
                        name="validateCounterparty"
                        label="Counterparty"
                        checked={
                          this.state.configuration.validateCounterparty
                            ? true
                            : false
                        }
                        value={this.state.configuration.validateCounterparty}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        disabled={!this.state.configuration.enrichSecurity}
                        name="validateSecurity"
                        label="Security/Underlying Security"
                        checked={
                          this.state.configuration.validateSecurity
                            ? true
                            : false
                        }
                        value={this.state.configuration.validateSecurity}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        disabled={!this.state.configuration.enrichPortfolio}
                        name="validatePortfolio"
                        label="Portfolio"
                        checked={
                          this.state.configuration.validatePortfolio
                            ? true
                            : false
                        }
                        value={this.state.configuration.validatePortfolio}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        disabled={!this.state.configuration.enrichBroker}
                        name="validateBroker"
                        label="Broker"
                        checked={
                          this.state.configuration.validateBroker ? true : false
                        }
                        value={this.state.configuration.validateBroker}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        disabled={!this.state.configuration.enrichBankAccount}
                        name="validateBankAccount"
                        label="Bank Account"
                        checked={
                          this.state.configuration.validateBankAccount
                            ? true
                            : false
                        }
                        value={this.state.configuration.validateBankAccount}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        disabled={!this.state.configuration.enrichCustody}
                        name="validateCustody"
                        label="Custody"
                        checked={
                          this.state.configuration.validateCustody
                            ? true
                            : false
                        }
                        value={this.state.configuration.validateCustody}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                      <Form.Check
                        type="checkbox"
                        name="validateOtcSecurity"
                        label="OTC-Instrument"
                        disabled={!this.state.configuration.enrichOtcSecurity}
                        checked={
                          this.state.configuration.validateOtcSecurity
                            ? true
                            : false
                        }
                        value={this.state.configuration.validateOtcSecurity}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                    </Col>
                    <Col>
                      <Form.Check
                        type="checkbox"
                        disabled={!this.state.configuration.enrichSubportfolio}
                        name="validateSubportfolio"
                        label="Sub Portfolio"
                        checked={
                          this.state.configuration.validateSubportfolio
                            ? true
                            : false
                        }
                        value={this.state.configuration.validateSubportfolio}
                        onChange={this.enrichmentValidationCheckHandler}
                      ></Form.Check>
                    </Col>
                  </Row>
                </div>
              </fieldset>
              <Form.Label>Default Date time Pattern</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new Field"
                name="defaultDateFormatPattern"
                value={this.state.configuration.defaultDateFormatPattern}
                disabled={
                  this.state.modeofConfiguration === "MODIFY" &&
                  this.state.modifySelected === false
                }
                onChange={this.textFieldChangeHandler}
              />
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">
                  Use Configuration For
                </legend>
                <div style={{ width: "fitContent" }}>
                  <table>
                    <tbody>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formEditFieldType"
                      >
                        <Col>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="formSubmitConfig"
                              label="Web Form"
                              checked={
                                this.state.configuration.formSubmitConfig
                                  ? true
                                  : false
                              }
                              key="formSubmitConfig"
                              value={this.state.configuration.formSubmitConfig}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="fileUpload"
                              label="File Upload"
                              checked={
                                this.state.configuration.fileUpload
                                  ? true
                                  : false
                              }
                              key="fileUpload"
                              value={this.state.configuration.fileUpload}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="sftp"
                              label="FTPS Import"
                              checked={
                                this.state.configuration.sftp ? true : false
                              }
                              key="sftp"
                              value={this.state.configuration.sftp}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formEditFieldType"
                          >
                            <Form.Label column sm="4">
                              Transaction Type
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="transactionType"
                              onChange={this.dropDownChangeHandler}
                            >
                              {this.state.transactionTypes.map(
                                (transactionType: any) => {
                                  return (
                                    <option
                                      value={transactionType.name}
                                      key={transactionType.name}
                                      selected={
                                        transactionType.name ===
                                        this.state.configuration.transactionType
                                      }
                                    >
                                      {transactionType.name}
                                    </option>
                                  );
                                }
                              )}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formEditFieldType"
                          >
                            <Form.Label column sm="4">
                              Restrict access for external managers
                            </Form.Label>
                            <Form.Control
                              as="select"
                              multiple
                              onChange={this.assetManagerChangeHandler}
                            >
                              {this.state.allAssetManagers.map(
                                (options: any) => (
                                  <>
                                    <option
                                      key={options}
                                      value={options}
                                      selected={this.state.configuration.assetManagers.some(
                                        (manager: any) => manager === options
                                      )}
                                      label={options}
                                    ></option>
                                  </>
                                )
                              )}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Form.Group>
                    </tbody>
                  </table>
                </div>
              </fieldset>
            </Col>
            <Col>
              {/* part 1 */}
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">
                  {this.state.configuration.fileFormat} Settings
                </legend>
                <div style={{ whiteSpace: "nowrap" }}>
                  {this.state.configuration.fileFormat === "" && <></>}
                  {this.state.configuration.fileFormat === "CSV" && (
                    <div>
                      <table>
                        <tbody>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="csvform"
                          >
                            <Form.Label column sm="4">
                              Delimiter
                            </Form.Label>
                            <Col sm="8">
                              <Form.Control
                                as="select"
                                name="delimiter"
                                onChange={this.numericChangeHandler}
                              >
                                {this.state.csvDelimiterTypes.map(
                                  (type: string, index: number) => {
                                    return (
                                      <option
                                        key={index}
                                        value={type}
                                        selected={
                                          type ===
                                          this.state.configuration.delimiter
                                            ? true
                                            : false
                                        }
                                      >
                                        {type}
                                      </option>
                                    );
                                  }
                                )}
                              </Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formEditFieldType"
                          >
                            <Form.Label column sm="4">
                              Map Method
                            </Form.Label>
                            <Col sm="8">
                              <Form.Control
                                as="select"
                                name="mapMethod"
                                onChange={this.numericChangeHandler}
                              >
                                {this.state.csvMapMethodTypes.map(
                                  (type: string, index: number) => {
                                    return (
                                      <option
                                        key={index}
                                        value={type}
                                        selected={
                                          type ===
                                          this.state.configuration.mapMethod
                                            ? true
                                            : false
                                        }
                                      >
                                        {type}
                                      </option>
                                    );
                                  }
                                )}
                              </Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formEditFieldType"
                          >
                            <Form.Label column sm="4">
                              Startrow
                            </Form.Label>
                            <Col sm="8">
                              <Form.Control
                                type="text"
                                name="startRow"
                                onChange={this.numericChangeHandler}
                                defaultValue={this.state.configuration.startRow}
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {this.state.configuration.fileFormat === "XML" && (
                    <div>
                      <table>
                        <tbody>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="xmlform"
                          >
                            <Form.Label column sm="4">
                              Trade root
                            </Form.Label>
                            <Col sm="8">
                              <Form.Control
                                type="text"
                                name="xmlTradeRoot"
                                onChange={this.numericChangeHandler}
                                defaultValue={
                                  this.state.configuration.xmlTradeRoot
                                }
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formEditFieldType"
                          >
                            <Form.Label column sm="4">
                              Trade leg
                            </Form.Label>
                            <Col sm="8">
                              <Form.Control
                                type="text"
                                name="xmlTradeLeg"
                                onChange={this.numericChangeHandler}
                                defaultValue={
                                  this.state.configuration.xmlTradeLeg
                                }
                              ></Form.Control>
                            </Col>
                          </Form.Group>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </fieldset>
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">Workflow</legend>
                <div style={{ width: "fitContent" }}>
                  <table>
                    <tbody>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="workflowform"
                      >
                        <Col>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="allowUpdates"
                              label="Allow Updates"
                              checked={
                                this.state.configuration.allowUpdates
                                  ? true
                                  : false
                              }
                              value={this.state.configuration.allowUpdates}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="cancelAndResend"
                              label="Cancel and Resend"
                              checked={
                                this.state.configuration.cancelAndResend
                                  ? true
                                  : false
                              }
                              value={this.state.configuration.cancelAndResend}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="allowUpdatesOnConfirmed"
                              label="Allow update on Confirm"
                              checked={
                                this.state.configuration.allowUpdatesOnConfirmed
                                  ? true
                                  : false
                              }
                              value={
                                this.state.configuration.allowUpdatesOnConfirmed
                              }
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="validatePosition"
                              label="Validate OTC Position"
                              checked={
                                this.state.configuration.validatePosition
                                  ? true
                                  : false
                              }
                              value={this.state.configuration.validatePosition}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="autoConfirm"
                              label="Auto Confirm"
                              checked={
                                this.state.configuration.autoConfirm
                                  ? true
                                  : false
                              }
                              value={this.state.configuration.autoConfirm}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="checkAmount"
                              label="Check Payment Amount"
                              checked={
                                this.state.configuration.checkAmount
                                  ? true
                                  : false
                              }
                              value={this.state.configuration.checkAmount}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                          <Form.Group style={{ marginBottom: "0px" }}>
                            <Form.Check
                              type="checkbox"
                              name="updatePosition"
                              label="Update OTC Position"
                              checked={
                                this.state.configuration.updatePosition
                                  ? true
                                  : false
                              }
                              value={this.state.configuration.updatePosition}
                              onChange={this.enrichmentValidationCheckHandler}
                            ></Form.Check>
                          </Form.Group>
                        </Col>
                      </Form.Group>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formEditFieldType"
                      >
                        <Form.Label column sm="4">
                          Pick export configuration to use after transaction is
                          saved
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="exportConfigurationId"
                          onChange={this.dropDownChangeHandler}
                        >
                          <option value="0" key="0" selected disabled>
                            Select the export configuration
                          </option>
                          {this.state.allExportConfigurations.map(
                            (configuration: exportConfiguration) => {
                              return (
                                <option
                                  value={configuration.id}
                                  key={configuration.id}
                                  selected={
                                    configuration.id ===
                                    this.state.configuration
                                      .exportConfigurationId
                                  }
                                >
                                  {configuration.name}
                                </option>
                              );
                            }
                          )}
                        </Form.Control>
                      </Form.Group>
                    </tbody>
                  </table>
                </div>
              </fieldset>
            </Col>
          </Row>

          <Row>
            <Col>
              {
                <Modal
                  className={
                    this.state.submitError ? "submitSuccess" : "submitFailure"
                  }
                  show={!this.state.showSubmitModal}
                  onHide={this.resetState}
                  onClick={() => this.setState({ showSubmitModal: true })}
                >
                  <Modal.Body>
                    <Alert
                      variant={this.state.submitError ? "danger" : "success"}
                    >
                      {!this.state.submitError
                        ? "You have successfully submitted the configuration"
                        : this.state.errorMessage}
                    </Alert>
                  </Modal.Body>
                </Modal>
              }
            </Col>
            <Col>
              {JSON.stringify(this.state.configuration) ===
              JSON.stringify(this.state.oldConfiguration) ? (
                <></>
              ) : (
                <Button variant="outline-success" onClick={this.saveData}>
                  Submit
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
