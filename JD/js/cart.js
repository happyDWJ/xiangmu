class Cart {
    constructor() {
        this.getgoods();
        //给.cart-list 绑定点击事件，实现委托
        this.$(".cart-list").addEventListener("click",this.dispatch);
        //给全选按钮绑定点击事件
        this.$(".cart-th input").addEventListener("click",this.checkall.bind(this));
    }
    /****事件委托的分发*****/
    dispatch=(eve)=>{
        //获取事件源
        let target=eve.target;
        if(target.nodeName=="A"&&target.classList.contains("del1")){
            this.delGoodsData(target);
        }
        if(target.nodeName=="A"&&target.classList.contains("plus")){
            this.plusGoodsNum(target);
        }
        if(target.nodeName=="A"&&target.classList.contains("mins")){
            this.minsGoodsNum(target);
        }
    }
    //数量减少的方法
    minsGoodsNum(tar){
        let ul=tar.parentNode.parentNode.parentNode;
        //获取数量，单价，小计
        let num=ul.querySelector(".itxt");
        let numVal=num.value;
        let sum=ul.querySelector(".sum");
        let price=ul.querySelector(".price").innerHTML-0;
        numVal--;
        //更新input中的数量
        //给服务器发送请求，增加数量
        const AUTH_TOKEN=localStorage.getItem("token")
        axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let uId=localStorage.getItem("user_id");
        let gId=ul.dataset.id;
        let param=`id=${uId}&goodsId=${gId}&number=${numVal}`;
        axios.post("http://localhost:8888/cart/number",param).then(res=>{
            let {status,data}=res;
            if(status==200&&data.code==1){
                //将更新之后的数量设置回去
                num.value=numVal;
                sum.innerHTML=parseInt(numVal*price*100)/100;
                //调用统计数量和价格的方法
                this.countSumPrice();
            }
        })
    }
    //数量增加的方法
    plusGoodsNum=(tar)=>{
        let ul=tar.parentNode.parentNode.parentNode;
        //获取数量，单价，小计
        let num=ul.querySelector(".itxt");
        let numVal=num.value;
        let sum=ul.querySelector(".sum");
        let price=ul.querySelector(".price").innerHTML-0;
        numVal++;
        //更新input中的数量
        //给服务器发送请求，增加数量
        const AUTH_TOKEN=localStorage.getItem("token")
        axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let uId=localStorage.getItem("user_id");
        let gId=ul.dataset.id;
        let param=`id=${uId}&goodsId=${gId}&number=${numVal}`;
        axios.post("http://localhost:8888/cart/number",param).then(res=>{
            let {status,data}=res;
            if(status==200&&data.code==1){
                //将更新之后的数量设置回去
                num.value=numVal;
                sum.innerHTML=parseInt(numVal*price*100)/100;
                //调用统计数量和价格的方法
                this.countSumPrice();
            }
        })
    }
    //全选实现
    checkall(eve){
        let allstatus=eve.target.checked;
        this.onecheckgoods(allstatus);
        this.countSumPrice();
    }
    //让单个商品跟随全选的状态
    onecheckgoods(status){
        this.$(".good-checkbox").forEach(input=>{
            input.checked=status;
        })
    }
    //单选实现
    onegoodscheckbox(){
        //给每一个单选按钮绑定点击事件
        this.$(".good-checkbox").forEach(input=>{
            let self=this;
            input.onclick=function(){
                //判断当前的点击状态
                 //点击取消时，则此时取消反选
                if(!this.checked){
                    self.$(".cart-th input").checked=false;
                }
                  //点击选中时，则判断页面中其他按钮的状态，如果都选中，则全选选中
                if(this.checked){
                    let status=self.getstatus();
                    self.$(".cart-th input").checked=status;
                }
                self.countSumPrice();
            }
        })
    }
    //获取单选按钮的选中状态
    getstatus(){
        //寻找是否有没被选中的按钮，如果页面都选中res为undefined
        let res=Array.from(this.$(".good-checkbox")).find(input=>{
            return !input.checked;
        })
        //页面中都被选中，则返回true
        return !res;
    }
    //统计数量和价格
    countSumPrice(){
        let sum=0;
        let num=0;
        //只统计选中商品的
        this.$(".good-checkbox").forEach(input=>{
            if(input.checked){
                let ul=input.parentNode.parentNode;
                //获取数量和小计
                let tmpNum=ul.querySelector(".itxt").value-0;
                let tmpSum=ul.querySelector(".sum").innerHTML-0;
                num+=tmpNum;
                sum+=tmpSum;
            }
        })
        sum=parseInt(sum*100)/100;
        //将数量和价格放到页面中
        this.$(".sumprice-top strong").innerHTML=num;
        this.$(".summoney span").innerHTML=sum;
    }
    /****删除商品信息*****/
    delGoodsData(tar){
        //弹出框，询问是否删除
        layer.confirm("是否删除该商品",{
            title:"删除提示框"},
            function(){
                //给后台发送数据，删除商品
                  //删除购物车中的信息，需要用用户id 商品id
                let ul=tar.parentNode.parentNode.parentNode;
                let gId=ul.dataset.id;
                let uId=localStorage.getItem("user_id");
                const AUTH_TOKEN=localStorage.getItem("token")
                axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
                axios.get("http://localhost:8888/cart/remove",{
                    params:{
                        id:uId,
                        goodsId:gId
                    }
                }).then(res=>{
                    if(res.data.code==1&&res.status==200){
                        //无刷新删除
                        //关闭弹出框，且删除对应的ul
                        layer.closeAll();
                        ul.remove();
                    }
                })
            }
        ) 
    }
    /*****取出商品信息******/
    async getgoods() {
        //必须携带token,后台需要验证
        const AUTH_TOKEN = localStorage.getItem("token")
        axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        let { data, status } = await axios.get("http://localhost:8888/cart/list", {
            params: {
                id: localStorage.getItem("user_id")
            }
        })
        //判断ajax的请求状态
        if (data.code == 1 && status == 200) {
            //遍历拼接商品数据并追加到页面中
            let html = "";
            data.cart.forEach(goods => {
                html += `<ul class="goods-list yui3-g" data-id="${goods.goods_id}">
                <li class="yui3-u-3-8 pr">
                    <input type="checkbox" class="good-checkbox">
                    <div class="good-item">
                        <div class="item-img">
                            <img src="${goods.img_small_logo}">
                        </div>
                        <div class="item-msg">${goods.title}</div>
                    </div>
                </li>
                <li class="yui3-u-1-8">
                </li>
                <li class="yui3-u-1-8">
                    <span class="price">${goods.current_price}</span>
                </li>
                <li class="yui3-u-1-8">
                    <div class="clearfix">
                        <a href="javascript:;" class="increment mins">-</a>
                        <input autocomplete="off" type="text" value="${goods.cart_number}" minnum="1" class="itxt">
                        <a href="javascript:;" class="increment plus">+</a>
                    </div>
                    <div class="youhuo">有货</div>
                </li>
                <li class="yui3-u-1-8">
                    <span class="sum">${goods.current_price * goods.cart_number}</span>
                </li>
                <li class="yui3-u-1-8">
                    <div class="del1">
                        <a href="javascript:;" class="del1">删除</a>
                    </div>
                    <div>移到我的关注</div>
                </li>
            </ul>`
            });
            this.$(".cart-list").innerHTML+=html;
            //单个商品的追加是异步实现的，所以单选按钮绑定事件要放在渲染完成之后
            this.onegoodscheckbox();
        }else if(data.code==401&&status==200){
            //清除local中存在的token和userid
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            //跳转到登录页面
            location.assign("./login.html?ReturnUrl=./cart.html")
        }
    }
    $(ele) {
        let res1 = document.querySelectorAll(ele);
        return res1.length == 1 ? res1[0] : res1;
    }
}
new Cart;