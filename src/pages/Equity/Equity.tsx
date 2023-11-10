import React, { useState, useEffect } from "react";
import "../../css/main.css";
import EquityTable from "./EquityTable";
import { Tab, Tabs } from "react-bootstrap";
import EquityManualTransaction from "./EquityManualTransaction";
import getEquities from "./EquityService";
import { commonError } from "../common/commonError";

const Equity = () => {
  const [tab, setTab] = useState("Equity");

  const [records, setTxns] = useState([]);
  const [pages, setTotalPages] = useState(0);
  const [itemsOnPage, setItemsOnPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    updateTxn();
  }, []);

  const updateTxn = () => {
    getEquities(0, 10, "transoriginNo", "DESC")
      .then((res) => {
        const EquitysDataBackend = res.content ? res.content : [];
        setTotalPages(res.totalPages);
        setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
        setItemsOnPage(res.numberOfElements);
        setTxns(EquitysDataBackend);
      })
      .catch((err) => {
        commonError(err.response.status, "EQUITY");
      });
  };

  return (
    <div className="wrapper">
      <Tabs activeKey={tab} onSelect={(currentTab: any) => setTab(currentTab)}>
        <Tab eventKey="Equity" title="Equity Transactions" mountOnEnter={true}>
          <div className="datalist mt-2">
            <EquityTable
              txn={records}
              pages={pages}
              setTotal={setTotalPages}
              totalItems={totalItems}
              itemsOnPage={itemsOnPage}
            />
          </div>
        </Tab>
        <Tab eventKey="upload" title="Upload" mountOnEnter={true}>
          <div className="datalist ml--4">
          </div>
        </Tab>
        <Tab
          eventKey="newEquity"
          title="New Equity Transaction"
          mountOnEnter={true}
        >
          <div className="ml--4">
            <EquityManualTransaction update={updateTxn} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Equity;
