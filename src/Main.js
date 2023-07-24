import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, onValue, get } from "firebase/database";
import WorkoutCard from "./components/WorkoutCards/WorkoutCard";
import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";

export default function Main() {
  const [workouts, setWorkouts] = useState([]);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const images = require.context("./Images", true);
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
  let user = useRef(null);

  useEffect(() => {
    app.current = initializeApp(firebaseConfig);
    db.current = getDatabase(app.current);
    authenticate();
  }, []);

  async function authenticate() {
    const auth = getAuth();
    const authUser = await signInAnonymously(auth);
    if (authUser) {
      getWods();
      console.log("UID value:", authUser.user.uid);
      user.current = {
        uid: authUser.user.uid,
        dbRef: ref(db.current, `users/${authUser.user.uid}`),
      };
      getUserData();
    } else {
      console.error("Unable to authenticate user");
    }
  }

  async function getUserData() {
    get(user.current.dbRef)
      .then((userData) => {
        if (userData.exists()) {
          //user exists so we use its data
          const { id, name, surname, phone, workouts } = userData.val();
          user.current = {
            id,
            name,
            surname,
            phone,
            dbRef: user.current.dbRef,
            workouts: workouts,
          };
          setIsExistingUser(true);
          setIsLoading(false);
        } else {
          //user doesn't exists, needs to login
          setIsLoading(false);
          console.log(`User with id:${user.current.uid} doesn't exist`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getWods() {
    const wodsRef = ref(db.current, `workouts`);
    onValue(wodsRef, (snapshot) => {
      console.info(snapshot.val());
      setWorkouts(snapshot.val());
      // const help = snapshot.val().map((item) => {
      //   item.uuid = getUid();
      //   return item;
      // });
      // console.log(JSON.stringify(help));
    });
  }

  if (isLoading) {
    return <Loader />;
  } else {
    if (isExistingUser) {
      return <WorkoutCard user={user.current} />;
    }
    return (
      <Login user={user} workouts={workouts} validUser={setIsExistingUser} />
    );
  }
}
