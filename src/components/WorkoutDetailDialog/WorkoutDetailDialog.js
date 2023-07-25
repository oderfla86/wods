import { forwardRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import WorkoutDetailCard from "./WorkoutDetailCard";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function WorkoutDetailDialog(props) {
  return (
    <div>
      <Dialog
        fullScreen
        open={props.isOpen}
        onClose={props.close}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.close}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Workout Details
            </Typography>
            <Button autoFocus color="inherit" onClick={props.close}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <WorkoutDetailCard wod={props.wod} />
      </Dialog>
    </div>
  );
}
