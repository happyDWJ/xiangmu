class Detail {
    constructor() {
        this.token = localStorage.getItem('token');
        this.id = localStorage.getItem('user_id');
        this.goodsId = localStorage.getItem('goodsId');

        this.isLogo();

        //判断是否登录
        //根据商品id获取商品的信息
        this.getGoods();

        //事件的绑定
        this.setEve();
    }

    //设置事件
    setEve() {
        // 鼠标移入
        this.$('.preview_img').addEventListener('mouseover', this.mouseOverFn);
        this.$('.preview_img').addEventListener('mouseout', this.mouseOutFn);
        this.$('.preview_img').addEventListener('mousemove', this.mouseMoveFn);
        //加入购物车按钮绑定事件
        this.$('.choose_btns>.addCar').addEventListener('click', this.addCartFn);
    }

    //获取商品信息
    getGoods() {
        axios.get('http://localhost:8888/goods/item?id=' + this.goodsId).then(res => {
            let { status, data } = res;
            if (status = 200 && data.code == 1) {
                //渲染上去
                this.$('.preview_img>img').src = data.info.img_big_logo;
                this.$('.preview_img+.big>img').src = data.info.img_big_logo;
                this.$('.itemInfo_wrap>.sku_name').innerHTML = data.info.title;
                this.$('.itemInfo_wrap dd>i').innerHTML = data.info.current_price;
            }
        })
    }

    //加入购物车
    addCartFn = () => {
        let data = `id=${this.id}&goodsId=${this.goodsId}`
        if (this.isTure == 1) {
            const AUTH_TOKEN=localStorage.getItem("token")
            axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post('http://localhost:8888/cart/add?', data).then(res => {
                let { status, data } = res;
                if (status == 200 && data.code == 1) {
                    alert('加入购物车成功，点击确定跳转到购物车页面');
                    location.href = './cart.html';
                }
            })
        } else {
            alert('点击确定跳转登录页面');
            location.href = './login.html?ReturnUrl=./detail.html';
        }
    }

    //鼠标移入---遮罩显示、大图显示
    mouseOverFn = eve => {
        this.$('.preview_img .mask').style.display = 'block';
        this.$('.preview_wrap .big').style.display = 'block';
    }

    //移出事件
    mouseOutFn = eve => {
        this.$('.preview_img .mask').style.display = 'none';
        this.$('.preview_wrap .big').style.display = 'none';
    }

    //移动事件
    mouseMoveFn = eve => {
        //获取鼠标的坐标
        // let mouseX =eve.clientX
        let mouseX = eve.pageX;
        let mouseY = eve.pageY;
        //获取图片盒子距离页面的距离
        let getSmallL = this.$('.de_container>.w').offsetLeft;
        let getSmallT = this.$('.de_container>.w').offsetTop;
        // 获取遮罩的宽高
        let maskW = this.$('.mask').offsetWidth;
        let maskH = this.$('.mask').offsetHeight;
        //获取遮罩的坐标，为让鼠标在遮罩的中间   /2
        let maskX = mouseX - getSmallL - maskW / 2;
        let maskY = mouseY - getSmallT - maskH / 2;
        //设置遮罩最大的移动距离
        let maskMaxX = this.$('.preview_img').offsetWidth - maskW;
        let maskMaxY = this.$('.preview_img').offsetHeight - maskH;
        //获取大盒子内图片的最大移动距离
        let bigMaxX = this.$('.product_intro .big').offsetWidth - this.$('.fl>.big>img').offsetWidth;
        let bigMaxY = this.$('.product_intro .big').offsetHeight - this.$('.fl>.big>img').offsetHeight;

        //判断
        if (maskX < 0) {
            maskX = 0
        } else if (maskX >= maskMaxX) {
            maskX = maskMaxX
        }

        if (maskY < 0) {
            maskY = 0
        } else if (maskY >= maskMaxY) {
            maskY = maskMaxY
        }
        this.$('.mask').style.left = maskX + 'px';
        this.$('.mask').style.top = maskY + 'px';

        //让大图动起来
        this.$('.fl>.big>img').style.left = maskX / maskMaxX * bigMaxX + 'px';
        this.$('.fl>.big>img').style.top = maskY / maskMaxY * bigMaxY + 'px';
    }


    //判断是否登录的方法
    isLogo() {
        if (!this.token && !this.id) {
            this.isTure=0;
        } else {
            this.isTure=1;
        }
    }




    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res
    }

}

new Detail;