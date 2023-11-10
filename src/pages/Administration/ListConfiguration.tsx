/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
   Button,
   ButtonGroup,
   Col,
   Dropdown,
   Row,
   SplitButton,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ToolkitProvider, {
   CSVExport,
   Search,
} from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import PaginationComponent from "../../components/common/PaginationComponent";
import TableLoader from "../../components/common/TableLoader";
import "../../css/main.css";
import {
   configurationDataFields,
   configurationTextFields,
} from "../../helpers/constants";
import {
   allReportDateFormatter,
   configurationListTypeFormatter,
   nullColumnFormatter,
   upperCaseFormatter,
} from "../../helpers/tableHelpers";
import { UserUtils } from "../../lib/authenticationUtils";
import store from "../../store";
import { commonError } from "../common/commonError";
import { getConfigurationList } from "./ConfigurationService";
const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

const mystyle = {
   whiteSpace: "pre-wrap",
   padding: "10px",
} as React.CSSProperties;

export default class ListConfiguration extends React.Component<{
   sendDataToParent: any;
}> {
   state: any = {
      selectedRow: [],
      currentPage: 0,
      cfgPerPage: 10,
      totalPages: 0,
      searchValue: "",
      itemsOnPage: 0,
      totalItems: 0,
      records: [],
      timeZone: store.getState().auth.userSetting.timeZone,
   };
   // configref =this.useRef<BootstrapTable>(null);

   filter = function (tag: string, arr: any[]) {
      return arr.filter(function (abc) {
         return abc.tag === tag;
      });
   };

   dateFormatter(cell: string, row: string) {
      var day = new Date(cell);
      return <span> {day.toDateString()}</span>;
   }

   rowClasses = (row: any, rowIndex: number) => {
      let classes = "oddRow";
      if (rowIndex % 2 === 0) {
         classes = "evenRow";
      }
      return classes;
   };

   constructor(props: any) {
      super(props);
      this.pageChange = this.pageChange.bind(this);
      this.sizeChange = this.sizeChange.bind(this);
   }
   componentDidMount() {
      this.loadConfiguration(this.state.currentPage, this.state.cfgPerPage);
      store.subscribe(() =>
         this.loadConfiguration(this.state.currentPage, this.state.cfgPerPage)
      );
   }

   loadConfiguration(pageNumber: any, pageSize: any) {
      this.setState({
         records: [],
         totalPages: -2,
      });
      getConfigurationList(
         UserUtils.getUser()?.customerId,
         pageNumber,
         pageSize,
         "ASC"
      )
         .then((res) => {
            const DataBackend = res ? res.content : [];
            this.setState({
               records: DataBackend,
               totalPages: res.totalPages,
               totalItems: res.totalElements > 0 ? res.totalElements : 0,
               itemsOnPage: res.numberOfElements,
            });
         })
         .catch((err) => {
            this.setState({ totalPages: -3 });
            commonError(err.response.status, "listconfiguration");
         });
   }

   columns = [
      {
         text: "Action", // A column for the Edit button
         dataField: "isd",
         formatter: (cell: any, row: { id: any }) => (
            <>
               <SplitButton
                  key="bc"
                  id={`dropdown-split-variants-primary`}
                  variant="primary"
                  title="Modify"
                  size="sm"
                  onClick={() => this.props.sendDataToParent(row, "MODIFY")}
               >
                  <Dropdown.Item
                     eventKey="1"
                     onClick={() => this.props.sendDataToParent(row, "COPY")}
                  >
                     Copy
                  </Dropdown.Item>
                  <Dropdown.Item
                     eventKey="2"
                     onClick={() => this.props.sendDataToParent(row, "DELETE")}
                  >
                     Delete
                  </Dropdown.Item>
               </SplitButton>
            </>
         ),
      },
      {
         dataField: configurationDataFields.NAME.text,
         text: configurationTextFields.NAME.text,
         sort: true,
         headerStyle: mystyle,
         key: 1,
         events: {
            onClick: (
               e: any,
               column: any,
               columnIndex: any,
               row: any,
               rowIndex: any
            ) => {
               this.props.sendDataToParent(row);
            },
         },
      },
      {
         dataField: configurationDataFields.TYPE.text,
         text: configurationTextFields.TYPE.text,
         sort: true,
         headerStyle: mystyle,
         key: 2,
         formatter: configurationListTypeFormatter,
      },
      {
         dataField: configurationDataFields.TXNTYPE.text,
         text: configurationTextFields.TXNTYPE.text,
         sort: true,
         headerStyle: mystyle,
         key: 3,
         formatter: upperCaseFormatter,
      },
      {
         dataField: configurationDataFields.FILETYPE.text,
         text: configurationTextFields.FILETYPE.text,
         sort: true,
         headerStyle: mystyle,
         key: 4,
      },
      {
         dataField: configurationDataFields.ASSETMGR.text,
         text: configurationTextFields.ASSETMGR.text,
         sort: true,
         headerStyle: mystyle,
         key: 5,
      },

      {
         dataField: configurationDataFields.MODIFIED_AT.text,
         text: configurationTextFields.MODIFIED_AT.text,
         sort: true,
         headerStyle: mystyle,
         key: 6,
         formatter: allReportDateFormatter,
      },
      {
         dataField: configurationDataFields.MODIFIED_BY.text,
         text: configurationTextFields.MODIFIED_BY.text,
         sort: true,
         headerStyle: mystyle,
         key: 7,
         formatter: nullColumnFormatter,
      },
   ];
   //dateFormatter
   selectRow: any = {
      mode: "checkbox",
      // clickToSelect: true
   };
   rowCheck: any = {
      mode: "checkbox",

      onSelect: (row: any, isSelect: any, rowIndex: any, e: any) =>
         this.rowChecked(row, isSelect, rowIndex),
   };

   rowChecked(row: any, isSelect: any, rowIndex: any) {
      if (isSelect === true && this.state.selectedRow.length === 0) {
         this.setState({ SelectedRow: row });
      }

      if (isSelect === true && this.state.selectedRow.length > 0) {
         this.setState({ selectedRow: [...this.state.selectedRow, row] });
      }

      if (isSelect === false) {
         const vale = this.state.selectedRow.filter(
            this.setState({ selectedRow: this.state.selectedRow.id !== row.id })
         );
         this.setState({ selectedRow: [...vale] });
      }
   }

   pageChange = (event: any) => {
      this.setState({ currentPage: event, records: [], totalPages: -2 });
      if (this.state.searchValue !== "") {
         this.searchConfgByText(
            this.state.searchValue,
            event,
            this.state.cfgPerPage
         );
      } else {
         this.loadConfiguration(event, this.state.cfgPerPage);
      }
   };

   sizeChange = (event: any) => {
      this.setState({
         currentPage: 0,
         records: [],
         totalPages: -2,
         cfgPerPage: event,
      });
      if (this.state.searchValue !== "") {
         this.searchConfgByText(this.state.searchValue, 0, event);
      } else {
         this.loadConfiguration(0, event);
      }
   };
   NoDataIndication = () => (
      <>
         {this.state.totalPages === -2 && <TableLoader />}
         {this.state.totalPages === 0 && <b>No Record Found</b>}
         {this.state.totalPages === -3 && (
            <b style={{ color: "red" }}>There is a Problem in getting data</b>
         )}
      </>
   );

   searchConfgByText(searchValue: any, pageNumber: any, pageSize: any) {
      /*  searchInstruments(searchValue, transactionTypes.OTC, pageNumber, pageSize)
      .then((res) => {
        const InstrumentDataBackend = res ? res.content : [];
        setTxns(InstrumentDataBackend);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
        setItemsOnPage(res.numberOfElements);
      })
      .catch((err) => {
        setTotalPages(-3);
        commonError(err.response.status, "OtcP");
      }); */
   }
   onCfgChange() {
      this.setState({ currentPage: 0, records: [], totalPages: -2 });
      if (this.state.searchValue !== "") {
         this.searchConfgByText(
            this.state.searchValue,
            0,
            this.state.cfgPerPage
         );
      } else {
         this.loadConfiguration(0, this.state.cfgPerPage);
      }
   }
   onCfgReset() {
      this.setState({ currentPage: 0, cfgPerPage: 10, searchValue: "" });
      this.loadConfiguration(0, 10);
   }
   render() {
      return (
         <ToolkitProvider
            keyField="id"
            data={this.state.records}
            columns={this.columns}
         >
            {(props) => (
               <div>
                  <Row style={{ display: "none" }}>
                     <Col>
                        <SearchBar
                           style={{ width: "auto" }}
                           {...props.searchProps}
                           searchText={this.state.searchValue}
                           onSearch={(val: string) =>
                              this.setState({ searchValue: val })
                           }
                        />
                     </Col>
                     <Col>
                        <Button
                           variant="outline-primary"
                           onClick={() => this.onCfgChange()}
                        >
                           Search
                        </Button>{" "}
                        <Button
                           variant="outline-warning"
                           onClick={() => this.onCfgReset()}
                        >
                           Reset
                        </Button>
                     </Col>
                     <Col></Col>
                     <Col></Col>
                  </Row>

                  <BootstrapTable
                     {...props.baseProps}
                     rowClasses={this.rowClasses}
                     //condensed={true}
                     striped={true}
                     bordered={true}
                     hover={true}
                     headerClasses="thead-all"
                     condensed={false}
                     //ref={this.configref}
                     noDataIndication={() => <this.NoDataIndication />}
                  />
                  {this.state.totalPages > 0 && (
                     <PaginationComponent
                        numberOfPages={this.state.totalPages}
                        currentPage={this.state.currentPage}
                        sizeChange={this.sizeChange}
                        changePage={this.pageChange}
                        sizePerPage={this.state.cfgPerPage}
                        itemOnPage={this.state.itemsOnPage}
                        totalItems={this.state.totalItems}
                     />
                  )}
               </div>
            )}
         </ToolkitProvider>
      );
   }
}
