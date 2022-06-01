class index{
    constructor(){

        //京东秒杀倒计时
        this.getTime();
    }

    //京东秒杀的计时器
    getTime(){
        setInterval(()=>{
            this.setTime();
        },1000)
    }

    //设置事件
    setTime(){
        let nowTime = new Date();
        let nowHours = nowTime.getHours()%2==1? nowTime.getHours()-1: nowTime.getHours();
        let msNow = +nowTime
        this.$('.countdown strong b').innerHTML=nowHours;
        let setTime = new Date();
        setTime.setHours(nowHours+2);
        setTime.setMinutes(0)
        setTime.setSeconds(0);
        //获取设置时间后的毫秒数
        let msSet=+setTime;
        //获取当前时间距离目标时间的差值  单位 ms
        let diffTime = msSet-msNow;
        let hours = (parseInt(diffTime/60*60*1000)==1?1:0);
        let minute = (parseInt((diffTime/1000)%(60*60)/60));
        let second = (parseInt((diffTime/1000)%60));
        if(minute<10){
            minute='0'+minute;
        }
        if(second<10){
            second='0'+second;
        }

        this.$('.countdown .hour').innerHTML ='0'+ hours;
        this.$('.countdown .minute').innerHTML = minute;
        this.$('.countdown .second').innerHTML = second;
    }

    $(tag){
        let a = document.querySelectorAll(tag);
        return a.length==1?a[0]:a;
    }

}

new index;