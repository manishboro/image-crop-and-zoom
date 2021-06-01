import React from "react";
import "./cropper";

import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import CancelIcon from "@material-ui/icons/Cancel";

import getCroppedImg, { generateDownload } from "../../utils/cropImage";
import { IconButton, makeStyles } from "@material-ui/core";
import { SnackbarContext } from "../snackbar/snackbar";
import { BackdropContext } from "../backdrop/backdrop";
import { dataURLtoFile } from "../../utils/dataURLtoFile";

const useStyles = makeStyles({
  iconButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
  },
  cancelIcon: {
    color: "#00a3c8",
    fontSize: "50px",
    "&:hover": {
      color: "red",
    },
  },
});

export default function RenderCropper({ handleCropper, setAvatar }) {
  const classes = useStyles();

  const inputRef = React.useRef();

  const triggerFileSelectPopup = () => inputRef.current.click();

  const setStateSnackbarContext = React.useContext(SnackbarContext);
  const { closeBackdrop, showBackdrop } = React.useContext(BackdropContext);

  const [image, setImage] = React.useState(null);
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) =>
    setCroppedArea(croppedAreaPixels);

  // To read file as Data URL
  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener("load", () => {
        setImage(reader.result);
      });
    }
  };

  // To download the edited image
  const onDownload = () => {
    if (!image)
      return setStateSnackbarContext(
        true,
        "Please select an image!",
        "warning"
      );

    generateDownload(image, croppedArea);
  };

  // Clear the selected image
  const onClear = () => {
    if (!image)
      return setStateSnackbarContext(
        true,
        "Please select an image!",
        "warning"
      );

    setImage(null);
  };

  // To upload the edited image
  const onUpload = async () => {
    if (!image)
      return setStateSnackbarContext(
        true,
        "Please select an image!",
        "warning"
      );

    const canvas = await getCroppedImg(image, croppedArea);
    const canvasDataUrl = canvas.toDataURL("image/jpeg");
    const convertedUrlToFile = dataURLtoFile(
      canvasDataUrl,
      "cropped-image.jpeg"
    );

    try {
      const formdata = new FormData();
      formdata.append("croppedImage", convertedUrlToFile);

      showBackdrop();

      const res = await fetch("http://localhost:9000/api/users/setProfilePic", {
        method: "POST",
        body: formdata,
      });

      const res2 = await res.json();

      closeBackdrop();
      setAvatar(res2.data);
    } catch (err) {
      closeBackdrop();
      console.warn(err);
    }
  };

  return (
    <div className="container">
      <IconButton className={classes.iconButton} onClick={handleCropper}>
        <CancelIcon className={classes.cancelIcon} />
      </IconButton>

      <div className="container-cropper">
        {image ? (
          <>
            <div className="cropper">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="slider">
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => setZoom(zoom)}
                color="secondary"
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="container-buttons">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={onSelectFile}
          style={{ display: "none" }}
        />

        <Button
          onClick={() => onClear()}
          variant="contained"
          color="primary"
          style={{ marginRight: "10px" }}
        >
          Clear
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={triggerFileSelectPopup}
          style={{ marginRight: "10px" }}
        >
          Choose
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={onDownload}
          style={{ marginRight: "10px" }}
        >
          Download
        </Button>

        <Button variant="contained" color="secondary" onClick={onUpload}>
          Upload
        </Button>
      </div>
    </div>
  );
}
