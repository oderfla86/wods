import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

function Loader() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}

export default Loader;
