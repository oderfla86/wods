import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Welcome(props) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography align="center" variant="h6" sx={{ m: 2 }}>
        {`Welcome back, ${props.name}!`}
      </Typography>
    </Box>
  );
}

export default Welcome;
