import { useState, useRef } from "react";
import { get, set, ref } from "firebase/database";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
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
  const [error, setError] = useState(false);
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
    const usersRef = ref(props.db, `users/${phoneRef.current.value}`);
    set(usersRef, {
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      phone: phoneRef.current.value,
      id: props.uid,
      workouts: props.workouts,
    });
    props.saveUser({
      id: props.uid,
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      phone: phoneRef.current.value,
      workouts: props.workouts,
    });
    props.validUser(true);
  };

  const loginUser = () => {
    const userRef = ref(props.db, `users/${phoneRef.current.value}`);
    get(userRef)
      .then((userData) => {
        if (userData.exists()) {
          //user exists so we use its data
          const { id, name, surname, phone, workouts } = userData.val();
          const newUser = {
            id,
            name,
            surname,
            phone,
            dbRef: props.db,
            workouts: workouts,
          };
          props.saveUser(newUser);
          props.validUser(true);
        } else {
          setError(true);
          console.log(
            `User with phone:${phoneRef.current.value} doesn't exist`
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // set(usersRef, {
    //   date_of_birth: "June 23, 1912",
    //   full_name: "Alan Turing",
    // });
  };

  return (
    <div>
      <Box m={1} align="center" sx={{ m: 5 }}>
        <TextField
          label="Phone Number"
          error={error}
          id="outlined-error-helper-text"
          helperText={error ? "Incorrect entry." : ""}
          inputRef={phoneRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  color="primary"
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={loginUser}
                >
                  Login
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Typography align="center" sx={{ m: 10 }}>
        <Button
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          onClick={handleClickOpen}
        >
          Create Account
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
