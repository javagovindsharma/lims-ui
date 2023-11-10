import React from "react";
import "../../css/main.css";

import Footer from "../../components/common/Footer";
import TransactionTable from "./TransactionTable";

const AllTransactions = () => {
  return (
    <div className="wrapper">
      <h1>Welcome CSS iHUB </h1>Transactions Dashboard
      <div className="datalist">
        <TransactionTable />
      </div>
      <Footer />
    </div>
  );
};
export default AllTransactions;
