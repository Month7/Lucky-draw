import React,{Component} from 'react';
import jschardet from 'jschardet';
import Papa from 'papaparse';
import {NavLink} from 'react-router-dom';
import './manage.css'
import Model from '../components/model'
import {LocalToArr,checkPhoneNum,checkName} from '../utils'


class Manage extends Component{
    constructor(){
        super();
        this.loadData = this.loadData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.updateData = this.updateData.bind(this);
        this.modelNameChange = this.modelNameChange.bind(this);
        this.modelSexChange = this.modelSexChange.bind(this);
        this.modelWorkNumChange = this.modelWorkNumChange.bind(this);
        this.modelPhoneChange = this.modelPhoneChange.bind(this);
        this.saveModelData = this.saveModelData.bind(this);
        this.cancelModel = this.cancelModel.bind(this);
        this.modelDelete = this.modelDelete.bind(this);
        this.Toggle = this.Toggle.bind(this);        // 停止后台录入
        this.state = {
            phones: [],
            names: [],
            sexs: [],
            workNums: [],
            operations: [],
            updateModelShowFlag: false,  //是否显示修改弹窗
            modelNameValue: '',    // 修改的姓名
            modelSexValue: '',     // 修改的性别
            modelWorkNumValue: '', // 修改的工号
            modelPhoneValue: '',    // 修改的手机号
            updateIndex: -1,          // 要修改的下标 
            typeInFlag: localStorage.getItem('typeInFlag')   
        }
    }
    // 控制是否允许注册
    Toggle(){
        var typeInFlag = localStorage.getItem('typeInFlag')
        if(typeInFlag == '1') {
            typeInFlag = 0
        } else if(typeInFlag == '0'){
            typeInFlag = 1
        } else if(typeInFlag == null) {
            
            typeInFlag = 1
        }
        localStorage.removeItem('typeInFlag');
        localStorage.setItem('typeInFlag',typeInFlag);
        this.setState({
            typeInFlag: localStorage.getItem('typeInFlag')   
        })
    }
    // 删除
    modelDelete(e){
        var index = e.target.parentNode.getAttribute('updateIndex');
        var phones = localStorage.getItem('mobile').split(',');
        var names = localStorage.getItem('names').split(',');
        var sexs = localStorage.getItem('sexs').split(',');
        var workNums = localStorage.getItem('workNums').split(',');
        var operationIndex = localStorage.getItem('operationIndex').split(',');
        phones.splice(index,1);
        names.splice(index,1);
        sexs.splice(index,1);
        workNums.splice(index,1);
        operationIndex.splice(index,1);
        localStorage.removeItem('mobile');
        localStorage.setItem('mobile',phones);
        localStorage.removeItem('names');
        localStorage.setItem('names',names);
        localStorage.removeItem('sexs');
        localStorage.setItem('sexs',sexs);
        localStorage.removeItem('workNums');
        localStorage.setItem('workNums',workNums);
        localStorage.removeItem('operationIndex');
        localStorage.setItem('operationIndex',operationIndex);
        this.setState({
            phones: LocalToArr(localStorage.getItem('mobile')),
            names: LocalToArr(localStorage.getItem('names')),
            sexs: LocalToArr(localStorage.getItem('sexs')),
            workNums: LocalToArr(localStorage.getItem('workNums')), 
            operations: LocalToArr(localStorage.getItem('operationIndex')),
        })
    }
    // 姓名修改
    modelNameChange(e){
        this.setState({
            modelNameValue: e.target.value
        })
    }
    // 性别修改
    modelSexChange(e){
        this.setState({
            modelSexValue: e.target.value
        })
    }
    // 工号修改
    modelWorkNumChange(e){
        this.setState({
            modelWorkNumValue: e.target.value
        })
    }
    // 手机号修改
    modelPhoneChange(e){
        this.setState({
            modelPhoneValue: e.target.value
        })
    }
    // 点击修改表格数据
    updateData(e){
        var index = e.target.parentNode.getAttribute('updateIndex');
        var defaultPhone = localStorage.getItem('mobile').split(',')[index];
        var defaultName = localStorage.getItem('names').split(',')[index];
        var defaultSex = localStorage.getItem('sexs').split(',')[index];
        var defaultWorkNum = localStorage.getItem('workNums').split(',')[index];        
        this.setState({
            updateModelShowFlag: true,
            updateIndex: index,
            modelNameValue: defaultName,    
            modelSexValue: defaultSex,     
            modelWorkNumValue: defaultWorkNum, 
            modelPhoneValue: defaultPhone,    
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
    // 保存csv数据
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
        var oldMobile = LocalToArr(localStorage.getItem('mobile')) || [];
        mobile = oldMobile.concat(mobile);
        var oldNames = LocalToArr(localStorage.getItem('names')) || [];
        names = oldNames.concat(names);
        var oldSexs = LocalToArr(localStorage.getItem('sexs')) || [];
        sexs = oldSexs.concat(sexs);
        var oldWorkNums = LocalToArr(localStorage.getItem('workNums')) || [];
        workNums = oldWorkNums.concat(workNums);
        var oldoperationIndex = LocalToArr(localStorage.getItem('operationIndex')) || [];
        operationIndex = oldoperationIndex.concat(operationIndex);
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
        if(!files[0]){
            alert('您尚未选择文件!');
            return false;
        }
        if(files[0].type != 'application/vnd.ms-excel'){
            alert('抱歉,目前只支持csv格式的文件上传');
            return false;
        }
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
                phones: LocalToArr(localStorage.getItem('mobile')),
                names: LocalToArr(localStorage.getItem('names')),
                sexs: LocalToArr(localStorage.getItem('sexs')),
                workNums: LocalToArr(localStorage.getItem('workNums')), 
                operations: LocalToArr(localStorage.getItem('operationIndex')),
                typeInFlag: localStorage.getItem('typeInFlag')
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
    saveModelData(){
        var phones = localStorage.getItem('mobile').split(',');
        var names = localStorage.getItem('names').split(',');
        var sexs = localStorage.getItem('sexs').split(',');
        var workNums = localStorage.getItem('workNums').split(',');
        var index = this.state.updateIndex;
        var {
            modelPhoneValue,
            modelNameValue,
            modelSexValue,
            modelWorkNumValue
        } = this.state;
        if(!checkName(modelNameValue)){
            alert('姓名中包含敏感词汇或为空!');
            return false;
        }
        if(!checkPhoneNum(modelPhoneValue)){
            alert('手机号码格式不正确!');
            return false;
        }
        phones[index] = modelPhoneValue
        names[index] = modelNameValue
        sexs[index] = modelSexValue
        workNums[index] = modelWorkNumValue
        localStorage.removeItem('mobile');
        localStorage.setItem('mobile',phones);
        localStorage.removeItem('names');
        localStorage.setItem('names',names);
        localStorage.removeItem('sexs');
        localStorage.setItem('sexs',sexs);
        localStorage.removeItem('workNums');
        localStorage.setItem('workNums',workNums);
        this.setState({
            phones: localStorage.getItem('mobile').split(','),
            names: localStorage.getItem('names').split(','),
            sexs: localStorage.getItem('sexs').split(','),
            workNums: localStorage.getItem('workNums').split(','),
            updateModelShowFlag: false
        })
    }
    cancelModel(){
        this.setState({
            updateModelShowFlag: false
        })
    }
    render(){
        let { phones,names,sexs,workNums,operations,updateModelShowFlag } = this.state;
        let {
            modelNameValue,   
            modelSexValue,    
            modelWorkNumValue, 
            modelPhoneValue,  
        } = this.state;
        let self = this;
        let updateModelContent = 
            <div>
                <div className="md-table-th">
                    <div className="md-work-num-th">工号</div>
                    <div className="md-name-th">姓名</div>
                    <div className="md-sex-th">性别</div>
                    <div className="md-phone-th">手机号码</div>
                </div>
                <div className="md-table-td">
                    <div className="md-work-num-th">
                        <input type="text" onChange={self.modelWorkNumChange} className="md-input" defaultValue={modelWorkNumValue}/>
                    </div>
                    <div className="md-name-th">
                        <input type="text" onChange={self.modelNameChange} className="md-input" defaultValue={modelNameValue}/>
                    </div>
                    <div className="md-sex-th">
                        <input type="text" onChange={self.modelSexChange} className="md-input" defaultValue={modelSexValue}/>
                    </div>
                    <div className="md-phone-th">
                        <input type="text" onChange={self.modelPhoneChange} accept=".csv"  className="md-input" defaultValue={modelPhoneValue}/>
                    </div>
                </div>
                <div className="md-btns">
                    <div className="md-ensure-btn" onClick={self.saveModelData}>确定</div>
                    <div className="md-cancel-btn" onClick={self.cancelModel}>取消</div>
                </div>
            </div>
        ; 
        const phoneItems = phones.map((phone,index)=>{
            return <div className="phone-td" key={index}>{phone}</div>
        })
        const nameItems = names.map((name)=>{
            return <div className="name-td">{name}</div>
        })
        const sexItems = sexs.map((sex)=>{
            if(sex == -1) {
                return <div className="sex-td">-</div>
            } else {
                return <div className="sex-td">{sex}</div>
            }
            
        })
        const workItems = workNums.map((workNum)=>{
            if(workNum == -1) {
                return <div className="work-num-td">-</div>
            } else {
                return <div className="work-num-td">{workNum}</div>
            }
        })
     
        const operation = operations.map((peration,index)=>{
            // if(index == ''){
            //     return (
            //         <div></div>
            //     )
            // }
            return (<div key={index} updateIndex={index} className="operation-td">
                    
                    <span onClick={self.updateData}>修改</span><span onClick={self.modelDelete}>删除</span>
                   </div>)
        })
        let typeInBtnTxt = this.state.typeInFlag == '0'?'停止录入':'开始录入'
        return (
            <div>
                <Model showFlag={updateModelShowFlag} content={updateModelContent}/>
                <div className="manageHead">
                    管理员端
                    <div className="manageHead-right">
                        <input type="file" ref="componenyInfo" className="input-file" accept=".csv" onChange={this.loadData}></input>
                        {/* <div className="manageBtn" onClick={this.loadData}>导入数据</div> */}
                        <div className="manageBtn" onClick={this.deleteData}>清除数据</div>
                    </div>
                    
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
                    <div className="manageBtn" onClick={this.Toggle}>{typeInBtnTxt}</div>
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