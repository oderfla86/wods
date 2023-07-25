import { update } from "firebase/database";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import { getKey } from "../../utils/util";

export default function WorkoutDetailCard(props) {
  const { title, description, workout, type, comments, notes } = props.wod;

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ p: 5 }}>
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
            return type === "ladder" ? (
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
      </Card>
    </Grid>
  );
}
