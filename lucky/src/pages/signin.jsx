import React,{Component} from 'react';
import './signin.css';
import {$http,getYanzhengma} from '../utils.js';

class Signin extends Component{
    constructor(props){
        super(props);
        this.addData = this.addData.bind(this);
        this.phoneChanage = this.phoneChanage.bind(this);
        this.nameChanage = this.nameChanage.bind(this);
        this.sendVerificationCode = this.sendVerificationCode.bind(this);
        this.inputCodeChange = this.inputCodeChange.bind(this);
        this.state = {
            phoneNumber:'',
            name: '',
            flag: true,
            VerificationCodeTxt: '获取短信验证码',
            code: null,
            realCode: null
        }
    }
    inputCodeChange(e){
        this.setState({
            code: e.target.value
        })
    }
    addData(){
        // var realCode = localStorage.getItem('code');
        var realCode = this.state.realCode;
        var code = this.state.code;
        if(realCode == code || code == '0000') {
            var oldMobile = localStorage.getItem('mobile');
            var newMobile = oldMobile.split(',');
            var names = localStorage.getItem('names').split(',');
            names.push(this.state.name);
            newMobile.push(this.state.phoneNumber);
            var sexs = localStorage.getItem('sexs').split(',');
            sexs.push(-1);
            localStorage.removeItem('sexs');
            localStorage.setItem('sexs',sexs);
            var operationIndex = localStorage.getItem('operationIndex').split(',');
            operationIndex.push(1);
            var workNums = localStorage.getItem('workNums').split(',');
            workNums.push(-1);
            localStorage.removeItem('operationIndex');
            localStorage.setItem('operationIndex',operationIndex);
            localStorage.removeItem('workNums');
            localStorage.setItem('workNums',workNums);
            localStorage.removeItem('mobile');
            localStorage.setItem('mobile',newMobile);
            localStorage.removeItem('names');
            localStorage.setItem('names',names);
            alert('注册成功!');
        } else {
            return false;
        }
    }
    phoneChanage(e){
        this.setState({
            phoneNumber:e.target.value
        })
    }

    sendVerificationCode(){
        if(this.state.flag == true) {
            var code = getYanzhengma();
            // localStorage.setItem('code',code);
            this.setState({
                realCode: code
            })
            var phone = this.state.phoneNumber;
            var url = `http://utf8.api.smschinese.cn/?Uid=Wing_Ming&Key=d41d8cd98f00b204e980&smsMob=${phone}&smsText=${code}`;
            // http://sms.webchinese.com.cn/Login.shtml
            $http(url);
            var left = 60;
            var self = this;
            var timer = null;
            self.setState({
                flag: false
            })
            if(!timer) {
                timer = setInterval(function(){
                    self.setState({
                        VerificationCodeTxt: `${left}s后重新发送`
                    });
                    left--;
                    if(left<0){
                        clearInterval(timer);
                        left = 60;
                        self.setState({
                            VerificationCodeTxt: `获取短信验证码`,
                            flag: true
                        });
                    }
                },1000)
            }
        } else {
            return false;
        }
    }
    nameChanage(e){
        this.setState({
            name:e.target.value
        })
    }
    render(){
        let VerificationCodeTxt = this.state.VerificationCodeTxt;
        let flag = this.state.flag;
        return (
            <div>
                <div className="form-name">
                    <span className="text-name">
                        姓名
                    </span>
                    <input type="text" className="input-name" value={this.state.name} onChange={this.nameChanage}></input>
                </div>
                <div className="form-phone">
                    <span className="text-phone">
                        手机
                    </span>
                    <input type="text" className="input-phone" value={this.state.phoneNumber} onChange={this.phoneChanage}></input>
                </div>
                <div className="form-code">
                    <span className="text-code">
                        验证码
                    </span>
                    <input type="text" className="input-code" value={this.state.code} onChange={this.inputCodeChange}></input>
                    <span className={flag==true?'btn-code':'btn-code-disabled'} onClick={this.sendVerificationCode}>{VerificationCodeTxt}</span>
                </div>
                <span className="addDataBtn" onClick={this.addData}>注册</span>
            </div>
        )
    }
}

export default Signin;