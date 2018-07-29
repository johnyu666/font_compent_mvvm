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

function CustomerComponent(view,url) {
    /*局部变量初始块*/
    let model=null;

    let tbody=view.find("tbody");
    let updateForm=view.find("#updateForm");
    let currentCustomer=null;
    initBindEvent=initBindEvent.bind(this);
    renderTable=renderTable.bind(this);

    /*局部函数*/
    function renderTable() {
        tbody.empty();
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
                .appendTo(tbody);
        });
    }

    function initBindEvent() {
        $("#addForm").on("submit",(e)=>{
            e.preventDefault();
            let data=form2json($(e.target));
            myAjax(url,"POST",data,(c)=>{
                this.addCustomer(c);
            })

        })
        $("#updateForm").on("submit",(e)=>{
            e.preventDefault();
            let data=form2json($(e.target));
            myAjax(url+currentCustomer.id,"PUT",data,(c)=>{
                this.updateCutomer(c);
            })
        })
    }


    this.init=function () {
        initBindEvent();
        myAjax(url,"GET",null, data=> {
            model=data;
            this.render();
        });
    }
    this.render=function () {
        renderTable();
    }


    this.selectCustomer=function (item) {
        currentCustomer=item;
        let cname=updateForm.children("[name=cname]").val(currentCustomer.cname);
    }
    this.updateCutomer=function (item) {
        myAjax(url+item.id,"PUT",item,customer=>{
            let index=model.indexOf(currentCustomer);
            model.splice(index,1,customer);
            this.render();
        });
    };
    this.delete=function (item) {
        myAjax(url+item.id,"DELETE",null,data=>{
            if(data.error){
                alert("删除失败");
                this.init();
            }
            else{
                let index=model.indexOf(item);
                model.splice(index,1);
                this.render();
            }
        });
    }
    this.addCustomer=function (customer) {
        model.push(customer);
        this.render();
    }
}

$(function () {
    let component=new CustomerComponent($("#app"),"http://localhost:3000/customers/");
     component.init();
});