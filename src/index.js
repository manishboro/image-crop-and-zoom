import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

import RenderSnackbar from "./components/snackbar/snackbar";
import SimpleBackdrop from "./components/backdrop/backdrop";

ReactDOM.render(
	<RenderSnackbar>
		<SimpleBackdrop>
			<App />
		</SimpleBackdrop>
	</RenderSnackbar>,
	document.getElementById("root")
);
