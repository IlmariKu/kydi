import React from "react";
import { UploadPicture } from "../../profile/UploadPicture.jsx";

export function UploadPhoto(props) {

  return (
    <div>
      <UploadPicture userID={props.userID} />
    </div>
  );
}
