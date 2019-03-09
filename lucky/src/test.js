const getYanzhengma = () => {
    var res = '';
    for(var i=0;i<4;i++){
        var random = parseInt(Math.random()*10);
        res += random;
    }
    return parseInt(res);
}
console.log(getYanzhengma());