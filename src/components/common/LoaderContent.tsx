import React from "react";
import { Spinner } from "react-bootstrap";

const LoaderContent = () => (
  <div style={{ textAlign: "center", paddingTop: 122 }}>
    <Spinner
      as="span"
      animation="grow"
      size="sm"
      role="status"
      aria-hidden="true"
    />
    <h1 style={{ color: "#FCB415", fontSize: 28 }}>
      Processing file, please wait. Can take several minutes...
    </h1>
  </div>
);

export default LoaderContent;
