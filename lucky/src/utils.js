import fetchJsonp from 'fetch-jsonp';
/**
 * @description 获取随机数
 * @param {人数最大值} max 
 * @param {最小值} min 
 */
export const getRandom = (max,min) => {
    var randnum = parseInt(Math.random()*(max-min+1));
    return randnum;
}
/**
 * @description 根据随机数获取手机号码
 * @param {手机号码数组} mobile 
 */
export const getRandomPhone = (mobile) => {
    var length = mobile.length - 1;
    if(length <-1){
        return false;
    }
    var luckyNum = getRandom(length,0);
    var luckyPhone = mobile[luckyNum];
    return luckyPhone;
}
/**
 * @description 获得4位随机验证码
 */
export const getVerificationCode = () => {
    var res = '';
    for(var i=0;i<4;i++){
        var random = parseInt(Math.random()*10);
        res += random;
    }
    return parseInt(res);
}
/**
 * @description 调SMS短信通那边的接口,前端直接调有个跨域问题,这里用了jsonp去搞 
 * 然后fetch本身是不支持jsonp的,就用了一个fetch-jsonp库,然后SMS的接口那边也不支持
 * jsonp,所以这里会走error的回调,但是没关系,验证码还是可以发到的,不过建议把这个接口放到
 * 后端去调
 * @author dev.zhengyin@gmail.com
 */
export const $http = (url) => {
    fetchJsonp(url).then(function (response) {
        console.log("成功!");
        return response.json()
    }).then(function(json){
        console.log('成功的回调');
    }).catch(function(err){
        console.log('失败'+err);
    })
}
/**
 * 判断编码类型
 * @param {*} base64Str 
 * @param {*} jschardet 
 */
export const checkEncoding = (base64Str,jschardet) => {
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
/**
 * @description 验证手机号码格式是否正确
 * @param {手机号} phoneNum 
 */
export const checkPhoneNum = (phoneNum) => {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if(!reg.test(phoneNum)){
        return false;
    }
    return true;
}
/**
 * @description 验证名字不为空且不包含敏感词汇
 * @param {要验证的姓名} name 
 */
export const checkName = (name) => {
    if(name == undefined || name == '' || name == null || name == '小熊维尼') {
        return false;
    }
    return true;
}
/**
 * @description 验证验证码格式正确
 * @param {*} code 
 */
export const checkCode = (code) => {
    if(!code){
        return false;
    }
    if(code.length!=4){
        return false;
    }
    return true;
}
/**
 * 对存在localStronge上的数据进行格式化处理
 * @param {} data 
 */
export const LocalToArr = (data) => {
    if(data == null || data == undefined){
        return undefined;
    }
    if(data == ''){
        return [];
    }
    data = data.split(',');
    for(var i=0;i<data.length;i++){
        if(data[i] == ''){
            data.splice(i,1);
        }
    }
    return data;
}