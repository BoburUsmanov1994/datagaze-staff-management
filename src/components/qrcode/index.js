import React from "react";
import QRCode from "qrcode.react";

function QRGenerator(props) {
  const {value, id, small = false} = props;
  return (
    <div>
      <QRCode
        id={id}
        value={value}
        size={256}
        bgColor="#FFF"
        fgColor="#000"
        includeMargin
        level={"H"}
      />
    </div>
  );
}

export default QRGenerator;
