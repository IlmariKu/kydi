import React, { useState, useEffect } from "react";
import Storage from "@aws-amplify/storage";
import { api_post, UPDATE_PROFILE_INFO_URL, S3_BASE_URL,
  GET_REVIEWS_URL } from "../helpers/api.js";
import { generateRandomID } from "../helpers/create_random_id.js";
import Spinner from "react-bootstrap/Spinner";

export function UploadPicture(props) {
  const [uploadState, setUploadState] = useState("ready");
  function createRandomizedFileName(filename) {
    // Last 8 characters of userID + randomID and the original file-extension
    const file_extension = filename.slice(filename.lastIndexOf(".") + 1);
    return `${props.userID.slice(0, 8)}/${generateRandomID(
      10
    )}.${file_extension}`;
  }

  async function updateProfilePicUrl(user_id, filename) {
    const body = {
      "user-id": user_id,
      "profile-picture-url": `${filename}`,
    };
    await api_post(`${UPDATE_PROFILE_INFO_URL}`, body, true);
  }

  async function uploadPictureToS3(file) {
    setUploadState("loading")
    const filename = createRandomizedFileName(file["name"]);
    updateProfilePicUrl(props.userID, filename);

    const response = await Storage.put(filename, file)
    setUploadState("finished")
    props.setProfilePicUrl(`${S3_BASE_URL}${response.key}`)
  }

  return (
    <div>
      {uploadState === "ready" ? (
        <div>
          <label htmlFor="file-upload" className="custom-file-upload">
            <i className="fa fa-cloud-upload"></i> Lataa profiilikuva!
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={() => uploadPictureToS3(event.target.files[0])}
          />
        </div>
      ) : null}
      {uploadState === "loading" ? (
        <div>
          <Spinner animation="grow" variant="secondary" />
          Ladataan
          <Spinner animation="grow" variant="secondary" />
        </div>
      ) : null}
      {uploadState === "finished" ? (
        <div style={{"color": "green"}}>
          Lataus valmis
        </div>
      ) : null}
    </div>
  );
}
