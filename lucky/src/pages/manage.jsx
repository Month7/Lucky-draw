import React,{Component} from 'react';
import jschardet from 'jschardet';
import Papa from 'papaparse';
import {NavLink} from 'react-router-dom';
import './manage.css'


class Manage extends Component{
    constructor(){
        super();
        this.loadData = this.loadData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.state = {
            phones: [],
            names: [],
            sexs: [],
            workNums: [],
            operations: []
        }
    }
    updateData(e){
        var index = e.target.parentNode.getAttribute('updateIndex');
        var phones = localStorage.getItem('mobile').split(',')
        phones[index] = 'update 测试';
        localStorage.removeItem('mobile');
        localStorage.setItem('mobile',phones);
        this.setState({
            phones: localStorage.getItem('mobile').split(',')
        })
    }
    // 判断编码类型
    checkEncoding(base64Str){
        //这种方式得到的是一种二进制串
        var str = atob(base64Str.split(";base64,")[1]);
        //要用二进制格式
        var encoding = jschardet.detect(str);
        encoding = encoding.encoding;
        if(encoding == "windows-1252"){    //有时会识别错误（如UTF8的中文二字）
            encoding = "ANSI";
        }
        return encoding;
    }
    saveData(data){
        var mobile = [];
        var names = [];
        var workNums = [];
        var sexs = [];
        var operationIndex = [];
        for(var i=1;i<data.length;i++){
            var temp = data[i];
            var workNumber = temp[0];
            var name = temp[1];
            var sex = temp[2];
            var phoneNum = temp[3];
            sexs.push(sex);
            workNums.push(workNumber);
            mobile.push(phoneNum);
            names.push(name);
            operationIndex.push(i);
        }
        localStorage.setItem('mobile',mobile);
        localStorage.setItem('names',names);
        localStorage.setItem('sexs',sexs);
        localStorage.setItem('workNums',workNums);
        localStorage.setItem('operationIndex',operationIndex);
        this.setState({
            phones: localStorage.getItem('mobile').split(','),
            names: localStorage.getItem('names').split(','),
            sexs: localStorage.getItem('sexs').split(','),
            workNums: localStorage.getItem('workNums').split(','),
            operations: localStorage.getItem('operationIndex').split(',')
        })
    }
    loadData(){
        var that = this;
        var files = this.refs['componenyInfo'].files;
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);  
        reader.onload = function(evt){
            var data = evt.target.result;        //读到的数据
            var file = files[0];
            var encoding = that.checkEncoding(data);
            Papa.parse(file, {
                    encoding: encoding,
                    complete: function(results) {        // UTF8 \r\n与\n混用时有可能会出问题
                        var res = results.data;
                        if( res[ res.length-1 ] == ""){    //去除最后的空行
                            res.pop();
                        }
                        that.saveData(res)
                    }
            });
        }
    }
    componentDidMount(){
        if(localStorage.getItem('mobile') != null && localStorage.getItem('operationIndex') != null) {
            this.setState({
                phones: localStorage.getItem('mobile').split(',') || [],
                names: localStorage.getItem('names').split(',') || [],
                sexs: localStorage.getItem('sexs').split(',') || [],
                workNums: localStorage.getItem('workNums').split(',') || [],
                operations: localStorage.getItem('operationIndex').split(',') || []
            })
        }
        
    }
    deleteData(){
        localStorage.removeItem('mobile');
        localStorage.removeItem('names');
        localStorage.removeItem('sexs');
        localStorage.removeItem('workNums');
        localStorage.removeItem('operationIndex');
        this.setState({
            phones: [],
            names: [],
            sexs: [],
            workNums: [],
            operations: []
        })
    }
    render(){
        let { phones,names,sexs,workNums,operations } = this.state;
       
        const phoneItems = phones.map((phone,index)=>{
            return <div className="phone-td" key={index}>{phone}</div>
        })
        const nameItems = names.map((name)=>{
            return <div className="name-td">{name}</div>
        })
        const sexItems = sexs.map((sex)=>{
            if(sex == null) {
                return <div className="sex-td">-</div>
            } else {
                return <div className="sex-td">{sex}</div>
            }
            
        })
        const workItems = workNums.map((workNum)=>{
            if(workNum == null) {
                return <div className="work-num-td">-</div>
            } else {
                return <div className="work-num-td">{workNum}</div>
            }
        })
        var self = this;
        const operation = operations.map((peration,index)=>{
            return (<div key={index} updateIndex={index} className="operation-td">
                    <span onClick={self.updateData}>修改</span><span>删除</span>
                   </div>)
        })
        return (
            <div>
                <div className="manageHead">
                    管理员端
                    <input type="file" ref="componenyInfo" className="input-file"></input>
                    <div className="manageBtn" onClick={this.loadData}>导入数据</div>
                    <div className="manageBtn" onClick={this.deleteData}>清除数据</div>
                </div>
                <div className="manage-table">
                    <div className="ma-table-th">
                        <div className="work-num-th">工号{workItems}</div>
                        <div className="name-th">姓名{nameItems}</div>
                        <div className="sex-th">性别{sexItems}</div>
                        <div className="phone-th">手机号码{phoneItems}</div>
                        <div className="operation-th">操作{operation}</div>
                    </div>
                </div>
                <div className="manage-bottom">
                    <NavLink exact to="/luckydraw"><div className="manageBtn">进入抽奖页面</div></NavLink>
                </div>
                
                {/* <input type="file" ref="componenyInfo" className="input-file"></input>
                <div className="btn" onClick={this.loadData}>导入数据</div>
                <div className="btn">查看参与抽奖人员名单</div>
                <div className="btn" onClick={this.deleteData}>清除数据</div>
                <NavLink exact to="/luckydraw"><div className="btn">进入抽奖页面</div></NavLink> */}
               
            </div>
        )
    }
}

export default Manage