import { useState, useEffect, useRef } from "react";
import "./Main.scss";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

function Main() {
  const images = require.context("./Images", true);
  const firebaseConfig = {
    apiKey: "AIzaSyA0dberbHig8XFSbGVjV86wf_rO5Eo1C7c",
    authDomain: "wods-53f4c.firebaseapp.com",
    projectId: "wods-53f4c",
    storageBucket: "wods-53f4c.appspot.com",
    messagingSenderId: "733051430910",
    appId: "1:733051430910:web:575aa85aec099db64d42af",
  };

  let app = useRef(null);
  let db = useRef(null);
  let wods = useRef(null);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    app.current = initializeApp(firebaseConfig);
    db.current = getDatabase(app.current);
    getWods();
  }, []);

  async function getWods() {
    wods = ref(db.current, `workouts`);

    let result = await signInAnonymously(getAuth(app.current));
    if (result) {
      console.log("Logged in as:", result.user.uid);

      onValue(wods, (snapshot) => {
        //fires whenever a change occurs
        let wods = snapshot.val();
        console.log(wods);
        setWorkouts(wods);
      });
    }
    //   playerId.current = result.user.uid;
    //   playerRef.current = ref(db.current, `players/${playerId.current}`);
    //   set(playerRef.current, {
    //     name: "dummy",
    //     id: playerId.current,
    //   });
  }

  return (
    <div className="wrapper">
      {workouts.map(function (wod) {
        if (wod.type === "ladder") {
          return (
            <LadderCard
              key={wod.description}
              wod={wod}
              img={images(`./bg.png`)}
            />
          );
        } else {
          return (
            <Card key={wod.description} wod={wod} img={images(`./bg.png`)} />
          );
        }
      })}
    </div>
  );
}

function LadderCard(props) {
  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">{props.wod.title}</h3>
        <h4 className="card__description">{props.wod.description}</h4>
        {props.wod.details.map(function (item) {
          return item.movements.map(function (movement) {
            if (movement.reps) {
              return (
                <h4
                  key={movement.reps}
                  className="card__description"
                >{`${movement.reps}`}</h4>
              );
            } else {
              return (
                <h4
                  key={movement.type}
                  className="card__description"
                >{`${movement.type}`}</h4>
              );
            }
          });
        })}
      </div>
    </div>
  );
}

function Card(props) {
  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">{props.wod.title}</h3>
        <h4 className="card__description">{props.wod.description}</h4>
        {props.wod.details.map(function (item) {
          return item.movements.map(function (movement) {
            if (movement.rounds) {
              return (
                <h4
                  key={movement.rounds}
                  className="card__description"
                >{`${movement.rounds}`}</h4>
              );
            } else {
              return (
                <h4
                  key={movement.type}
                  className="card__description"
                >{`${movement.reps} ${movement.type}`}</h4>
              );
            }
          });
        })}
      </div>
    </div>
  );
}

export default Main;
