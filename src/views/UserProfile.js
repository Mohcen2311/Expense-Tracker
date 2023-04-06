import React, { useContext, useState } from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";

import { AuthContext } from "../context/AuthContext";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";

import { v4 as uuidv4 } from "uuid";

function User() {
  const { currentUser, userInfo } = useContext(AuthContext);

  const [successfullCreation, setSuccessfullCreation] = useState(false);

  while (userInfo === {}) {
    console.log(userInfo);
  }

  // this part of updating the profile
  const [userName, setUserName] = useState(userInfo.userName);
  const [email, setEmail] = useState(userInfo.email);
  const [fullName, setFullName] = useState(userInfo.fullName);
  const [city, setCity] = useState(userInfo.city);
  const [country, setCountry] = useState(userInfo.country);
  const [income, setIncome] = useState(userInfo.income);

  // this part of adding a new sub user
  const [subUserIncome, setSubUserIncome] = useState("");
  const [selectedOption, setSelectedOption] = useState("Child");
  const [subUserCode, setSubUserCode] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    const userRef = doc(db, "users", currentUser.uid);

    try {
      await updateDoc(userRef, {
        userName,
        fullName,
        photoURL: userInfo.photoURL,
        email,
        city,
        country,
        uid: currentUser.uid,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddingSubUser = async (e) => {
    e.preventDefault();

    // 86c3ab01-c780-4cbc-adb0-333ee5f9db6c
    const subUserCodeTemp = uuidv4();

    try {

      setSubUserCode(subUserCodeTemp);

      await addDoc(collection(db, 'users'), {
        user_id: currentUser.uid,
        is_sub_user: true,
        granted_income: subUserIncome,
        sub_user_code: subUserCodeTemp,
        type: selectedOption,
      } );

      setSuccessfullCreation(true);
    } catch (error) {
      console.log(error);
      setErr(true);
      setLoading(false);
    }

  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="7">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => handleUpdate(e)}>
                  <Row>
                    <Col className=" px-1 ml-2" md="3">
                      <Form.Group>
                        <label>Username</label>
                        <Form.Control
                          value={userName}
                          placeholder={userInfo.userName}
                          onChange={(e) => setUserName(e.target.value)}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Form.Control
                          placeholder={userInfo.email}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Full Name</label>
                        <Form.Control
                          placeholder={userInfo.fullName}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Income</label>
                        <Form.Control
                          placeholder={userInfo.income}
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>City</label>
                        <Form.Control
                          placeholder={userInfo.city}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Country</label>
                        <Form.Control
                          placeholder={userInfo.country}
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right mt-1"
                    type="submit"
                    variant="info"
                  >
                    Update Profile
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <Card.Body>
                <div className="author mt-3">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={userInfo.photoURL}
                    ></img>
                    <h5 className="title">{userInfo.fullName}</h5>
                  </a>
                  <p className="description">{userInfo.userName}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="10">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Create a Subuser</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => handleUpdate(e)}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Income</label>
                        <Form.Control
                          value={subUserIncome}
                          onChange={(e) => setSubUserIncome(e.target.value)}
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="6">
                      <Dropdown className="d-flex form-select flex-column ml-2 my-2 h-25">
                        <label htmlFor="dropdown">Relative</label>
                        <select
                          id="dropdown"
                          className="form-control"
                          onChange={handleChange}
                        >
                          <option value="Child">Child</option>
                          <option value="Husband">Husband</option>
                          <option value="Wife">Wife</option>
                          <option value="Friend">Friend</option>
                          <option value="Relative">Relative</option>
                          <option value="Other">Other</option>
                        </select>
                      </Dropdown>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right mt-1"
                    type="submit"
                    variant="info"
                    onClick={handleAddingSubUser}
                  >
                    Create a new Subuser
                  </Button>
                  { successfullCreation && (
                    <div className="clearfix mt-2">
                      Provide the sub-user with this code <span className="text-success">{subUserCode}</span> 
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default User;
