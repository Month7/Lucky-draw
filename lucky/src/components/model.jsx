import React,{Component} from 'react';
import './model.css'

class Model extends Component{
    constructor(props){
        super(props);
        this.state = {
            showFlag: this.props.showFlag,
            content: this.props.content
        }
        console.log(this.props);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            showFlag: nextProps.showFlag,
            content: nextProps.content
        })
    }
    render(){
        let {showFlag,content} = this.state
        if(showFlag == false){
            return <div></div>
        } 
        return (
            <div className="model">
                {content}
                {/* <div className="">
                    <div className="">确认</div>
                    <div className="">取消</div>
                </div> */}
            </div>
        )
    }
}

export default Model;