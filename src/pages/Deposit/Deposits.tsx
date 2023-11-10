import React, { useEffect, useState } from "react";
import "../../css/main.css";
import DepositTable from "./DepositTable";
import { Tab, Tabs } from "react-bootstrap";
import BondManualTransaction from "./DepositManualTransaction";
import getDeposits from "./DepositService";
import { commonError } from "../common/commonError";

const Deposits = () => {
  const [tab, setTab] = useState("Deposits");

  const [records, setTxns] = useState([]);
  const [pages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsOnPage, setItemsOnPage] = useState(0);

  useEffect(() => {
    updateTxn();
  }, []);

  const updateTxn = () => {
    getDeposits(0, 10, "transoriginNo", "DESC")
      .then((res) => {
        const DepositsDataBackend = res.content ? res.content : [];
        setTotalPages(res.totalPages);
        setTotalItems(res.totalElements > 0 ? res.totalElements : 0);
        setItemsOnPage(res.numberOfElements);
        setTxns(DepositsDataBackend);
      })
      .catch((err) => {
        commonError(err.response.status, "Deposit");
      });
  };

  return (
    <div className="wrapper">
      <Tabs activeKey={tab} onSelect={(currentTab: any) => setTab(currentTab)}>
        <Tab eventKey="Deposits" title="Deposit Transactions">
          <div className="datalist mt-2">
            <DepositTable
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
          eventKey="newDeposit"
          title="New Deposit Transaction"
          mountOnEnter={true}
        >
          <div className="ml--4">
            <BondManualTransaction update={updateTxn} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Deposits;
