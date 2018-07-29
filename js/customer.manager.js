
function myAjax(url,method,data,callback){
    let contentType="application/json";
    let options={url:url,type:method,contentType:contentType};
    if(data!=null) options.data=JSON.stringify(data);
    $.ajax(options)
        .done(function (obj) {
            callback(obj);
        })
}

function form2json(form) {
    let obj={};
    $.each(form.children("[type!=submit]"),(index,item)=>{
        let $item=$(item);
        obj[[$item.attr("name")]]=$item.val();

    })
    return obj;
}



function Model(comp) {
    Array.call(this);
    if(typeof this.add!='function'){
        Model.prototype.add=function (c) {
            this.push(c)
            comp.render();
        }
    }
    if(typeof this.urd!='function'){
        Model.prototype.urd=function () {
            [].splice.apply(this,arguments);
            comp.render();
        }
    }
    if(typeof this.pushArray!='function'){
        Model.prototype.pushArray=function () {
            [].push.apply(this,arguments[0]);
            comp.render();
        }
    }
}
Model.prototype=new Array();



function AppComponent($view,url) {
    let model=new Model(this);
    let updateComp=null;
    (function () {
        new AddFormComponet($view.find("#addForm"),model,url);
        updateComp=new UpdateFormComponet($view.find("#updateForm"),model,url);
        myAjax(url,"GET",null, data=> {
            model.pushArray(data);
        });
    })();

    this.render=function () {
        let $tbody=$view.find("tbody");
        $tbody.empty();
        model.forEach((item,index)=>{
            $("<tr>")
                .append($("<td>").text(item.id))
                .append($("<td>").text(item.cname))
                .append($("<button>").text("删除").on("click",(e)=>{
                    this.delete(item);
                }))
                .on("dblclick",(e)=>{
                    this.selectCustomer(item);
                })
                .appendTo($tbody);
        });
    }

    this.delete=function (item) {
        myAjax(url+item.id,"DELETE",null,data=>{
            if(data.error){
                alert("删除失败");
                this.render();
            }
            else{
                let index=model.indexOf(item);
                model.urd(index,1);
            }
        });
    }


    this.selectCustomer=function (item) {
        updateComp.render(item);
    }
}


function AddFormComponet($view,model,url) {
    $view.on("submit",(e)=>{
        e.preventDefault();
        let data=form2json($(e.target));
        myAjax(url,"POST",data,(c)=>{
            model.add(c);
        })
    })
}

function UpdateFormComponet($view,model,url) {
    let cur=null;
    //为更新表单添加提交事件处理
    $view.on("submit",(e)=>{
        e.preventDefault();

        let data=form2json($(e.target));
        myAjax(url+cur.id,"PUT",data,(c)=>{
            let index=model.indexOf(cur);
            console.log(index)
            model.urd(index,1,c);
        })
    })

    this.render=function (item) {
        cur=item;
        $view.find("[name=cname]").val(item.cname);
    }
}



$(function () {
    let app=new AppComponent($("#app"),"http://localhost:3000/customers/");
});








