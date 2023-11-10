/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";
import "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import {
   Accordion,
   Alert,
   Button,
   Card,
   Col,
   Form,
   FormControl,
   InputGroup,
   Modal,
   Row,
   Table,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
//import "../../css/main.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { MultiSelect } from "react-multi-select-component";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import PaginationComponent from "../../components/common/PaginationComponent";
import TableLoader from "../../components/common/TableLoader";
import {
   allTransactionPopUp,
   transactionDataFields,
   transactionLabels,
   transactionStatus,
   transactionTypeSearch,
} from "../../helpers/constants";
import {
   AccordianStyles,
   Styles,
   allReportDateFormatter,
   allTxnDateFormatter,
   nullColumnFormatter,
   rowClasses,
   staticRequestedColumnFormatter,
   transferredColumnFormatter,
} from "../../helpers/tableHelpers";
import { UserUtils } from "../../lib/authenticationUtils";
import store from "../../store";
import {
   initialSearchMap,
   initialTransactionPopUp,
   txnActionResponse,
} from "../../types/Transaction";
import getTransactions, {
   searchTransaction,
   txnAction,
} from "./TransactionService";
import TransactionHistory from "./TransactionHistory";
//import "../../css/main.css";

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
      top: 0%;
   }
`;
const transferredStyle = (
   cell: any,
   row: any,
   rowIndex: any,
   colIndex: any
) => {
   if (row.staticRequested === true) {
      return orangeStyle;
   } else if (
      (row.action === "CON" || row.action === "NEW") &&
      row.transferred === true
   ) {
      return greenStyle;
   } else if (row.action === "CAN" && row.transferred === true) {
      return redStyle;
   }
   return blackStyle;
};

const TransactionTable = () => {
   const [records, setTxns] = useState([]);
   const [confirmedRecords, setConfirmedRecords] = useState([]);
   const [unconfirmedRecords, setUnconfirmedRecords] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [dataModal, setModalData] = useState(initialTransactionPopUp);
   const [selectedRow, setSelectedRow] = useState<any[]>([]);
   const [txnType, setTxnType] = useState("ALL");
   const [showUpdateModal, setUpdateModal] = useState(false);
   const [updateTxn, setUpdateTxn] = useState<any[]>([]);
   const [actionResponses, setActionResponses] = useState<txnActionResponse[]>(
      []
   );
   const [showActionModal, setActionModal] = useState(false);
   const [currentPage, setCurrentPage] = useState(0);
   const [txnPerPage, setTxnPerPage] = useState(10);
   const [totalPages, setTotalPages] = useState(0);
   const [selectedParams, setSelectedParams] = useState([]);
   const [searchParam, setSearchParam] = useState("instrumentShort");
   const [searchMap, setSearchMap] = useState({
      ...initialSearchMap,
      assetMgr: UserUtils.getUser()?.assetManager,
      customerId: UserUtils.getUser()?.customerId,
   });
   const [transactionSearchParam, setTransactionSearchParam] = useState([]);
   const [toggle, setToggle] = useState(true);
   const [itemsOnPage, setItemsOnPage] = useState(0);
   const [totalItems, setTotalItems] = useState(0);
   const configref = useRef<BootstrapTable>(null);

   const [initialMap, setInitialMap] = useState({
      ...initialSearchMap,
      assetMgr: UserUtils.getUser()?.assetManager,
      customerId: UserUtils.getUser()?.customerId,
   });
   const [sortColumn, setSortColumn] = useState("transoriginNo");
   const [sortDirection, setSortDirection] = useState("DESC");
   const [tableCOlumns, setTableCoumns] = useState([
      { label: "Trade ID", value: "Trade ID" },
   ]);

   const [nonExpandableTxns, setNonExpandableTxns] = useState<any[]>([]);
   let history = useHistory();
   const hideModal = () => {
      setShowModal(false);
   };
   const getModal = (data: any) => {
      setModalData(data);
      setShowModal(true);
   };

   useEffect(() => {
      loadTransaction(currentPage, txnPerPage, "transoriginNo", "DESC");
   }, [store.getState().auth.userSetting.timeZone]);

   const rowCheck: any = {
      mode: "checkbox",
      clickToSelect: true,
      selected: selectedRow,
      onSelectAll: (isSelect: any, rows: any) =>
         handleOnSelectAll(isSelect, rows),
      onSelect: (row: any, isSelect: any, rowIndex: any, e: any) =>
         handleOnSelect(row, isSelect),
   };

   function handleOnSelect(row: any, isSelect: any) {
      if (isSelect) {
         setSelectedRow([...selectedRow, row.transoriginNo]);
         setUpdateTxn([...updateTxn, row]);
      } else {
         setSelectedRow(selectedRow.filter((x) => x !== row.transoriginNo));
         setUpdateTxn(
            updateTxn.filter((x) => x.transoriginNo !== row.transoriginNo)
         );
      }
   }

   function sortingTable(column: any, order: any) {
      setSortColumn(column);
      setSortDirection(order.toUpperCase());
   }

   function handleOnSelectAll(isSelect: any, rows: any) {
      const ids = rows.map((r: any) => r.transoriginNo);
      if (isSelect) {
         setSelectedRow(ids);
         setUpdateTxn([...rows]);
      } else {
         setSelectedRow([]);
         setUpdateTxn([]);
      }
   }

   function actionButtons() {
      if (txnType === "ALL") {
         return (
            <>
               <Col>
                  <Button
                     variant="outline-primary"
                     onClick={() => {
                        setUpdateModal(true);
                     }}
                  >
                     Update & Confirm
                  </Button>
                  <Button
                     variant="outline-success"
                     onClick={() => actionTransaction("CON")}
                  >
                     Confirm
                  </Button>
                  <Button
                     variant="outline-danger"
                     onClick={() => actionTransaction("CAN")}
                  >
                     Cancel
                  </Button>
               </Col>
               <Col></Col>
               <Col></Col>
               <Col></Col>
            </>
         );
      }
      if (txnType === "MISSINGINSTRUMENTTRANSACTION") {
         return (
            <>
               <Col>
                  <Button variant="outline-primary" disabled>
                     Update & Confirm
                  </Button>
                  <Button variant="outline-success" disabled>
                     Confirm
                  </Button>
                  <Button
                     variant="outline-danger"
                     onClick={() => actionTransaction("CAN")}
                  >
                     Cancel
                  </Button>
               </Col>
            </>
         );
      }
      if (txnType === "UNCONFIRM") {
         return (
            <>
               <Col>
                  <Button
                     variant="outline-primary"
                     onClick={() => {
                        setUpdateModal(true);
                     }}
                  >
                     Update & Confirm
                  </Button>
                  <Button
                     variant="outline-success"
                     onClick={() => actionTransaction("CON")}
                  >
                     Confirm
                  </Button>
                  <Button
                     variant="outline-danger"
                     onClick={() => actionTransaction("CAN")}
                  >
                     Cancel
                  </Button>
               </Col>
            </>
         );
      }
   }

   function actionTransaction(action: string) {
      txnAction(updateTxn, action).then((res) => {
         setUpdateModal(false);
         var actionResponses: txnActionResponse[] = [];
         actionResponses = res;
         setActionResponses(actionResponses);
         setActionModal(true);
      });
   }

   function onUpdateModalClose() {
      setActionModal(false);
      setTxnType("ALL");
      setSelectedRow([]);
      setUpdateTxn([]);
      setTxns([]);
      getTransactions(currentPage, txnPerPage, "transoriginNo", "DESC")
         .then((res) => {
            const TransactionsDataBackend = res.content ? res.content : [];

            var nonExpandable: any[] = [];
            TransactionsDataBackend.map((transaction: any) => {
               if (!transaction.history) {
                  nonExpandable.push(transaction.transoriginNo);
               }
            });

            console.log(nonExpandableTxns);
            setNonExpandableTxns(nonExpandable);
            console.log(nonExpandable);
            setTxns(TransactionsDataBackend);
            const confirmed = TransactionsDataBackend.filter(
               (txn: any) => txn.action === "CON"
            );
            const unconfirmed = TransactionsDataBackend.filter(
               (txn: any) => txn.action !== "CON"
            );
            setConfirmedRecords(confirmed);
            setUnconfirmedRecords(unconfirmed);
            setTotalPages(res.totalPages);
         })
         .catch((err) => {});
   }

   function feeChangeHandler(
      e: { target: { name: any; value: any } },
      transoriginNo: number
   ) {
      var rows = updateTxn;
      var index = updateTxn.findIndex(
         (row) => row.transoriginNo === transoriginNo
      );
      if (e.target.name === "fee1") {
         rows[index].fee1 = e.target.value;
      }
      if (e.target.name === "fee2") {
         rows[index].fee2 = Number(e.target.value);
      }
      if (e.target.name === "fee3") {
         rows[index].fee3 = e.target.value;
      }

      setUpdateTxn(rows);
   }

   const expandRow = {
      expandByColumnOnly: true,
      showExpandColumn: true,
      nonExpandable: nonExpandableTxns,
      onlyOneExpanding: true,
      expandHeaderColumnRenderer: () => {
         return <b style={{ cursor: "default" }}></b>;
      },
      renderer: (row: any, rowIndex: any) => {
         return (
            <div
               style={{
                  backgroundColor: "#f8f9fe",
                  paddingLeft: "35px",
                  cursor: "default",
               }}
            >
               {" "}
               <TransactionHistory history={row.history} />
            </div>
         );
      },
      onExpand: (row: any, isExpand: boolean, rowIndex: number, e: any) => {},
   };

   const columns = [
      {
         dataField: transactionDataFields.transOriginNumber.text,
         text: transactionLabels.TRANSACTION_ID.text,
         sort: true,
         key: 1,
         onSort: sortingTable,

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
               getModal(row);
            },
         },

         headerStyle: mystyle,
         style: transferredStyle,
         // filter: textFilter()
      },
      {
         dataField: transactionDataFields.createdDate.text,
         text: transactionLabels.CREADTED_DATE.text,
         sort: true,
         key: 2,
         formatter: allReportDateFormatter,
         headerStyle: mystyle,

         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.action.text,
         text: transactionLabels.STATUS.text,
         sort: true,
         key: 3,
         headerStyle: mystyle,
         style: transferredStyle,

         onSort: sortingTable,
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
         style: transferredStyle,

         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.instrument_type.text,
         text: transactionLabels.INSTRUMENT_TYPE.text,
         sort: true,
         key: 4,
         headerStyle: mystyle,
         style: transferredStyle,

         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.portfolioShort.text,
         text: transactionLabels.PORTFOLIO_NAME.text,
         sort: true,
         key: 5,
         headerStyle: mystyle,
         style: transferredStyle,

         onSort: sortingTable,
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
         text: transactionLabels.COUNTERPARTY_NAME.text,
         key: 6,
         formatter: nullColumnFormatter,

         headerStyle: mystyle,
         onSort: sortingTable,
         sort: true,
         style: transferredStyle,

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
         onSort: sortingTable,
         formatter: allTxnDateFormatter,
         key: 7,
         headerClasses: "center-column",
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.transactionCode.text,
         text: transactionLabels.TRANSACTION_CODE.text,

         sort: true,
         key: 8,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.instrumentShort.text,

         text: transactionLabels.INSTRUMENT.text,
         sort: true,
         key: 9,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
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
         dataField: transactionDataFields.transactionType.text,
         text: transactionLabels.TRANSACTION_TYPE.text,

         sort: true,
         key: 10,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.nominal.text,

         text: transactionLabels.NOMINAL.text,
         sort: true,
         key: 11,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.price.text,
         text: transactionLabels.PRICE.text,
         sort: true,
         key: 12,
         formatter: nullColumnFormatter,

         onSort: sortingTable,
         headerStyle: mystyle,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.paymentAmount.text,
         text: transactionLabels.PAYMENTAMOUNT.text,
         sort: true,
         key: 13,
         formatter: nullColumnFormatter,

         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.currency.text,
         text: transactionLabels.CURRENCY.text,

         sort: true,
         key: 14,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         onSort: sortingTable,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.externalTradeId.text,
         text: transactionLabels.EXTERNALTRADEID.text,

         sort: true,
         key: 15,
         onSort: sortingTable,
         formatter: nullColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
      },
      {
         dataField: transactionDataFields.staticRequested.text,
         text: transactionLabels.STATIC_REQUESTED.text,

         sort: true,
         key: 16,
         formatter: staticRequestedColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
      {
         dataField: transactionDataFields.transferred.text,
         text: transactionLabels.TRANSFERRED.text,

         sort: true,
         key: 17,
         formatter: transferredColumnFormatter,
         headerStyle: mystyle,
         style: transferredStyle,
         onSort: sortingTable,
      },
   ];

   function MydModalWithGrid(props: any) {
      return (
         <Modal
            {...props}
            size="lg"
            aria-labelledby="example-custom-modal-styling-title"
         >
            <Modal.Header closeButton translate="true">
               <Modal.Title id="example-custom-modal-styling-title">
                  {updateTxn.length === 0 && (
                     <strong>No Transaction Selected</strong>
                  )}
                  {updateTxn.length > 0 && (
                     <>{selectedRow.length} Transaction Selected</>
                  )}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {updateTxn.length === 0 && (
                  <Alert key="alert" variant="danger">
                     Please select any transaction to update!!
                  </Alert>
               )}
               {updateTxn.length > 0 && (
                  <Table striped bordered hover>
                     <thead>
                        <tr>
                           <th>Trade ID</th>
                           <th>Fee 1</th>
                           <th>Fee 2</th>
                           <th>Fee 3</th>
                        </tr>
                     </thead>
                     <tbody>
                        {updateTxn.length > 0 &&
                           updateTxn.map((row: any) => {
                              return (
                                 <tr key={row.transoriginNo}>
                                    <td>{row.transoriginNo}</td>
                                    <td>
                                       <Form.Control
                                          autoFocus
                                          type="number"
                                          id="fee1"
                                          key={Math.random()}
                                          name="fee1"
                                          defaultValue={row.fee1}
                                          onChange={(e) =>
                                             feeChangeHandler(
                                                e,
                                                row.transoriginNo
                                             )
                                          }
                                       ></Form.Control>
                                    </td>
                                    <td>
                                       <Form.Control
                                          type="number"
                                          name="fee2"
                                          id="fee2"
                                          key="fee2"
                                          defaultValue={row.fee2}
                                          onChange={(e) =>
                                             feeChangeHandler(
                                                e,
                                                row.transoriginNo
                                             )
                                          }
                                       ></Form.Control>
                                    </td>
                                    <td>
                                       <Form.Control
                                          type="number"
                                          name="fee3"
                                          id="fee3"
                                          key="fee3"
                                          defaultValue={row.fee3}
                                          onChange={(e) =>
                                             feeChangeHandler(
                                                e,
                                                row.transoriginNo
                                             )
                                          }
                                       ></Form.Control>
                                    </td>
                                 </tr>
                              );
                           })}
                     </tbody>
                  </Table>
               )}
            </Modal.Body>
            {updateTxn.length > 0 && (
               <Modal.Footer>
                  <Button
                     variant="outline-secondary"
                     onClick={() => {
                        setUpdateModal(false);
                     }}
                  >
                     Close
                  </Button>
                  <Button
                     variant="outline-primary"
                     onClick={() => actionTransaction("UPD_CON")}
                  >
                     Save Changes
                  </Button>
               </Modal.Footer>
            )}
         </Modal>
      );
   }

   function TxnActionResponseModel(props: any) {
      return (
         <Modal
            {...props}
            size="lg"
            aria-labelledby="example-custom-modal-styling-title"
         >
            {selectedRow.length > 0 && (
               <>
                  {" "}
                  <Modal.Header closeButton translate="true">
                     <Modal.Title id="example-custom-modal-styling-title">
                        {selectedRow.length} Records
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     {actionResponses.map((response: txnActionResponse) => {
                        return (
                           <Alert
                              key={response.id}
                              variant={
                                 response.status === "OK" ? "success" : "danger"
                              }
                           >
                              <b>Transaction id</b>:{response.id},<b>Status</b>:
                              {response.msg}
                           </Alert>
                        );
                     })}
                  </Modal.Body>
               </>
            )}
            {selectedRow.length === 0 && (
               <>
                  {" "}
                  <Modal.Header closeButton translate="true">
                     <Modal.Title id="example-custom-modal-styling-title">
                        {selectedRow.length} Records
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Alert key="alert" variant="danger">
                        Please select any transaction to confirm or cancel!!
                     </Alert>
                  </Modal.Body>
               </>
            )}
         </Modal>
      );
   }

   function loadTransaction(
      currentPage: any,
      sizePerPage: any,
      sortBy: any,
      direction: any
   ) {
      setTxns([]);

      setTotalPages(-2);
      getTransactions(currentPage, sizePerPage, sortBy, direction)
         .then((res) => {
            const TransactionsDataBackend = res.content ? res.content : [];

            var nonExpandable: any[] = [];
            TransactionsDataBackend.map((transaction: any) => {
               if (!transaction.history) {
                  nonExpandable.push(transaction.transoriginNo);
               }
            });
            setNonExpandableTxns(nonExpandable);

            setTxns(TransactionsDataBackend);
            const confirmed = TransactionsDataBackend.filter(
               (txn: any) => txn.staticRequested === true
            );
            const unconfirmed = TransactionsDataBackend.filter(
               (txn: any) => txn.action !== "CON"
            );
            setConfirmedRecords(confirmed);
            setUnconfirmedRecords(unconfirmed);
            setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
            setItemsOnPage(res.numberOfElements);
            setTotalPages(res.totalPages);
         })
         .catch((err) => {
            console.log(err);
            setTotalPages(-3);
         });
   }

   const pageChange = (event: any) => {
      setCurrentPage(event);
      if (JSON.stringify(initialMap) === JSON.stringify(searchMap)) {
         loadTransaction(event, txnPerPage, sortColumn, sortDirection);
      } else {
         loadSearchedTransaction(searchMap, txnPerPage, event);
      }
   };

   const sizeChange = (event: any) => {
      setCurrentPage(0);
      setTxnPerPage(event);
      if (JSON.stringify(initialMap) === JSON.stringify(searchMap)) {
         loadTransaction(0, event, sortColumn, sortDirection);
      } else {
         loadSearchedTransaction(searchMap, event, 0);
      }
   };

   const NoDataIndication = () => (
      <>
         {totalPages === -2 && (
            <LoaderStyle>
               <TableLoader />
            </LoaderStyle>
         )}
         {totalPages === 0 && <b>No Record Found</b>}
         {totalPages === -3 && (
            <b>There is an error in loading the data in table</b>
         )}
      </>
   );

   function loadSearchedTransaction(
      SearchMap: any,
      sizePerPage: any,
      currentPage: any
   ) {
      setTxns([]);
      setTotalPages(-2);
      searchTransaction(SearchMap, sizePerPage, currentPage)
         .then((res) => {
            const TransactionsDataBackend = res.content ? res.content : [];
            var nonExpandable: any[] = [];
            TransactionsDataBackend.map((transaction: any) => {
               if (!transaction.history) {
                  nonExpandable.push(transaction.transoriginNo);
               }
            });
            setNonExpandableTxns(nonExpandable);
            setTxns(TransactionsDataBackend);
            const confirmed = TransactionsDataBackend.filter(
               (txn: any) => txn.staticRequested === true
            );
            const unconfirmed = TransactionsDataBackend.filter(
               (txn: any) => txn.action !== "CON"
            );
            setConfirmedRecords(confirmed);
            setUnconfirmedRecords(unconfirmed);
            setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
            setItemsOnPage(res.numberOfElements);
            setTotalPages(res.totalPages);
         })
         .catch((err) => {
            setTotalPages(-3);
         });
   }

   const changeSearchValue = (event: any) => {
      var alteredSearchMap = searchMap;
      if (
         "transoriginNo" === event.target.id ||
         "nominal" === event.target.id
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

   const setTransactionStatusSearch = () => {
      var statuses: any[] = [];
      var transactionTypes: any[] = [];

      transactionSearchParam.map((entry: any) =>
         transactionTypes.push(entry.value)
      );
      selectedParams.map((entry: any) => statuses.push(entry.value));
      setSearchMap({
         ...searchMap,
         status: statuses,
         transactionType: transactionTypes,
      });
      setCurrentPage(0);
      loadSearchedTransaction(
         {
            ...searchMap,
            status: statuses,
            transactionType: transactionTypes,
         },
         txnPerPage,
         0
      );
   };

   return (
      <ToolkitProvider
         keyField="transoriginNo"
         data={records}
         columns={columns}
         //  columnToggle
         search
         exportCSV={{
            fileName: "transactions" + new Date() + ".csv",
            separator: ",",
            ignoreHeader: false,
            noAutoBOM: false,
            // onlyExportFiltered:true,
            // onlyExportSelection:true,
            exportAll: true,
         }}
      >
         {(props) => (
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
                              onClick={() => setToggle(!toggle)}
                              className={toggle ? "toggledown" : "toggleup"}
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

                                       <Styles>
                                          <MultiSelect
                                             options={transactionTypeSearch}
                                             value={transactionSearchParam}
                                             labelledBy="AD"
                                             hasSelectAll={false}
                                             disableSearch={true}
                                             onChange={
                                                setTransactionSearchParam
                                             }
                                          />
                                       </Styles>
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
                                          id="staticRequested"
                                          defaultValue={
                                             searchMap.staticRequested
                                          }
                                          onChange={changeSearchValue}
                                       >
                                          <option
                                             value="B"
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
                                             assetMgr:
                                                UserUtils.getUser()
                                                   ?.assetManager,
                                             customerId:
                                                UserUtils.getUser()?.customerId,
                                          });
                                          setTransactionSearchParam([]);
                                          setSelectedParams([]);
                                          loadTransaction(
                                             0,
                                             txnPerPage,
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

               <Row>{actionButtons()}</Row>
               <br></br>

               {/* <ToggleList { ...props.columnToggleProps } /> */}
               <BootstrapTable
                  selectRow={rowCheck}
                  {...props.baseProps}
                  rowClasses={rowClasses}
                  //condensed={true}
                  striped={true}
                  bordered={true}
                  hover={true}
                  headerClasses="thead-all"
                  condensed={true}
                  expandRow={expandRow}
                  ref={configref}
                  noDataIndication={() => <NoDataIndication />}
               />
               {totalPages > 0 && (
                  <PaginationComponent
                     numberOfPages={totalPages}
                     currentPage={currentPage}
                     sizeChange={sizeChange}
                     changePage={pageChange}
                     sizePerPage={txnPerPage}
                     itemOnPage={itemsOnPage}
                     totalItems={totalItems}
                  />
               )}

               <ExportCSVButton {...props.csvProps}>Export CSV</ExportCSVButton>
               {/* <button
            className="btn bg-success text-light rounded"
            onClick={EditRow}
          >
            Edit Row
          </button> */}

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
               <MydModalWithGrid
                  show={showUpdateModal}
                  onHide={() => setUpdateModal(false)}
               />
               <TxnActionResponseModel
                  backdrop="static"
                  keyboard={false}
                  show={showActionModal}
                  onHide={() => onUpdateModalClose()}
               />
            </div>
         )}
      </ToolkitProvider>
   );

   //  return <BootstrapTable keyField='id' data={ Transactions } columns={ columns } filter={ filterFactory() } pagination={ paginationFactory({}) } /> ;
};

export default TransactionTable;
