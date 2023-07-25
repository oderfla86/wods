import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import WorkoutCard from "./components/WorkoutCards/WorkoutCard";
import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";
import AppBarNav from "./components/AppBar/AppBar";

export default function Main() {
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});

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
  let userUidRef = useRef(null);
  let workoutsRef = useRef(null);

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
      const uidRef = ref(db.current, `identifiers/${authUser.user.uid}`);
      set(uidRef, {
        uid: authUser.user.uid,
      });
      userUidRef.current = authUser.user.uid;
    } else {
      console.error("Unable to authenticate user");
    }
  }

  async function getWods() {
    const wodsRef = ref(db.current, `workouts`);
    onValue(wodsRef, (snapshot) => {
      console.info(snapshot.val());
      workoutsRef.current = snapshot.val();
      setIsLoading(false);
      // const help = snapshot.val().map((item) => {
      //   item.uuid = getUid();
      //   return item;
      // });
      // console.log(JSON.stringify(help));
    });
  }

  function logout() {
    setIsExistingUser(false);
    setUser({});
  }

  if (isLoading) {
    return <Loader />;
  } else {
    if (isExistingUser) {
      //return <WorkoutCard user={user} />;
      return <AppBarNav user={user} logout={logout} view={"default"} />;
    }
    return (
      <Login
        uid={userUidRef.current}
        db={db.current}
        workouts={workoutsRef.current}
        validUser={setIsExistingUser}
        saveUser={setUser}
      />
    );
  }
}
