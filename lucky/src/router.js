import React from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Index from './pages/index';
import Manage from './pages/manage';
import Signin from './pages/signin';
import LuckyDraw from './pages/luckyDraw';

import backgroundImg from './imgs/background.jpg'
let mainStyle ={
    height:"750px",
    width:"100%",
    backgroundImage:`url(${backgroundImg})`,
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
}


const RootRouter = () => {
    return (
        <BrowserRouter basename="/">
            <div style={mainStyle}>
                <Switch>
                    <Route exact path="/" component={Index}></Route>
                    <Route path="/manage" component={Manage}></Route>
                    <Route path="/signin" component={Signin}></Route>
                    <Route path="/luckydraw" component={LuckyDraw}></Route>
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default RootRouter;