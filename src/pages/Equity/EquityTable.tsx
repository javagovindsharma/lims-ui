import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment-timezone";
import {
   Accordion,
   Button,
   Card,
   Col,
   Form,
   FormControl,
   InputGroup,
   Modal,
   Row,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { MultiSelect } from "react-multi-select-component";
import styled from "styled-components";
import PaginationComponent from "../../components/common/PaginationComponent";
import TableLoader from "../../components/common/TableLoader";
import {
   allTransactionPopUp,
   transactionDataFields,
   transactionLabels,
   transactionStatus,
} from "../../helpers/constants";
import {
   AccordianStyles,
   allReportDateFormatter,
   nullColumnFormatter,
   onlyDateFormatter,
   rowClasses,
   selectRow,
   staticRequestedColumnFormatter,
   Styles,
   transferredColumnFormatter,
} from "../../helpers/tableHelpers";
import { UserUtils } from "../../lib/authenticationUtils";
import store from "../../store";
import {
   initialSearchMap,
   initialTransaction,
   Transaction,
} from "../../types/Transaction";
import { searchTransaction } from "../AllTransactions/TransactionService";
import { commonError } from "../common/commonError";
import getEquities from "./EquityService";

const { ExportCSVButton } = CSVExport;
// const { ToggleList } = ColumnToggle;
const mystyle = {
   whiteSpace: "pre-wrap",
   padding: "10px",
} as React.CSSProperties;

const greenStyle = {
   color: "green",
} as React.CSSProperties;

const redStyle = {
   color: "red",
} as React.CSSProperties;

const blackStyle = {
   color: "#525f7f",
} as React.CSSProperties;

const orangeStyle = {
   color: "orange",
} as React.CSSProperties;

const LoaderStyle = styled.div`
   .cs-loader {
      top: 30%;
   }
`;

const transferredStyle = (
   cell: any,

   row: any,

   rowIndex: any,

   colIndex: any
) => {
   if (
      (row.action === "CON" || row.action === "NEW") &&
      row.transferred === true
   ) {
      return greenStyle;
   } else if (row.action === "CAN" && row.transferred === true) {
      return redStyle;
   } else if (row.staticRequested === true) {
      return orangeStyle;
   }

   return blackStyle;
};

const EquityTable = (props: any) => {
   const [records, setTxns] = useState([]);
   const [currentPage, setCurrentPage] = useState(0);
   const [bondsPerPage, setBondsPerPage] = useState(10);
   const [totalPages, setTotalPages] = useState(0);
   const configref = useRef<BootstrapTable>(null);
   const [showModal, setShowModal] = useState(false);
   const [dataModal, setModalData] = useState(initialTransaction);
   const [selectedParams, setSelectedParams] = useState([]);
   const [searchParam, setSearchParam] = useState("instrumentShort");
   const [searchMap, setSearchMap] = useState({
      ...initialSearchMap,
      transactionType: ["EQUITY"],
      assetMgr: UserUtils.getUser()?.assetManager,
      customerId: UserUtils.getUser()?.customerId,
   });
   const [transactionSearchParam, setTransactionSearchParam] = useState([]);
   const [toggle, setToggle] = useState(true);
   const [initialMap, setInitialMap] = useState({
      ...initialSearchMap,
      assetMgr: UserUtils.getUser()?.assetManager,
      customerId: UserUtils.getUser()?.customerId,
      transactionType: ["EQUITY"],
   });
   const [sortColumn, setSortColumn] = useState("transoriginNo");
   const [sortDirection, setSortDirection] = useState("DESC");
   const [itemsOnPage, setItemsOnPage] = useState(props.itemsOnPage);
   const [totalItems, setTotalItems] = useState(props.totalItems);
   const [timeZone, setTimeZone] = useState(
      store.getState().auth.userSetting.timeZone
   );
   useEffect(() => {
      setTxns(props.txn);

      setTotalPages(props.pages);
      setItemsOnPage(props.itemsOnPage);
      setTotalItems(props.totalItems);
   }, [props.txn]);

   useEffect(() => {
      if (timeZone !== store.getState().auth.userSetting.timeZone) {
         if (JSON.stringify(initialMap) === JSON.stringify(searchMap)) {
            loadEquityTransaction(
               currentPage,
               bondsPerPage,
               sortColumn,
               sortDirection
            );
         } else {
            loadSearchedTransaction(searchMap, bondsPerPage, currentPage);
         }
         setTimeZone(store.getState().auth.userSetting.timeZone);
      }
   }, [store.getState().auth.userSetting.timeZone]);

   const NoDataIndication = () => (
      <>
         {props.pages === -2 && (
            <LoaderStyle>
               <TableLoader />
            </LoaderStyle>
         )}
         {props.pages === 0 && <b>No Record Found</b>}
         {props.pages === -3 && (
            <b>There is an error in loading the data in table</b>
         )}
      </>
   );

   function loadEquityTransaction(
      currentPage: any,
      equityPerPage: any,
      sortBy: any,
      direction: any
   ) {
      setTxns([]);
      props.setTotal(-2);
      getEquities(currentPage, equityPerPage, sortBy, direction)
         .then((res) => {
            let TransactionsDataBackend = res.content ? res.content : [];
            setTxns(TransactionsDataBackend);
            props.setTotal(res.totalPages);
            setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
            setItemsOnPage(res.numberOfElements);
         })
         .catch((err) => {
            props.setTotal(-3);
            commonError(err.response.status, "BONDTABLE");
         });
   }
   function sortingTable(column: any, order: any) {
      setSortColumn(column);
      setSortDirection(order.toUpperCase());
   }

   const pageChange = (event: any) => {
      setCurrentPage(event);
      if (JSON.stringify(initialMap) === JSON.stringify(searchMap)) {
         loadEquityTransaction(event, bondsPerPage, sortColumn, sortDirection);
      } else {
         loadSearchedTransaction(searchMap, bondsPerPage, event);
      }
   };
   const hideModal = () => {
      setShowModal(false);
   };
   const getModal = (data: Transaction) => {
      setModalData(data);
      setShowModal(true);
   };

   const sizeChange = (event: any) => {
      setCurrentPage(0);
      setBondsPerPage(event);
      if (JSON.stringify(initialMap) === JSON.stringify(searchMap)) {
         loadEquityTransaction(0, event, sortColumn, sortDirection);
      } else {
         loadSearchedTransaction(searchMap, event, 0);
      }
   };

   const columns = [
      {
         dataField: "transoriginNo",
         text: transactionLabels.TRANSACTION_ID.text,
         sort: true,
         key: 1,
         //headerFormatter:columnFormatter,
         // csvFormatter: (cell: any, row: any, rowIndex: any) => `$ ${cell}NTD`,
         events: {
            onClick: (
               e: any,
               column: any,
               columnIndex: any,
               row: any,
               rowIndex: any
            ) => {
               // alert("Click on txn ID field value " + row.transoriginNo);
               getModal(row);
            },
         },
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
         // filter: textFilter()
      },
      {
         dataField: transactionDataFields.createdDate.text,
         text: transactionLabels.CREADTED_DATE.text,
         sort: true,
         formatter: allReportDateFormatter,
         key: 2,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.status.text,
         text: transactionLabels.STATUS.text,
         sort: true,
         key: 3,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
         formatter: (
            cell: any,
            row: any,
            rowIndex: any,
            formatExtraData: any
         ) => {
            var m = "New";
            if (row.action === "UPD") {
               m = "Update";
            }
            if (row.action === "CON") {
               m = "Confirmed";
            }
            if (row.action === "CAN") {
               m = "Cancelled";
            }
            if (row.action === "UPD_CON") {
               m = "Updated";
            }
            return <>{m}</>;
         },
      },
      {
         dataField: transactionDataFields.assetManager.text,
         text: transactionLabels.ASSET_MANAGER.text,
         sort: true,
         key: 4,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.portfolioShort.text,
         text: transactionLabels.PORTFOLIO_NAME.text,
         sort: true,
         key: 5,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
         hover: true,
         attrs: (
            e: any,
            column: any,
            columnIndex: any,
            row: any,
            rowIndex: any
         ) => {
            return { title: column.portfolioName };
         },
      },
      {
         dataField: transactionDataFields.counterpartyShort.text,
         text: transactionLabels.COUNTERPARTY_ID.text,
         key: 6,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         hover: true,
         onSort: sortingTable,
         sort: true,
         attrs: (
            e: any,
            column: any,
            columnIndex: any,
            row: any,
            rowIndex: any
         ) => {
            return { title: column.counterpartyName };
         },
      },
      {
         dataField: transactionDataFields.valueDate.text,
         text: transactionLabels.TRADE_DATE.text,
         sort: true,
         key: 7,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.settlement_date.text,
         text: transactionLabels.SETTLEMENT_DATE.text,
         sort: true,
         key: 8,
         formatter: onlyDateFormatter,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.transactionCode.text,
         text: transactionLabels.TRANSACTION_CODE.text,
         sort: true,
         key: 9,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.instrumentShort.text,
         text: transactionLabels.INSTRUMENT_SHORT.text,
         sort: true,
         key: 10,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         hover: true,
         onSort: sortingTable,
         attrs: (
            e: any,
            column: any,
            columnIndex: any,
            row: any,
            rowIndex: any
         ) => {
            return { title: column.instrumentName };
         },
      },
      {
         dataField: transactionDataFields.instrument_type.text,
         text: transactionLabels.INSTRUMENT_TYPE.text,
         sort: true,
         key: 11,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.nominal.text,
         text: transactionLabels.NOMINAL.text,
         sort: true,
         key: 12,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.price.text,
         text: transactionLabels.PRICE.text,
         sort: true,
         key: 13,
         formatter: nullColumnFormatter,
         onSort: sortingTable,
         headerStyle: mystyle,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.paymentAmount.text,
         text: transactionLabels.PAYMENT_AMOUNT.text,
         sort: true,
         key: 14,
         formatter: nullColumnFormatter,
         onSort: sortingTable,
         headerStyle: mystyle,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.currency.text,
         text: transactionLabels.CURRENCY.text,
         sort: true,
         key: 15,
         formatter: nullColumnFormatter,
         onSort: sortingTable,
         headerStyle: mystyle,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.externalTradeId.text,
         text: transactionLabels.EXTERNALTRADEID.text,
         sort: true,
         key: 16,
         formatter: nullColumnFormatter,
         onSort: sortingTable,
         headerStyle: mystyle,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.staticRequested.text,
         text: transactionLabels.STATIC_REQUESTED.text,
         sort: true,
         key: 17,
         formatter: staticRequestedColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.transferred.text,
         text: transactionLabels.TRANSFERRED.text,
         sort: true,
         key: 18,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
         formatter: transferredColumnFormatter,
      },
   ];

   const changeSearchValue = (event: any) => {
      var alteredSearchMap = searchMap;
      if (
         event.target.id === "transoriginNo" ||
         event.target.id === "nominal"
      ) {
         const re = /^[0-9\b]+$/;
         if (event.target.value === "0" || re.test(event.target.value)) {
            alteredSearchMap = {
               ...alteredSearchMap,
               [event.target.id]:
                  event.target.value === 0 ? "" : Number(event.target.value),
            };
         } else {
            alteredSearchMap = {
               ...alteredSearchMap,
               [event.target.id]: isNaN(event.target.value)
                  ? ""
                  : event.target.value.toUpperCase(),
            };
         }
      } else {
         alteredSearchMap = {
            ...alteredSearchMap,
            [event.target.id]: event.target.value.toUpperCase(),
         };
      }
      setSearchMap(alteredSearchMap);
   };

   function loadSearchedTransaction(
      SearchMap: any,
      sizePerPage: any,
      currentPage: any
   ) {
      setTxns([]);
      props.setTotal(-2);
      searchTransaction(SearchMap, sizePerPage, currentPage)
         .then((res) => {
            const TransactionsDataBackend = res.content ? res.content : [];
            setTxns(TransactionsDataBackend);
            props.setTotal(res.totalPages);
            setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
            setItemsOnPage(res.numberOfElements);
         })
         .catch((err) => {
            props.setTotal(-3);
            console.log(err);
         });
   }

   const setTransactionStatusSearch = () => {
      var statuses: any[] = [];

      selectedParams.map((entry: any) => statuses.push(entry.value));
      setSearchMap({
         ...searchMap,
         status: statuses,
      });
      setCurrentPage(0);
      loadSearchedTransaction(
         {
            ...searchMap,
            status: statuses,
            transactionType: ["EQUITY"],
         },
         bondsPerPage,
         0
      );
   };
   const options: any = {
      onSizePerPageChange: (sizePerPage: string, page: string) => {},
      onPageChange: (page: string, sizePerPage: string) => {},
   };
   return (
      <ToolkitProvider
         keyField="transoriginNo"
         data={records}
         columns={columns}
         //  columnToggle
         search
         exportCSV={{
            fileName: "equity" + new Date() + ".csv",
            separator: ",",
            ignoreHeader: false,
            noAutoBOM: false,
            // onlyExportFiltered:true,
            // onlyExportSelection:true,
            onlyExportSelection: selectRow.length > 0 ? true : false,
            exportAll: true,
         }}
      >
         {(prop) => (
            <div>
               <AccordianStyles>
                  <Accordion defaultActiveKey="">
                     <Card style={{ overflow: "inherit" }}>
                        <Card.Header
                           className={toggle ? "toggledown" : "toggleup"}
                        >
                           <Accordion.Toggle
                              as={Card.Header}
                              eventKey="0"
                              className={toggle ? "toggledown" : "toggleup"}
                              onClick={() => setToggle(!toggle)}
                           >
                              Search Your Transaction
                           </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                           <Card.Body>
                              <Row>
                                 <Col>
                                    <InputGroup className="mb-2">
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Trade Id
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          type="text"
                                          id="transoriginNo"
                                          placeholder="Trade ID"
                                          value={
                                             searchMap.transoriginNo === 0
                                                ? null
                                                : searchMap.transoriginNo
                                          }
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Created Date Range
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          type="date"
                                          id="createdDateFrom"
                                          value={searchMap.createdDateFrom}
                                          onChange={changeSearchValue}
                                       />
                                       <FormControl
                                          type="date"
                                          id="createdDateTo"
                                          value={searchMap.createdDateTo}
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Asset Mgr
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id="assetMgr"
                                          placeholder="Asset Manager"
                                          value={
                                             UserUtils.getUser()
                                                ?.assetManager === ""
                                                ? searchMap.assetMgr
                                                : UserUtils.getUser()
                                                     ?.assetManager
                                          }
                                          onChange={changeSearchValue}
                                          disabled={
                                             UserUtils.getUser()
                                                ?.assetManager !== ""
                                          }
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Status
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <Styles>
                                          <MultiSelect
                                             options={transactionStatus}
                                             value={selectedParams}
                                             labelledBy="AD"
                                             hasSelectAll={false}
                                             disableSearch={true}
                                             onChange={setSelectedParams}
                                          />
                                       </Styles>
                                    </InputGroup>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col>
                                    <InputGroup className="mb-2">
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Portfolio
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id="portfolioShort"
                                          placeholder="Portfolio Short"
                                          value={searchMap.portfolioShort}
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Counterparty
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id="counterpartyShort"
                                          placeholder="Counterparty Short"
                                          value={searchMap.counterpartyShort}
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Trade Date Range
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id="tradeDateFrom"
                                          type="date"
                                          value={searchMap.tradeDateFrom}
                                          onChange={changeSearchValue}
                                       />
                                       <FormControl
                                          id="tradeDateTo"
                                          type="date"
                                          value={searchMap.tradeDateTo}
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <Form.Control
                                             as="select"
                                             style={{ color: "black" }}
                                             value={searchParam}
                                             onChange={(event: any) =>
                                                setSearchParam(
                                                   event.target.value
                                                )
                                             }
                                          >
                                             <option value="instrumentShort">
                                                Instrument
                                             </option>
                                             <option value="isin">ISIN</option>
                                             <option value="sedol">
                                                SEDOL
                                             </option>
                                             <option value="bloombergId">
                                                BloomBerg ID
                                             </option>
                                          </Form.Control>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id={searchParam}
                                          value={
                                             searchParam === "isin"
                                                ? searchMap.isin
                                                : searchParam === "sedol"
                                                ? searchMap.sedol
                                                : searchParam === "bloombergId"
                                                ? searchMap.bloombergId
                                                : searchMap.instrumentShort
                                          }
                                          placeholder={
                                             searchParam === "instrumentShort"
                                                ? "Instrument Short"
                                                : searchParam === "bloombergId"
                                                ? "BloomBerg ID"
                                                : searchParam.toLocaleUpperCase()
                                          }
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col>
                                    <InputGroup className="mb-2">
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Nominal
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id="nominal"
                                          placeholder="Nominal"
                                          value={searchMap.nominal}
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             External Trade Id
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id="externalTradeId"
                                          placeholder="External Trade ID"
                                          value={searchMap.externalTradeId}
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Currency
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id="currency"
                                          placeholder="Currency"
                                          value={searchMap.currency}
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Transaction Type
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>

                                       <FormControl
                                          readOnly={true}
                                          value="Equity"
                                       />
                                    </InputGroup>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Instrument Requested
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <Form.Control
                                          as="select"
                                          custom
                                          id="staticRequested"
                                          defaultValue={
                                             searchMap.staticRequested
                                          }
                                          onChange={changeSearchValue}
                                       >
                                          <option
                                             value=""
                                             selected={
                                                searchMap.staticRequested === ""
                                             }
                                          >
                                             Both
                                          </option>
                                          <option value="true">Yes</option>
                                          <option value="false">No</option>
                                       </Form.Control>
                                    </InputGroup>
                                 </Col>
                                 <Col>
                                    <InputGroup>
                                       <InputGroup.Prepend>
                                          <InputGroup.Text
                                             style={{ color: "black" }}
                                          >
                                             Instrument Type
                                          </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <FormControl
                                          id="instrumentType"
                                          placeholder="Instrument Type"
                                          value={searchMap.instrumentType}
                                          onChange={changeSearchValue}
                                       />
                                    </InputGroup>
                                 </Col>
                                 <Col></Col>
                                 <Col></Col>
                              </Row>
                              <Row>
                                 <Col></Col>
                                 <Col></Col>
                                 <Col>
                                    <Button
                                       variant="outline-primary"
                                       onClick={() => {
                                          if (
                                             searchMap.createdDateFrom >
                                             searchMap.createdDateTo
                                          ) {
                                             alert(
                                                "Created Date to is less than Created Date From"
                                             );
                                          } else if (
                                             searchMap.tradeDateFrom >
                                             searchMap.tradeDateTo
                                          ) {
                                             alert(
                                                "To Trade Date is smaller than From Trade Date"
                                             );
                                          } else {
                                             setTransactionStatusSearch();
                                          }
                                       }}
                                    >
                                       <i className="fas fa-search" /> Search
                                    </Button>{" "}
                                    <Button
                                       variant="outline-secondary"
                                       onClick={() => {
                                          setSearchMap({
                                             ...initialSearchMap,
                                             transactionType: ["EQUITY"],
                                             assetMgr:
                                                UserUtils.getUser()
                                                   ?.assetManager,
                                             customerId:
                                                UserUtils.getUser()?.customerId,
                                          });
                                          setTransactionSearchParam([]);
                                          setSelectedParams([]);
                                          loadEquityTransaction(
                                             0,
                                             bondsPerPage,
                                             "transoriginNo",
                                             "DESC"
                                          );
                                       }}
                                    >
                                       Reset
                                    </Button>{" "}
                                 </Col>
                                 <Col></Col>
                                 <Col></Col>
                              </Row>
                           </Card.Body>
                        </Accordion.Collapse>
                     </Card>
                  </Accordion>
               </AccordianStyles>

               {/* <ToggleList { ...props.columnToggleProps } /> */}

               <BootstrapTable
                  selectRow={selectRow}
                  {...prop.baseProps}
                  rowClasses={rowClasses}
                  //condensed={true}
                  striped={true}
                  bordered={true}
                  hover={true}
                  headerClasses="thead-all"
                  condensed={true}
                  ref={configref}
                  noDataIndication={() => <NoDataIndication />}
               />
               {props.pages > 0 && (
                  <PaginationComponent
                     numberOfPages={props.pages}
                     currentPage={currentPage}
                     sizeChange={sizeChange}
                     changePage={pageChange}
                     sizePerPage={bondsPerPage}
                     itemOnPage={itemsOnPage}
                     totalItems={totalItems}
                  />
               )}

               <ExportCSVButton {...prop.csvProps}>Export CSV</ExportCSVButton>
               <Modal
                  show={showModal}
                  onHide={hideModal}
                  name="logs"
                  // name={this.state.dataModal.data.length}
               >
                  <div className="modal-content">
                     <Modal.Header closeButton translate="true">
                        <Modal.Title>
                           {" "}
                           IHUB {dataModal.transoriginNo}{" "}
                        </Modal.Title>
                     </Modal.Header>

                     <div className="modal-body">
                        <Modal.Body>
                           {allTransactionPopUp.map((field: any) => (
                              <>
                                 {Object.entries(dataModal).map(
                                    ([key, value]) => {
                                       if (
                                          key === field.fieldName &&
                                          value !== ""
                                       ) {
                                          if (field.text.endsWith("Date")) {
                                             return (
                                                <>
                                                   <b>{field.text}: </b>
                                                   {moment
                                                      .parseZone(value)
                                                      .tz(
                                                         store.getState().auth
                                                            .userSetting
                                                            .timeZone
                                                      )
                                                      .format("YYYY-MM-DD")}
                                                   <br />
                                                </>
                                             );
                                          }
                                          if (field.text.endsWith("Time")) {
                                             return (
                                                <>
                                                   <b>{field.text}: </b>
                                                   {moment
                                                      .parseZone(value)
                                                      .tz(
                                                         store.getState().auth
                                                            .userSetting
                                                            .timeZone
                                                      )
                                                      .format(
                                                         "YYYY-MM-DD HH:mm:ss"
                                                      )}
                                                   <br />
                                                </>
                                             );
                                          }
                                          if (
                                             key.includes("action") &&
                                             value === "NEW"
                                          ) {
                                             return (
                                                <>
                                                   <b>{field.text}: </b>
                                                   New
                                                   <br />
                                                </>
                                             );
                                          }
                                          if (
                                             key.includes("action") &&
                                             value === "CON"
                                          ) {
                                             return (
                                                <>
                                                   <b>{field.text}: </b>
                                                   Confirmed
                                                   <br />
                                                </>
                                             );
                                          }
                                          if (
                                             key.includes("action") &&
                                             value === "UPD"
                                          ) {
                                             return (
                                                <>
                                                   <b>{field.text}: </b>
                                                   Updated
                                                   <br />
                                                </>
                                             );
                                          }
                                          if (
                                             key.includes("action") &&
                                             value === "CAN"
                                          ) {
                                             return (
                                                <>
                                                   <b>{field.text}: </b>
                                                   Cancelled
                                                   <br />
                                                </>
                                             );
                                          }
                                          return (
                                             <>
                                                <b>{field.text}: </b>
                                                {value.toString()}
                                                <br />
                                             </>
                                          );
                                       }
                                    }
                                 )}
                              </>
                           ))}
                        </Modal.Body>
                     </div>
                     <div className="modal-footer">
                        <button
                           type="button"
                           className="btn btn-secondary"
                           onClick={hideModal}
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </Modal>
            </div>
         )}
      </ToolkitProvider>
   );

   //  return <BootstrapTable keyField='id' data={ Equitys } columns={ columns } filter={ filterFactory() } pagination={ paginationFactory({}) } /> ;
};

export default EquityTable;
