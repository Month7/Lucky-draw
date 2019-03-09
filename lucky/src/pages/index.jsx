import React,{Component} from 'react'
// import ManageEntrance from '../components/manageEntrance/manageEntrance'
import backgroundImg from '../imgs/background.jpg'
import './Index.css';
import {NavLink} from 'react-router-dom';
let mainStyle ={
    height:"750px",
    width:"100%",
    backgroundImage:`url(${backgroundImg})`,
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
}
class Index extends Component{
    constructor(){
        super();
        this.state = {
            password: ''
        }
        this.managerSignin = this.managerSignin.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
    }
    managerSignin(){
        // 用路由拦截改写
        if(this.state.password == '123456') {
            window.location.href="/manage";
        } else {
            alert('密码不正确!');
        }
    }
    passwordChange(e){
        this.setState({
            password: e.target.value
        })
    }
    render(){
        return (
            <div style={mainStyle}>
                <div className="entrance">
                    <div className="manageEn">
                        <span className="entranceTxt">请输入密码123456</span>
                        <div>
                            <input type="text" value={this.state.password} onChange={this.passwordChange} className="managePassword"></input>
                            <div className="btn" onClick={this.managerSignin}>登入管理员端</div>
                        </div>
                    </div>
                    <div className="vistorEn">
                        <div>
                            <NavLink exact to="/signin"><div className="btn">登入用户端</div> </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Index