import React, { useState } from 'react'
import styled from "styled-components";
import {Link as LinkR,NavLink} from "react-router-dom";
import logoimg from '../utils/Images/logoimage.png';
import { MenuRounded} from '@mui/icons-material';
import { Avatar,Modal, Box } from "@mui/material";
import { useDispatch } from 'react-redux';
import { logout } from '../redux/reducer/createSlice';
import Profile from './Profile';

const modalStyle = {
    position: 'relative',
    top: '15%',
    right: '-85%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: "12px",
    width: "300px",    
    transition: 'top 1s slide-in',

    '@media (max-width: 768px)': {
        top: '15%',
        right: '-70%',
    },
};

const Nav = styled.div`
    background-color : ${({theme})=>theme.bg};
    display : flex;
    align-items : center;
    justify-content : center;
    font-size : 1rem;
    position : sticky;
    top : 0;
    z-index : 10;
    color : red;
    border-bottom : 1px solid ${({theme})=>theme.text_secondary+20}
    
`;

const NavContainer = styled.div`
    width : 100%;
    max-width : 1400px;
    padding : 0 25px;
    display : flex;
    gap : 15px;
    align-items : center;
    justify-content : space-between;
    font-size:1rem;
    @media(max-width : 768px){
        padding: 12px ;
    }
    
`;
const NavLogo = styled(LinkR)`
    width : 100%;
    display : flex;
    align-items : center;
    gap : 16px;
    padding : 0 6px;
    font-weight : 600;
    font-size : 18px;
    text-decoration : none;
    color : ${({theme})=>theme.black};
`;
const Logo = styled.img`
    width : 2.5rem;
`;

const MobileIcon = styled.div`
    color : ${({theme})=>theme.text_primary}; 
    display : none;
    cursor : pointer;
    @media screen and (max-width : 768px){
        display : flex;
        align-items : center;
    }
`;

const NavItems = styled.ul`
    width : 100%;
    display : flex;
    align-items : center;
    justify-content : center;
    gap : 32px;
    padding : 0 5px;
    list-style : none;

    @media screen and (max-width : 768px){
        display : none;
    }
`;

const Navlink = styled(NavLink)`
    display : flex;
    align-items : center;
    color : ${({theme})=>theme.text_primary};
    font-weight : 500;
    cursor : pointer;
    transition : all 1s slide-in;
    text-decoration : none;
    &:hover{
        color : ${({theme})=>theme.primary};
    }
    &:active{
        color : ${({theme})=>theme.primary};
        border-bottom : 2px solid ${({theme})=>theme.primary};
    }

    
`;

const UserContainer = styled.div`
    width : 100%;
    height : 100%;
    display : flex;
    justify-content : flex-end;
    gap : 15px;
    align-items : center;
    padding : 0 6px;
    color : ${({theme})=>theme.primary};
`;

const TextButton = styled.div`
    text-align : end;
    color : ${({theme})=>theme.secondary};
    cursor : pointer;
    font-size : 16px;
    transition : all 0.3s ease;
    font-weight : 600;
    &:hover {
        color : ${({theme})=>theme.secondary};
    }
`;

const MobileMenu = styled.ul`
    display : flex;
    flex-direction : column;
    align-items : start;
    gap : 15px;
    list-style : none;
    width : 90%;
    padding : 12px 40px 24px 40px;
    background-color : ${({theme})=>theme.white};
    position : absolute;
    top : 80px;
    right : -20px;
    transition : all 0.6s ease-in-out;
    transform: ${({ isOpen }) =>
        isOpen ? "translateY(0)" : "translateY(-100%)"};
    border-radius: 0 0 20px 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
    z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;

const Navbar = ({currentUser}) => {
  const dispatch = useDispatch()
  const [isOpen,setisOpen] = useState(false)
  
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Nav>
        <NavContainer>
            <MobileIcon onClick={() => setisOpen(!isOpen)}>
                <MenuRounded sx={{color : 'inherit'}} />

            </MobileIcon >
            <NavLogo to="/">
                <Logo src={logoimg}/>
                TrackMyFit
                
            </NavLogo>

            <MobileMenu isOpen = {isOpen}>
                <Navlink to='/'>Dashboard</Navlink>
                <Navlink to='/workouts'>Workouts</Navlink>
                <Navlink to='/tutorials'>Tutorials</Navlink>
                <Navlink to='/blogs'>Blogs</Navlink>
                <Navlink to='/contact'>Contact</Navlink>

            </MobileMenu>
            <NavItems>
                <Navlink to='/'>Dashboard</Navlink>
                <Navlink to='/workouts'>Workouts</Navlink>
                <Navlink to='/tutorials'>Tutorials</Navlink>
                <Navlink to='/blogs'>Blogs</Navlink>
                <Navlink to='/contact'>Contact</Navlink>
            </NavItems>

            <UserContainer>
                <Avatar src={currentUser?.img} 
                onClick={handleOpen}
                style={{ cursor: "pointer" }}>

                    {currentUser?.name[0] }
                </Avatar>

                <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                    <Profile currentUser={currentUser} />
                    </Box>
                </Modal>
                <TextButton onClick={()=>dispatch(logout())}>Logout</TextButton>

                
            </UserContainer>
        </NavContainer>
    </Nav>
  )
}

export default Navbar
