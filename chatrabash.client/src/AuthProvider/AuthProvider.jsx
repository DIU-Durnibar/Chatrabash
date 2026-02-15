import React, { createContext, useEffect, useState } from "react";
import auth from "../Firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider()

  const handleRegister = (mail, pass) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, mail, pass);
    
  };

  const handleUpdateProfile = (name, url) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: url,
    });
  };

  const handleLogin = (mail, pass) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, mail, pass);
  };

  const handleGoogleLogIn = () =>{
    return signInWithPopup(auth,provider)
  }

  const handleSignOut = () =>{
     signOut(auth)
     setLoading(true)
  }

  const authInfo = {
    handleRegister,
    handleUpdateProfile,
    handleLogin,
    user,
    setUser,
    handleSignOut,
    setLoading,
    loading,
    handleGoogleLogIn
  };
//   console.log(user);

  //   set an observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false)
    });

    return ()=>{
        unsubscribe();
    }
  }, []);

  return (
    // <div>
    <AuthContext.Provider value={authInfo}>
        {children}

    </AuthContext.Provider>
    // </div>
  );
};

export default AuthProvider;