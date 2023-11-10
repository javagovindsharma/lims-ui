import React from "react";
import styled from "styled-components";
import store from "../store";
import moment from "moment";
import "moment-timezone";

export function dateFormatter(cell: string, row: string) {
  var day = new Date(cell);
  return <span> {day.toDateString()}</span>;
}

export function getCurrentDate(separator = "-") {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${date}`;
}

function getPosition(string: string, subString: string, index: number) {
  return string.toString().split(subString, index).join(subString).length;
}
export function fullDateFormatter(cell: string, row: string) {
  if (cell) {
    var day = new Date(cell.toString().substring(0, getPosition(cell, ",", 3)));
    return <span> {day.toDateString()}</span>;
  } else {
    return <span>No date</span>;
  }
}

export function assetMgrFormatter(cell: any, row: any) {
  if (cell != undefined) {
    return <span>{cell.join(", ")}</span>;
  } else {
    return <span></span>;
  }
}
export function allTxnDateFormatter(cell: string, row: string) {
  if (cell) {
    return (
      <span>
        {moment
          .parseZone(cell)
          .tz(store.getState().auth.userSetting.timeZone)
          .format("YYYY-MM-DD")}
      </span>
    );
  } else {
    return <span>No date</span>;
  }
}
export function upperCaseFormatter(cell: string, row: string) {
  return cell === null ? (
    <span>No Asset Manager</span>
  ) : (
    <span>{cell.toString().toUpperCase()}</span>
  );
}
export function sdrCaseFormatter(cell: string, row: string) {
  return cell === null ? (
    <span>No Asset Manager</span>
  ) : cell.toString() === "0" ? (
    <span style={{ color: "#1946b7" }}>New</span>
  ) : cell.toString() === "10" ? (
    <span style={{ color: "rgb(230, 11, 154)" }}>Pending</span>
  ) : cell.toString() === "20" ? (
    <span style={{ color: "rgb(230, 11, 158)" }}>Pending Approval</span>
  ) : cell.toString() === "60" ? (
    <span style={{ color: "rgb(230, 11, 160)" }}>Approved</span>
  ) : cell.toString() === "90" ? (
    <span style={{ color: "red" }}>Error</span>
  ) : cell.toString() === "100" ? (
    <span style={{ color: "green" }}>Completed</span>
  ) : (
    <span>{cell.toString()}</span>
  );
}
export function allReportDateFormatter(cell: string, row: string) {
  if (store.getState().auth.userSetting.timeZone == "") {
    return (
      <span>
        {" "}
        {moment
          .parseZone(cell)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss")}
      </span>
    );
  }
  if (cell) {
    return (
      <span>
        {" "}
        {moment
          .parseZone(cell)
          .tz(store.getState().auth.userSetting.timeZone)
          .format("YYYY-MM-DD HH:mm:ss")}
      </span>
    );
  } else {
    return <span>No date</span>;
  }
}
export function allStaticDateFormatter(cell: string, row: string) {
  if (store.getState().auth.userSetting.timeZone == "") {
    return (
      <span>
        {" "}
        {moment
          .parseZone(cell)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss")}
      </span>
    );
  }
  if (cell) {
    return (
      <span>
        {" "}
        {moment
          .parseZone(cell)
          .tz(store.getState().auth.userSetting.timeZone)
          .format("YYYY-MM-DD HH:mm:ss")}
      </span>
    );
  } else {
    return <span>No date</span>;
  }
}

export function onlyDateFormatter(cell: string, row: string) {
  if (cell) {
    var day = new Date(cell);
    return (
      <span>
        {" "}
        {day.toLocaleString("en-ZA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </span>
    );
  } else {
    return <span>No date</span>;
  }
}
function formatDate(date: string) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function nullColumnFormatter(cell: string, row: string) {
  if (cell === undefined) cell = "";
  return <span> {cell}</span>;
}

export function getFormattedNumber(cell: any, row: any) {
  return (
    <span>
      {new Intl.NumberFormat("en-US", {
        //@ts-ignore
        notation: "compact",
      }).format(parseInt(cell))}
    </span>
  );
}

export function arrayColumnFormatter(cell: [], row: string) {
  if (cell === undefined) return <span></span>;
  return <span> {cell.join(", ")}</span>;
}
export function stringArrayColumnFormatter(cell: [], row: string) {
  if (cell.length === 0) return <span></span>;
  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {" "}
      {cell.toString().replace(/:/g, " , ")}
    </span>
  );
}

export function transferredColumnFormatter(cell: String, row: any) {
  if (row.transferred === true)
    return (
      <>
        <span>Yes</span>
      </>
    );
  return <span>{""}</span>;
}

export function staticRequestedColumnFormatter(cell: String, row: any) {
  if (row.staticRequested === true)
    return (
      <>
        <span>Yes</span>
      </>
    );
  if (row.staticRequested === false)
    return (
      <>
        <span>No</span>
      </>
    );
  return <span>{""}</span>;
}

export const selectRow: any = {
  mode: "checkbox",
  // clickToSelect: true
};

export const rowStyle = (row: any, rowIndex: number) => {
  if (rowIndex % 3 === 0) return { backgroundColor: "#84b3cc" };
  else return { backgroundColor: "none" };
};

export const allTransactionRowStyle = (row: any, rowIndex: number) => {
  if (row.transferred === true) return { backgroundColor: "#adf0c1" };
  else return { backgroundColor: "none" };
};

export const rowClasses = (row: any, rowIndex: number) => {
  let classes = "oddRow";
  if (rowIndex % 2 === 0) {
    classes = "evenRow";
  }
  return classes;
};

export const options: any = {
  onSizePerPageChange: (sizePerPage: string, page: string) => {},
  onPageChange: (page: string, sizePerPage: string) => {},
};

export const clickRow = (
  e: any,
  column: any,
  columnIndex: any,
  row: any,
  rowIndex: any
) => {
  alert("Click on txn ID field value " + row.transoriginNo);
};

export const Styles = styled.div`
  .rmsc .dropdown-container {
    width: 100px;
  }
  .rmsc .options {
    border: 0px;
  }
`;

export const AccordianStyles = styled.div`
  .toggleup::after {
    content: "▼";
  }
  .toggledown::after {
    content: "▲";
  }
`;
export function configurationListTypeFormatter(cell: string, row: any) {
  let str = [];
  if (row.formSubmit) {
    str.push("Form Submit");
  }
  if (row.fileUpload) {
    str.push("File Upload");
  }
  if (row.sftp) {
    str.push("SFTP");
  }

  if (row.fileFormat === "CSV_FILE") {
    str.push("CSV");
  }
  if (row.fileFormat === "XML_FILE") {
    str.push("XML");
  }
  return cell === null ? (
    <span>No Asset Manager</span>
  ) : (
   // <span>{str.join(",")}</span>
    <>
     { str.map((line: any) => (
          <>
            {line}
            <br />
          </>
        ))
     }
    </>
  );
}
