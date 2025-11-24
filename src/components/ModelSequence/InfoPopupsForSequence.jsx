import React from "react";
import InfoPopup from "../InfoPopup";

export default function InfoPopupsForSequence({ popUpToggler, setPopUpToggler }) {


  return (
    <>
      <div className="h-fit w-fit absolute top-[25%] right-[30%] -translate-x-1/2 -translate-y-1/2 z-[200]">
        <InfoPopup  isOpen={popUpToggler}  />
    
      </div>
    </>
  );
}
