import React,{useState} from 'react'
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';

import {useDispatch} from "react-redux";

import { UserSignUp } from '../api/index.js';
import {loginSuccess} from "../redux/reducer/createSlice.js"

const Container = styled.div`
    display : flex;
    flex-direction : column;
    width : 100%;
    max-width : 550px;
`;
const Title = styled.div`
    font-size : 30px;
    font-weight : 800;
    color : ${({theme})=>theme.text_primary}
`;
const Span = styled.div`
    font-size : 16px;
    font-weight : 400;
    color : ${({theme})=>theme.text_secondary+90};
`;

const FormContainer = styled.div`
    display : flex;
    flex-direction : column;
    gap : 20px;
    margin-top  :20px;
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validation = () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    if (validation()) {
      await UserSignUp({ name, email, password })
        .then((res) => {
          dispatch(loginSuccess(res.data));
          alert("Account Created Success");
          setLoading(false);
          setButtonDisabled(false);
        })
        .catch((err) => {
          alert(err.response.data.message);
          setLoading(false);
          setButtonDisabled(false);
        });
    }
  };
  return (
    <Container>
        <div>
            <Title>
                Create a new account 💪
            </Title>
            <Span>
                Please enter your details to SignUp.
            </Span>
            
        </div>

        <FormContainer>
            <TextInput label="Name" placeholder={"Enter your name"} value={name} handleChange={e=>setName(e.target.value)}/>
            <TextInput label="Email Address" placeholder={"Enter your email address"} value={email} handleChange={e=>setEmail(e.target.value)}/>
            <TextInput label="Password" placeholder={"Enter your password"} password value={password} handleChange={e=>setPassword(e.target.value)}/>
            
            <Button text="SignUp" onClick={handleSignUp} isLoading={loading} isDisabled={buttonDisabled}/>
        </FormContainer>
        

    </Container>
  )
}

export default SignUp
