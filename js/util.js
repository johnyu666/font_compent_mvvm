(function (global) {
    let john={};
    john.ajax=function (type,url,data,headers,callback) {
        let xhr=new XMLHttpRequest();
        xhr.open(type,url,true);
        headers.forEach((header)=>{
            xhr.setRequestHeader(header.key,header.value);
        });
        xhr.onreadystatechange=function () {
            if(xhr.readyState==4&&Math.floor(xhr.status/100)==2){
                callback(xhr.responseText);
            }
        }
        xhr.send(JSON.stringify(data));
    }
    global.$=john;
})(window);