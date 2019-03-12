import React,{Component} from 'react';
import './luckyDraw.css';
import {getRandomPhone} from '../utils.js'

class LuckDraw extends Component{
    constructor(){
        super();
        this.state = {
            luckyNumber: '00000000000',
            beginFlag: true,
            endFlag: false,
            makeSureFlag: false,
            cancelFlag: false,
            award: '1'
        }
        this.begin = this.begin.bind(this);
        this.stop = this.stop.bind(this);
        this.makeSure = this.makeSure.bind(this);
        this.awardChange = this.awardChange.bind(this);
        this.cancel = this.cancel.bind(this);
        this.timer = null;
        this.mobile = localStorage.getItem('mobile').split(',');
        this.luckyNumbers = [];
        this.luckyNames = [];
        this.awards = [];
    }
    begin(){
        if(this.state.beginFlag == true) {
            var self = this;
            var mobile = localStorage.getItem('mobile').split(',');
            this.setState({
                beginFlag: false,
                endFlag: true
            })
            this.timer = setInterval(()=>{
                self.setState({
                    luckyNumber: getRandomPhone(mobile)
                })
            },100)
            
        } else {
            return false;
        }
    }
    stop(){
        if(this.state.endFlag == true) {
            clearInterval(this.timer);
            this.setState({
                makeSureFlag: true,
                cancelFlag: true
            })
        } else {
            return false;
        }
    }
    makeSure(){
        var mobile = localStorage.getItem('mobile').split(',');
        var index = mobile.indexOf(this.state.luckyNumber);
        var names = localStorage.getItem('names').split(',');
        var sexs = localStorage.getItem('sexs').split(',');
        var workNums = localStorage.getItem('workNums').split(',');
        this.luckyNames.push(names[index]);
        this.luckyNumbers.push(this.state.luckyNumber);
        var operationIndex = localStorage.getItem('operationIndex').split(',');
        operationIndex.splice(index,1);
        this.awards.push(this.state.award);
        mobile.splice(index,1);
        names.splice(index,1);
        sexs.splice(index,1);
        workNums.splice(index,1);
        localStorage.removeItem('operationIndex');
        localStorage.setItem('operationIndex',operationIndex);
        localStorage.removeItem('mobile');
        localStorage.setItem('mobile',mobile);
        localStorage.removeItem('names');
        localStorage.setItem('names',names);
        localStorage.removeItem('sexs');
        localStorage.setItem('sexs',sexs);
        localStorage.removeItem('workNums');
        localStorage.setItem('workNums',workNums);
        this.setState({
            beginFlag: true,
            endFlag: false,
            makeSureFlag: false,
            cancelFlag: false
        });
    }
    cancel(){
        this.setState({
            beginFlag: true,
            endFlag: false,
            makeSureFlag: false,
            cancelFlag: false
        })
    }
    awardChange(e){
        this.setState({
            award: e.target.value
        })
    }
    render(){
        let {beginFlag,endFlag,makeSureFlag,cancelFlag} = this.state; 
        const listItems = this.luckyNumbers.map((phone)=>{
            return <div className="luckyPhoneNumber">{phone}</div>
        })
        const nameItems = this.luckyNames.map((name)=>{
            return <div className="luckyName">{name}</div>
        })
        const awardItems = this.awards.map((award)=>{
            switch(award){
                case '1':
                    return <div className="award">一等奖</div>;
                case '2':
                    return <div className="award">二等奖</div>;
                case '3':
                    return <div className="award">三等奖</div>
                default: return <div>出错了 {award}</div>
            }
        }
            
        )
        return(
            <div className="luckydraw">
                <div className="drawcontainer">
                    <div className="prize">
                        假装有奖品
                    </div>
                    <div className="drawarea">
                        <select value={this.state.award} onChange={this.awardChange} className="award-select">
                            <option value='1'>一等奖</option>
                            <option value='2'>二等奖</option>
                            <option value='3'>三等奖</option>
                        </select>
                        <span className="luckyDrawScroll">{this.state.luckyNumber}</span>
                        {/* <input type="text" className="managePassword" value={this.state.luckyNumber} readOnly></input> */}
                        <span className={beginFlag == true?'whiteBtn':'disabledBtn'} onClick={this.begin}>开始抽奖</span>
                        <span className={endFlag == true?'whiteBtn':'disabledBtn'} onClick={this.stop}>停止抽奖</span>
                        <span className={makeSureFlag == true?'whiteBtn':'disabledBtn' } onClick={this.makeSure}>有效</span>
                        <span className={cancelFlag == true?'whiteBtn':'disabledBtn'} onClick={this.cancel}>无效</span>
                    </div>
                </div>
                <div className="people">
                    <div className="luckyNames">
                        <div className="">姓名</div>
                        {nameItems}
                    </div>
                    <div className="luckyPhoneNumbers">
                        <div className="">手机号码</div>
                        {listItems}
                    </div>
                    <div className="awards">
                        <div>奖项</div>
                        {awardItems}
                    </div>
                       
                </div>
            </div>  
        )
    }
}

export default LuckDraw;