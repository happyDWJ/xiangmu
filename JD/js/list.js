class list{
    constructor(){
        this.getData();
        this.dianji();
        //默认页码
        this.currentPage=1;
        //使用锁
        this.lock=false;
        
    }
    /****点击事件的方法*****/
    dianji(){
        this.$(".sk_bd ul").addEventListener("click",this.addCart.bind(this));
        //滚动条事件
        window.addEventListener("scroll",this.lazyLoader);
        
    }
    /****获取数据*****/
    getData(page=1){
        //发送ajax请求获取数据
        let goodsData=axios.get("http://localhost:8888/goods/list?current="+page);
        goodsData.then((res)=>{
            //判断请求的状态是否成功
            if(res.status!=200&&res.data.code!=1){
            throw new Error("数据获取失败");
            }
            //循环渲染数据，追加到页面中
            let html="";
            //拼接字符串
            res.data.list.forEach(goods=> {
                html+=`<li class="sk_goods" data-id="${goods.goods_id}">
                <a href="#none">
                    <img src="${goods.img_big_logo}" alt="">
                </a>
                <h5 class="sk_goods_title">${goods.title}</h5>
                <p class="sk_goods_price">
                    <em>¥${goods.current_price}</em>
                    <del>￥${goods.price}</del>
                </p>
                <div class="sk_goods_progress">
                    已售
                    <i>${goods.sale_type}</i>
                    <div class="bar">
                        <div class="bar_in"></div>
                    </div>
                    剩余
                    <em>29</em>件
                </div>
                <a href="#none" class="sk_goods_buy">立即抢购</a>
            </li>`
            });
            //将拼接好的字符串追加到页面中
            this.$(".sk_bd ul").innerHTML+=html;

            this.$('li>a>img').forEach(ele=>{
                 ele.addEventListener('click',this.imgClickFn.bind(this,ele))
        })
        })
        
    }

    //图片点击跳转详情页
    imgClickFn(el){
        let goodsID=el.parentNode.parentNode.dataset.id;
        localStorage.setItem('goodsId',goodsID);
        location.href='./detail.html';
    }
    //加入购物车
    addCart(eve){
        //获取事件源，判断点击的是否为a标签
        if(eve.target.nodeName!='A'||eve.target.className!="sk_goods_buy") return;
        //判断用户是否登录
        let token=localStorage.getItem("token");
        if(!token){
            location.assign("./login.html?ReturnUrl=./list.html")
        }
        //如果用户已经登录，此时就需要将商品加入购物车
        //获取商品id和用户id
        let goodsId=eve.target.parentNode.dataset.id;
        let userId=localStorage.getItem("user_id");
        this.addCartGoods(goodsId,userId);
    }
    addCartGoods(gId,uId){
        //给添加购物车接口发送请求
        //调用购物车接口，后台要验证是否为登录状态。需要传递token
        const AUTH_TOKEN=localStorage.getItem("token")
        axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        let param=`id=${uId}&goodsId=${gId}`
        axios.post("http://localhost:8888/cart/add",param).then(res=>{
            console.log(res);
            //判断添加购物车是否成功，成功则弹出提示框
            if(res.data.code==1&&res.status==200){
                layer.open({
                    title:"商品添加成功",
                    // content:"去购物车",
                    btn:["去购物车","返回当前页面"],
                    btn1:function(index,layer){
                        location.assign("./cart.html")
                    }
                })  //如果登录过期则需要重新登录
            }else if(res.data.code==401&&res.status==200){
                //清除local中存在的token和userid
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                //跳转到登录页面
                location.assign("./login.html?ReturnUrl=./list.html")
            }else if(res.data.code==0&&res.status==200){
                //清除local中存在的token和userid
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                //跳转到登录页面
                location.assign("./login.html?ReturnUrl=./list.html")
            }else{
                layer.open({
                    title:"添加失败",
                    time:3000
                })
            }
        })
    }
    lazyLoader=()=>{
        //需要滚动条的高度，可视区高度，实际内容高度
        let top=document.documentElement.scrollTop;
        let cliH=document.documentElement.clientHeight;
        let conH=this.$(".sk_container").offsetHeight;
        //当滚动条高度+可视区的高度>实际内容高度时，就加载新数据
        if(top+cliH>(conH+450)){
            //一瞬间就满足条件，会不停的触发数据加载，使用节流和防抖
            //如果是锁着的，就结束代码执行
            if(this.lock) return;
            this.lock=true;
            //指定时间开锁
            setTimeout(()=>{
                this.lock=false;
            },1000)
            this.getData(++this.currentPage);
        }
    }
    //封装获取节点的方法
    $(ele){
        let res1=document.querySelectorAll(ele);
        return res1.length==1?res1[0]:res1; 
    }
}
new list;