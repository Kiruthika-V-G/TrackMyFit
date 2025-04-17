import {ThemeProvider,styled} from "styled-components";
import { lightTheme } from "./utils/Themes";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Authentication from "./pages/Authentication";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard  from "./pages/Dashboard" 
import Workouts from "./pages/Workouts";
import { useSelector } from "react-redux";

const DivStyle = styled.div`
    width : 100%;
    height : 100vh;
    display : flex;
    flex-direction : column;
    background : ${({theme})=> theme.bg};
    color : ${({theme})=> theme.text_primary};
    overflow-x : hidden;
    transition : all 0.2s ease; // mades transition effects smoothly with ease in 200ms for all properties
`;
function App() {
    const {currentUser} = useSelector((state) => state.user)
    
    return(
        <ThemeProvider theme={lightTheme}> {/* themeprovider passes theme to childern comp as props by defult so that no need to import lighttheme in authentication*/}
            <Router>
                {currentUser ? (
                    <DivStyle>
                        <Navbar currentUser={currentUser}/>
                        <Routes>
                            <Route path="/" exact element={<Dashboard/>}></Route>
                            <Route path="/workouts" exact element={<Workouts/>}></Route>
                            {/*<Route path="/tutorials" exact element={<Tutorials/>}></Route>
                            <Route path="/blogs" exact element={<Blogs/>}></Route>
                            <Route path="/contact" exact element={<Contact/>}></Route>*/}
                        </Routes>
                    </DivStyle>
                    ) 
                    :(
                    <DivStyle>
                        <Authentication />
                    </DivStyle>)
                }
                
            </Router>
        </ThemeProvider>
    )
}

export default App;
