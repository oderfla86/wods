import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Grid } from "@mui/material";
import Divider from "@mui/material/Divider";

function WorkoutCard(props) {
  return (
    <Grid container spacing={1} justifyContent="center">
      {props.workouts.map((wod) => {
        const { title, description, workout } = wod;
        return (
          <Grid item>
            <Card sx={{ width: 300 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[900] }} aria-label="recipe">
                    AH
                  </Avatar>
                }
                action={
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                }
                title={title}
              />
              <Divider variant="middle" />
              <CardContent>
                <Typography variant="body1" color="text.primary" align="center">
                  {description}
                </Typography>
                {workout.map(function (movement) {
                  if (movement.effort)
                    return (
                      <Typography
                        variant="body1"
                        color="text.primary"
                        align="center"
                      >
                        {movement.effort}
                      </Typography>
                    );
                  return wod.type === "ladder" ? (
                    <Typography
                      variant="body1"
                      color="text.primary"
                      align="center"
                    >
                      {`${movement.type} ${
                        movement.weight ? `@${movement.weight}` : ""
                      }`}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      color="text.primary"
                      align="center"
                    >
                      {`${movement.reps} ${movement.type} ${
                        movement.weight ? `@${movement.weight}` : ""
                      }`}
                    </Typography>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default WorkoutCard;
