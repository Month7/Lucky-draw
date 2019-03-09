import React,{Component} from 'react';
import jschardet from 'jschardet';
import Papa from 'papaparse';
import {NavLink} from 'react-router-dom';


class Manage extends Component{
    constructor(){
        super();
        this.loadData = this.loadData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.state = {
            
        }
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
        for(var i=1;i<data.length;i++){
            var temp = data[i];
            var name = temp[1];
            var phoneNum = temp[3];
            console.log(phoneNum);
            // phoneNum = parseInt(10,phoneNum);
            mobile.push(phoneNum);
            names.push(name);
        }
        localStorage.setItem('mobile',mobile);
        localStorage.setItem('names',names);
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
                        console.log(res);
                        that.saveData(res)
                    }
            });
        }
    }
    deleteData(){
        localStorage.removeItem('mobile');
        localStorage.removeItem('names');
    }
    render(){
        return (
            <div>
                <span className="entranceTxt">
                    管理员端
                </span>
                <input type="file" ref="componenyInfo"></input>
                <div className="btn" onClick={this.loadData}>导入数据</div>
                <div className="btn">查看参与抽奖人员名单</div>
                <div className="btn" onClick={this.deleteData}>清除数据</div>
                <NavLink exact to="/luckydraw"><div className="btn">进入抽奖页面</div></NavLink>
               
            </div>
        )
    }
}

export default Manage