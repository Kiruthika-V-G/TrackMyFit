import React,{useState} from "react";
import {styled} from "styled-components";
import Authimg from '../utils/Images/AuthImage.jpg'
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";


const DivStyle = styled.div`
    display : flex;
    flex : 1;
    background : ${({theme}) => theme.bg};
    height : 100%;
    @media(max-width:768px){
        flex-direction : column;
    }
`;
const Image = styled.div`
    flex : 1;
    
    @media(max-width:768px){
        display : none;
    }
`;
const Auth = styled.div`
    flex : 1;
    display : flex;
    flex-direction : column;
    padding : 40px;
    gap : 16px;
    align-items : center;
    justify-content : center;
`;

const Picture = styled.img`
    width : 100%;
    height : 100vh;
`;

const Text = styled.div`
    font-size : 16px;
    color : ${({theme})=>theme.text_secondary};
    margin-top : 16px;
    @media(max-width : 400px){
        font-size : 15px;
    }
`;

const TextButton = styled.span`
    color : ${({theme})=>theme.primary};
    cursor : pointer;
    transition : all 0.3s ease;
    font-weight : 600;
`;

function Authentication(){
    const [login,setLogin] = useState(true);
    return(
        <DivStyle>
            <Image>
                <Picture src={Authimg}/>
            </Image>

            <Auth>
                {
                    login ? (
                        <>
                            <SignIn/>
                            <Text>Don't have an account? <TextButton onClick={()=>setLogin(false)}>SignUp</TextButton></Text>
                        </>
                    ):(
                        <>
                            <SignUp/>
                            <Text>Already have an account? <TextButton onClick={()=>setLogin(true)}>SignIn</TextButton></Text>
                        </>
                    )
                }
            </Auth>
        </DivStyle>
    )
}

export default Authentication;