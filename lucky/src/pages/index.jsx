import React,{Component} from 'react'
// import ManageEntrance from '../components/manageEntrance/manageEntrance'
import backgroundImg from '../imgs/background.jpg'
import './Index.css';
import {NavLink} from 'react-router-dom';
import {LocalToArr} from '../utils'
let mainStyle ={
    position: "absolute",
    top:"0px",
    bottom:"0px",
    height:"100%",
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
            password: '',
        }
        this.managerSignin = this.managerSignin.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        // typyInFlag
    }
    managerSignin(e){
        // 用路由拦截改写
        if(this.state.password == '123456') {
            // window.location.href="/manage";
        } else {
            e.preventDefault();
            alert('密码不正确!');
            return false;
        }
    }
    passwordChange(e){
        this.setState({
            password: e.target.value
        })
    }
    componentDidMount(){
        var mobile = LocalToArr(localStorage.getItem('mobile')) || [];
        var names = LocalToArr(localStorage.getItem('names')) || [];
        var operationIndex = LocalToArr(localStorage.getItem('operationIndex')) || [];
        var sexs = LocalToArr(localStorage.getItem('sexs')) || [];
        var workNums = LocalToArr(localStorage.getItem('workNums')) || [];
        localStorage.clear();
        localStorage.setItem('mobile',mobile);
        localStorage.setItem('names',names);
        localStorage.setItem('operationIndex',operationIndex);
        localStorage.setItem('sexs',sexs);
        localStorage.setItem('workNums',workNums);
        localStorage.setItem('typeInFlag','1')    // 是否可以录入 1不可以 0可以
    }
    render(){
        return (
            <div style={mainStyle}>
                <div className="entrance">
                    <div className="manageEn">
                        <span className="entranceTxt">请输入密码123456</span>
                        <div>
                            <input type="password" value={this.state.password} onChange={this.passwordChange} className="managePassword" placeholder="请输入开启密码"></input>
                            <NavLink exact to="/manage" onClick={this.managerSignin}><div className="btn">登入管理员端</div> </NavLink>
                            {/* <div className="btn" onClick={this.managerSignin}>登入管理员端</div> */}
                        </div>
                    </div>
                    <div className="vistorEn">
                        <div>
                            <NavLink exact to="/signin"><div className="btn">用户注册</div> </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Index