import React from "react";
import { Button, Spinner } from "react-bootstrap";
import ReactDOM from "react-dom";

const CountDown = (props: { seconds: any; delete: any }) => {
  const [paused, setPaused] = React.useState(false);
  const [over, setOver] = React.useState(false);
  const [[s], setTime] = React.useState([props.seconds]);

  const tick = () => {
    if (paused || over) return;
    if (s === 0) setOver(true);
    else if (s === 0) {
      setTime([59]);
    } else if (s == 0) {
      setTime([59]);
    } else {
      setTime([s - 1]);
    }
  };

  React.useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  });

  return (
    <div>
      <Button
        variant={!over ? "outline-primary" : "outline-danger"}
        onClick={props.delete}
        disabled={!over}
      >
        {!over && s.toString().padStart(2, "0")}
        {over && "Delete"}
      </Button>
    </div>
  );
};

export default CountDown;
