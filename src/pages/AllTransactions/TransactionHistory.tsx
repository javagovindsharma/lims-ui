/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";
import "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
//import "../../css/main.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import PaginationComponent from "../../components/common/PaginationComponent";
import TableLoader from "../../components/common/TableLoader";
import {
   allTransactionPopUp,
   transactionDataFields,
   transactionLabels,
} from "../../helpers/constants";
import {
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

const orangeBackground = { backgroundColor: "orange" } as React.CSSProperties;

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
   return blackStyle;
};

const TransactionHistory = (props: any) => {
   const [showModal, setShowModal] = useState(false);
   const [dataModal, setModalData] = useState(initialTransactionPopUp);
   const [currentPage, setCurrentPage] = useState(0);
   const [txnPerPage, setTxnPerPage] = useState(10);
   const [totalPages, setTotalPages] = useState(0);
   const configref = useRef<BootstrapTable>(null);
   const [historyData, setHistoryData] = useState(props.history);

   const [sortColumn, setSortColumn] = useState("transoriginNo");
   const [sortDirection, setSortDirection] = useState("DESC");

   const hideModal = () => {
      setShowModal(false);
   };

   useEffect(() => {
      setHistoryData(props.history);
   }, [store.getState().auth.userSetting.timeZone]);

   function sortingTable(column: any, order: any) {
      setSortColumn(column);
      setSortDirection(order.toUpperCase());
   }

   const columns = [
      {
         dataField: transactionDataFields.transOriginNumber.text,
         text: transactionLabels.TRANSACTION_ID.text,
         sort: true,
         key: 1,
         onSort: sortingTable,
         //headerFormatter:columnFormatter,
         // csvFormatter: (cell: any, row: any, rowIndex: any) => `$ ${cell}NTD`,

         headerStyle: mystyle,
         style: transferredStyle,
         // filter: textFilter()
      },
      {
         dataField: "version_created",
         text: "Modified Date",
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

   function loadTransaction(
      currentPage: any,
      sizePerPage: any,
      sortBy: any,
      direction: any
   ) {
      setTotalPages(-2);
   }

   return (
      <ToolkitProvider
         keyField="transoriginNo"
         data={historyData}
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
               {/* <ToggleList { ...props.columnToggleProps } /> */}
               <BootstrapTable
                  {...props.baseProps}
                  rowClasses={rowClasses}
                  //condensed={true}
                  striped={true}
                  bordered={true}
                  hover={true}
                  headerClasses="thead-all"
                  condensed={true}
                  ref={configref}
                  rowStyle={orangeBackground}
               />

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
            </div>
         )}
      </ToolkitProvider>
   );

   //  return <BootstrapTable keyField='id' data={ Transactions } columns={ columns } filter={ filterFactory() } pagination={ paginationFactory({}) } /> ;
};

export default TransactionHistory;
