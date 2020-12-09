import React from "react";
import "./App.css";

import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

import { generateDownload } from "./utils/cropImage";
import { makeStyles } from "@material-ui/core";

function Alert(props) {
	return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
	buttons: { border: "1px solid white" },
}));

export default function App() {
	const classes = useStyles();

	const inputRef = React.useRef();

	const triggerFileSelectPopup = () => inputRef.current.click();

	const [image, setImage] = React.useState(null);
	const [croppedArea, setCroppedArea] = React.useState(null);
	const [crop, setCrop] = React.useState({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);

	// To set the cropped image height and width in the 'croppedArea' state
	const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) =>
		setCroppedArea(croppedAreaPixels);

	// To store the selected file in the 'image' state as a data url
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
		if (image === null) return handleClick();
		generateDownload(image, croppedArea);
	};

	// To handle Snackbar
	const [open, setOpen] = React.useState(false);

	const handleClick = () => setOpen(true);
	const handleClose = (event, reason) => setOpen(false);

	return (
		<div className='container'>
			<div className='container-cropper'>
				{image ? (
					<>
						<div className='cropper'>
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

						<div className='slider'>
							<Slider
								min={1}
								max={3}
								step={0.1}
								value={zoom}
								onChange={(e, zoom) => setZoom(zoom)}
								color='secondary'
							/>
						</div>
					</>
				) : null}
			</div>

			<div className='container-buttons'>
				<input
					type='file'
					accept='image/*'
					ref={inputRef}
					onChange={onSelectFile}
					style={{ display: "none" }}
				/>

				<Button
					variant='contained'
					color='primary'
					className={classes.buttons}
					onClick={() => setImage(null)}
				>
					Reset
				</Button>

				<Button
					variant='contained'
					color='primary'
					onClick={triggerFileSelectPopup}
					className={classes.buttons}
				>
					Choose
				</Button>

				<Button
					variant='contained'
					color='secondary'
					onClick={onDownload}
					className={classes.buttons}
				>
					Download
				</Button>
			</div>

			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={open}
				autoHideDuration={4000}
				onClose={handleClose}
			>
				<Alert severity='warning'>Please select an image!</Alert>
			</Snackbar>
		</div>
	);
}
