import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import Welcome from "../Welcome/Welcome";
import WorkoutCard from "../WorkoutCards/WorkoutCard";

function AppBarNav(props) {
  const [currentView, setCurrentView] = useState(props.view);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Workouts
          </Typography>
          <Button color="inherit" onClick={props.logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Welcome name={props.user.name} />
      <Divider variant="middle" />
      {currentView === "default" ? <WorkoutCard user={props.user} /> : null}
    </Box>
  );
}

export default AppBarNav;
