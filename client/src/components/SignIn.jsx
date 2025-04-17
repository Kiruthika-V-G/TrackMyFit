import React,{useState} from 'react'
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';
import {useDispatch} from "react-redux";

import { UserSignIn } from '../api/index.js';
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

const SignIn = () => {
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validation = () => {
    if(!email || !password){
        alert("Please fill all the fields");
        return false;
    }
    return true;
  }

  const handleSignIn = async() => {
    setLoading(true);
    setButtonDisabled(true);
    if(validation()){
        await UserSignIn({email,password})
            .then((res) => {
                console.log(email,password);
                dispatch(loginSuccess(res.data));
                setLoading(false);
                setButtonDisabled(false);
            })
            .catch((e)=> {
                alert(e.response.data.message);
                setLoading(false);
                setButtonDisabled(false);
            })

            
    }
  }
  return (
    
    <Container>
        <div>
            <Title>
                Welcome again to TrackMyFit👋 
            </Title>
            <Span>
                Please login your details here.
            </Span>
            
        </div>

        <FormContainer>
            <TextInput label="Email Address" placeholder={"Enter your email address"} value={email} handleChange={e=>setEmail(e.target.value)}/>
            <TextInput label="Password" placeholder={"Enter your password"} password value={password} handleChange={e=>setPassword(e.target.value)}/>
            <Button text="SignIn" onClick={handleSignIn} isLoading={loading} isDisabled={buttonDisabled}/>
        </FormContainer>
        

    </Container>
  )
}

export default SignIn
