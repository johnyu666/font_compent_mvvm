
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

let comp={};
comp.render=function () {
    console.log("render");
}
let m=new Model(comp);
m.add(1);
m.add(2);
m.add(3);
m.add(4);

m.pushArray([4,5,9])
m.forEach((item)=>{
    console.log(item)
})
