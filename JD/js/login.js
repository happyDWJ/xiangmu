class login{
    constructor(){
        this.$(".over").addEventListener("click",this.DL.bind(this))
        //判断当前是否有回跳页面
        let search=location.search;
        if(search){
            this.url=search.split("=")[1];
        }
    }
    //实现登录
    DL(){
        //收集表单中的数据
        let form=document.forms[0].elements;
        let username=form.uname.value.trim();
        let password=form.password.value.trim();
        //非空验证
        if(!username||!password){
            throw new Error("用户名或密码不能为空")
        }
        //发送ajax请求，实现登录
        //axios默认以json的形式请求和编码参数
        let param=`username=${username}&password=${password}`;
        axios.post("http://localhost:8888/users/login",param,{
            headers:{   //设置axios参数以application/x-www-form-urlencoded` 格式传递
                "Content-Type":"application/x-www-form-urlencoded"   
            }
        }).then(res=>{
            //判断登录状态，将用户信息进行保存
            if(res.status==200&&res.data.code==1){
                //将token和user保存到local
                localStorage.setItem("token",res.data.token);
                localStorage.setItem("user_id",res.data.user.id);
                if(this.url){
                    location.href=this.url;
                }else{
                    location.href="./index.html";
                }
            }
        })
    }
    //封装获取节点的方法
    $(ele){
        let res1=document.querySelectorAll(ele);
        return res1.length==1?res1[0]:res1; 
    }
}
new login;