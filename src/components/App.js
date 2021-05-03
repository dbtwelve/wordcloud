import React, {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {authService} from "fbase"

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {  //로그인상태변화 체크
      if(user){ //사용자로그인 했을경우
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null)
      }
      setInit(true)
    });
  }, []);  
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }
  return (
    <>
    {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
    <footer className="footer">&copy; {new Date().getFullYear()} By. dbtwelve</footer>
    </>
    );
}

export default App;
