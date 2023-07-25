import { useState } from "react";
import { update } from "firebase/database";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import { Grid } from "@mui/material";
import Divider from "@mui/material/Divider";
import { getKey } from "../../utils/util";

function WorkoutCard(props) {
  const [wods, setWods] = useState(
    props.user.workouts ? props.user.workouts : []
  );
  function favoriteCardClicked(e) {
    const updatedWods = wods.map((wod) => {
      if (wod.uuid === wods[e.currentTarget.id].uuid) {
        wod.favorite = !wod.favorite;
      }
      return wod;
    });
    setWods(updatedWods);
    update(props.user.dbRef, {
      workouts: updatedWods,
    });
  }

  function getMoreInformation(e) {
    console.log(wods[e.currentTarget.id]);
  }

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ p: 5 }}>
      {wods.map((wod, index) => {
        const { title, description, workout } = wod;
        return (
          <Grid item key={getKey()}>
            <Card sx={{ width: 300 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[900] }} aria-label="recipe">
                    AH
                  </Avatar>
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
                        key={getKey()}
                        variant="body1"
                        color="text.primary"
                        align="center"
                      >
                        {movement.effort}
                      </Typography>
                    );
                  return wod.type === "ladder" ? (
                    <Typography
                      key={getKey()}
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
                      key={getKey()}
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
              <CardActions>
                <IconButton
                  id={index}
                  aria-label="add to favorites"
                  onClick={favoriteCardClicked}
                >
                  <FavoriteIcon
                    style={{ color: wod.favorite ? red[900] : "default" }}
                  />
                </IconButton>
                <IconButton
                  aria-label="more info"
                  id={index}
                  onClick={getMoreInformation}
                >
                  <InfoIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default WorkoutCard;
