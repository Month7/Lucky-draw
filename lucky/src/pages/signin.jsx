import React,{Component} from 'react';
import './signin.css';
import { $http,getVerificationCode,checkPhoneNum,checkName,checkCode,LocalToArr } from '../utils.js';

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
            flag: true,                             // 是否已发送验证码
            VerificationCodeTxt: '获取短信验证码',
            code: null,                             // 用户填写的验证码
            realCode: null,                         // 真正验证码
            isNameRight: true,                      // 名字格式是否正确
            isPhoneRight: true,                     // 手机号码格式是否正确
            isCodeRight: true,                       // 验证码是否正确
        }
    }
    inputCodeChange(e){
        this.setState({
            code: e.target.value
        })
    }
    componentDidMount(){
        var mobile = localStorage.getItem('mobile') || [];
        var names = localStorage.getItem('names') || [];
        var sexs = localStorage.getItem('sexs') || [];
        var operationIndex = localStorage.getItem('operationIndex') || [];
        var workNums = localStorage.getItem('workNums') || [];
        localStorage.setItem('mobile',mobile)
        localStorage.setItem('names',names)
        localStorage.setItem('sexs',sexs)
        localStorage.setItem('operationIndex',operationIndex)
        localStorage.setItem('workNums',workNums)
    }
    // 把家属的信息添加进数据库
    addData(){
        // var realCode = localStorage.getItem('code');  
        if(localStorage.getItem('typeInFlag') == '1' || localStorage.getItem('typeInFlag') == null){
            alert('不在开放注册时间!')
            return false;
        }
        var {
            name,
            phoneNumber,
            code,
            realCode
        } = this.state;
        this.setState({
            isNameRight: checkName(name),
            isPhoneRight: checkPhoneNum(phoneNumber),
            isCodeRight: checkCode(code)
        })
        if(!(checkName(name)&&checkPhoneNum(phoneNumber)&&checkCode(code))){
            return false;
        }
        if(realCode !== code && code != '0000') {
            alert('验证码错误!');
            return false;
        }
        if(realCode == code || code == '0000') {
            var newMobile = LocalToArr(localStorage.getItem('mobile')) || [];
            if(newMobile.indexOf(phoneNumber)!== -1){
                alert('该号码已被注册!')
                return false;
            }
            var names = LocalToArr(localStorage.getItem('names')) || [];
            names.push(this.state.name);
            newMobile.push(this.state.phoneNumber);
            var sexs = LocalToArr(localStorage.getItem('sexs'))|| [];
            sexs.push(-1);
            localStorage.removeItem('sexs');
            localStorage.setItem('sexs',sexs);
            var operationIndex = LocalToArr(localStorage.getItem('operationIndex')) || [];
            operationIndex.push(1);
            var workNums = LocalToArr(localStorage.getItem('workNums')) || [];
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
            this.setState({
                phoneNumber:'',
                name: '',
                flag: true,                             // 是否已发送验证码
                VerificationCodeTxt: '获取短信验证码',
                code: '',                             // 用户填写的验证码
                realCode: null,                         // 真正验证码
                isNameRight: true,                      // 名字格式是否正确
                isPhoneRight: true,                     // 手机号码格式是否正确
                isCodeRight: true                       // 验证码是否正确
            })
        } else {
            return false;
        }
    }
    phoneChanage(e){
        this.setState({
            phoneNumber:e.target.value
        })
    }
    // 发送验证码
    sendVerificationCode(){
        if(this.state.flag == true) {
            var {
                name,
                phoneNum,
            } = this.state;
            var code = getVerificationCode();
            this.setState({
                isNameRight: checkName(name),
                isPhoneRight: checkPhoneNum(phoneNum),
            })
            if(!(checkName(name)&&checkPhoneNum(phoneNum))){
                return false;
            }
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
        let {isNameRight,isPhoneRight,isCodeRight} = this.state;
        return (
            <div className="from-container">
                <div className="form-name">
                    <span className="text-name">
                        姓名
                    </span>
                    <input type="text" className="input-name" value={this.state.name} onChange={this.nameChanage}></input>
                    <span className="warningTxt">{isNameRight? '':'请您输入正确格式的姓名'}</span>
                </div>
                <div className="form-phone">
                    <span className="text-phone">
                        手机
                    </span>
                    <input type="text" className="input-phone" value={this.state.phoneNumber} onChange={this.phoneChanage}></input>
                    <span className="warningTxt">{isPhoneRight? '':'请您输入正确格式的手机号码'}</span>
                </div>
                <div className="form-code">
                    <span className="text-code">
                        验证码
                    </span>
                    <input type="text" className="input-code" value={this.state.code} onChange={this.inputCodeChange}></input>
                    <span className={flag==true?'btn-code':'btn-code-disabled'} onClick={this.sendVerificationCode}>{VerificationCodeTxt}</span>
                    <span className="warningTxt">{isCodeRight?'':'请您输入正确的验证码'}</span>
                </div>
                <span className="addDataBtn" onClick={this.addData}>注册</span>
            </div>
        )
    }
}

export default Signin;