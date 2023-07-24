import { useState, useRef } from "react";
import { set } from "firebase/database";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Login(props) {
  const [open, setOpen] = useState(false);
  const nameRef = useRef("");
  const surnameRef = useRef("");
  const phoneRef = useRef("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitUserData = () => {
    setOpen(false);
    set(props.user.current.dbRef, {
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      phone: phoneRef.current.value,
      id: props.user.current.uid,
      workouts: props.workouts,
    });
    props.validUser(true);
  };

  return (
    <div>
      <Typography align="center" sx={{ m: 10 }}>
        <Button
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          onClick={handleClickOpen}
        >
          Login to access the workouts
        </Button>
      </Typography>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To have access to the workouts, please enter your name and email
            address here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            inputRef={nameRef}
          />
          <TextField
            margin="dense"
            id="surname"
            label="Surname"
            type="text"
            fullWidth
            variant="outlined"
            inputRef={surnameRef}
          />
          <TextField
            margin="dense"
            id="name"
            label="Phone"
            type="number"
            fullWidth
            variant="outlined"
            inputRef={phoneRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitUserData}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Login;
