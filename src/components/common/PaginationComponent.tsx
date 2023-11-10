import React, { useEffect, useState } from "react";
import { Dropdown, Pagination, Row, Col, SplitButton } from "react-bootstrap";

interface PaginationProps {
   numberOfPages: any;
   currentPage: any;
   sizeChange: any;
   changePage: any;
   sizePerPage?: any;
   itemOnPage?: any;
   totalItems?: any;
}

const PaginationComponent = (props: PaginationProps) => {
   const [sizePerPage, setSize] = useState(10);
   const [currentPage, setCurrentPage] = useState(props.currentPage);

   useEffect(() => {
      if (props.sizePerPage != sizePerPage && props.sizePerPage !== undefined) {
         setSize(props.sizePerPage);
      }
      setCurrentPage(props.currentPage);
   }, [props.currentPage]);
   const NumberofPaginationItem = () => {
      var items = [];
      items.push(
         <Pagination.First
            hidden={currentPage === 0}
            onClick={() => {
               setCurrentPage(0);
               props.changePage(0);
            }}
            key="first"
         >
            0
         </Pagination.First>
      );
      items.push(
         <Pagination.Prev
            hidden={currentPage < 2}
            onClick={() => {
               setCurrentPage(currentPage - 1);
               props.changePage(currentPage - 1);
            }}
            key={Math.random()}
         >
            {currentPage - 1}
         </Pagination.Prev>
      );
      items.push(
         <Pagination.Item active key={Math.random()}>
            {currentPage}
         </Pagination.Item>
      );
      items.push(
         <Pagination.Next
            hidden={currentPage === props.numberOfPages - 1}
            onClick={() => {
               setCurrentPage(currentPage + 1);
               props.changePage(currentPage + 1);
            }}
            key={Math.random()}
         >
            {currentPage + 1}
         </Pagination.Next>
      );
      items.push(
         <Pagination.Last
            hidden={
               currentPage === props.numberOfPages - 2 ||
               currentPage === props.numberOfPages - 1
            }
            onClick={() => {
               setCurrentPage(props.numberOfPages - 1);
               props.changePage(props.numberOfPages - 1);
            }}
            key={Math.random()}
         >
            {props.numberOfPages - 1}
         </Pagination.Last>
      );

      return items;
   };

   return (
      <Row>
         <Col lg={{ order: "1" }}>
            <SplitButton
               key="pageSizeSelector"
               id="dropdown-split-variants"
               variant="outline-primary"
               title={sizePerPage}
            >
               <Dropdown.Item
                  onClick={() => {
                     setSize(10);
                     props.sizeChange(10);
                  }}
               >
                  10
               </Dropdown.Item>
               <Dropdown.Item
                  onClick={() => {
                     setSize(50);
                     props.sizeChange(50);
                  }}
               >
                  50
               </Dropdown.Item>
               <Dropdown.Item
                  onClick={() => {
                     setSize(100);
                     props.sizeChange(100);
                  }}
               >
                  100
               </Dropdown.Item>
               <Dropdown.Item
                  onClick={() => {
                     setSize(500);
                     props.sizeChange(500);
                  }}
               >
                  500
               </Dropdown.Item>
               <Dropdown.Item
                  onClick={() => {
                     setSize(1000);
                     props.sizeChange(1000);
                  }}
               >
                  1000
               </Dropdown.Item>
            </SplitButton>
         </Col>
         {props.currentPage === 0 && (
            <Col lg={{ order: "2" }}>
               <b style={{ lineHeight: "300%" }}>
                  Showing{" "}
                  {props.itemOnPage < 10
                     ? props.itemOnPage
                     : "1 - " + props.itemOnPage}{" "}
                  out of {props.totalItems} Records
               </b>
            </Col>
         )}

         {props.currentPage > 0 && (
            <Col lg={{ order: "2" }}>
               <b style={{ lineHeight: "300%" }}>
                  Showing {props.currentPage * props.sizePerPage + 1}-
                  {props.currentPage * props.sizePerPage + props.itemOnPage} out
                  of {props.totalItems} Records
               </b>
            </Col>
         )}

         <Col lg={{ order: "3" }}>
            <Pagination size="lg">{NumberofPaginationItem()}</Pagination>
         </Col>
         <Col lg={{ order: "4" }}></Col>
         <Col lg={{ order: "5" }}></Col>
      </Row>
   );
};
export default PaginationComponent;
