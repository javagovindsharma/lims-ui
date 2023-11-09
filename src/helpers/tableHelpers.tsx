import React from "react";
import store from "../store";

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