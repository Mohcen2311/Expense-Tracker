import React, { useState } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBFile,
} from "mdb-react-ui-kit";

// import Form from 'react-bootstrap/Form';

import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../database/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

const LIST_OF_CATEGORIES = ["Fruits", "Vegetables", "Fun", "Luxury", "Other"];

function App() {
  const [err, setErr] = useState(false);

  const [successfulCreation, setSuccessfullCreation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubUser, setIsSubUser] = useState(true);
  const [subUserCode, setSubUserCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const fullName = e.target[0].value;
    const userName = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;
    const country = e.target[4].value;
    const city = e.target[5].value;
    const imageFile = e.target[6].files[0];

    if (!isSubUser) {
      try {
        // create the user
        const res = await createUserWithEmailAndPassword(auth, email, password);

        const date = new Date().getTime();
        const storageRef = ref(storage, `${userName + date}`);

        uploadBytesResumable(storageRef, imageFile).then(() => {
          getDownloadURL(storageRef).then(async (downloadUrl) => {
            try {
              await updateProfile(res.user, {
                userName,
                photoURL: downloadUrl,
              });

              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                userName,
                fullName,
                income,
                email,
                photoURL: downloadUrl,
                city,
                country,
              });

              // setting the document in the categories db
              for(const category of LIST_OF_CATEGORIES){
                
                await addDoc(collection(db, "Expenses Categories"), {
                  user_id: res.user.uid,
                  expenseCategory: category,
                  numberOfExpenses: 0
                })
              }

            } catch (error) {
              console.log(error);
              setErr(true);
              setLoading(false);
            }
          });
        });
      } catch (error) {
        console.log(error);
        setErr(true);
        setLoading(false);
      }

      setSuccessfullCreation(true);

      setInterval(() => {
        setSuccessfullCreation(false);

        navigate("/");
      }, 4000);
    } else {

      try {
        // create the user
        const res = await createUserWithEmailAndPassword(auth, email, password);

        const date = new Date().getTime();
        const storageRef = ref(storage, `${userName + date}`);

        uploadBytesResumable(storageRef, imageFile).then(() => {
          getDownloadURL(storageRef).then(async (downloadUrl) => {
            try {
              await updateProfile(res.user, {
                userName,
                photoURL: downloadUrl,
              });

              const q = query(
                collection(db, "users"),
                where("sub_user_code", "==", subUserCode)
              );

              const querySnapshot = await getDocs(q);
              querySnapshot.forEach(async (docSnapshot) => {
                const userRef = doc(db, "users", docSnapshot.id)

                await updateDoc(userRef, {
                  ...doc,
                  userName,
                  fullName,
                  email,
                  photoURL: downloadUrl,
                  city,
                  country,
                })
              });

            } catch (error) {
              console.log(error);
              setErr(true);
              setLoading(false);
            }
          });
        });
      } catch (error) {
        console.log(error);
        setErr(true);
        setLoading(false);
      }

      setSuccessfullCreation(true);

      setInterval(() => {
        setSuccessfullCreation(false);

        navigate("/");
      }, 4000);
    }
  };

  return (
    <MDBContainer className="p-3 my-2 d-flex flex-column w-50">
      <h2 className="mb-5 text-center">Join Us !</h2>

      <form onSubmit={handleSubmit} className="w-100">
        <MDBInput
          wrapperClass="mb-4"
          label="Full Name"
          id="form-full-name"
          type="text"
        />

        <MDBInput
          wrapperClass="mb-4"
          label="User Name"
          id="form-user-name"
          type="text"
        />

        <MDBInput
          wrapperClass="mb-4"
          label="Email address"
          id="form-email"
          type="email"
        />
        <MDBInput
          wrapperClass="mb-4"
          label="Password"
          id="form-pass"
          type="password"
        />

        <MDBInput
          wrapperClass="mb-4"
          label="Country"
          id="form-country"
          type="text"
        />

        <MDBInput wrapperClass="mb-4" label="City" id="form-city" type="text" />

        <MDBFile className="mb-4 border-0" label="Image" id="form-file" />

        <div className="d-flex">
          <label
            htmlFor="issubuser"
            className="mr-2"
            style={{
              fontSize: "1.1rem",
            }}
          >
            Are you registering as a sub user ?
          </label>

          <input
            type="checkbox"
            id="issubuser"
            checked={isSubUser}
            style={{
              marginTop: "2px",
              height: "20px",
              width: "20px",
            }}
            onChange={(e) => setIsSubUser(e.target.checked)}
          />
        </div>

        {isSubUser && (
          <MDBInput
            wrapperClass="mb-4 mt-2"
            label="Enter the provided code"
            id="form-city"
            type="text"
            value={subUserCode}
            onChange={(e) => setSubUserCode(e.target.value)}
          />
        )}

        <MDBBtn>Sign up</MDBBtn>

        {err && <span className="title"> An error has happened </span>}
        {successfulCreation && (
          <span className="title" style={{ color: "green", fontSize: "1rem" }}>
            {" "}
            Account created successfully, Wait ...{" "}
          </span>
        )}
      </form>
      <div className="text-center mt-3">
        <p>
          Already have an account ? <a href="/user/login"> Login</a>
        </p>
      </div>
    </MDBContainer>
  );
}

export default App;
