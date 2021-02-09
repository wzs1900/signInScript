auto.waitFor();
console.setGlobalLogConfig({
    "file": "/sdcard/钉钉测试/log.txt"
});

toastLog("钉钉打卡将与1分钟后启动,如需停止本次启动,请长按音量上键");
// sleep(60*1000);


// 唤醒屏幕
device.keepScreenDim();
sleep(2000);
//上滑解锁
swipe(device.width / 2, device.height - 500, device.width / 2, 500,210);
sleep(2000);

console.show();
console.log("开  始  运  行");

let appName = "钉钉";
app.launchApp(appName);
sleep(2000);

//默认相同的文本在屏幕中出现多次, 点击第一个
let i = 0;

//调用自定义方法 untilFind 的toString 方法
untilFindToString("click","搜索",i)
// sleep(1000);

untilFindToString("textContainsExists","联系人",i)

sleep(1000);
setText("智能填表");
sleep(1000);

untilFindToString("click","智能填表",1)

untilFindToString("click","打开",i)

untilFindToString("click","填写",1)

untilFindToString("click","已完成",i)

untilFindToString("click","查看",i)

untilFindToString("click","今天",i)

untilFindToString("textContainsExists","目前健康状况",i)


for (let i = 0; i < 2; i++){
    // console.log(i);
    swipe(device.width/2, device.height - device.height/5 , device.width/2, device.height/5, 500);
}

// click("提交");
untilFind("提交",2000);
sleep(1500);

if (textContains("修改").exists()){
    console.info("检测到当前为测试环境\n测试成功");
}else if(textContains("你已成功提交").exists()){
    console.info("全部执行成功");
}else{
    close();
}

console.log("运  行  结  束");

//退出唤醒
device.cancelKeepingAwake();

//调用时终止程序
function close(){
    console.error("执行失败");
    sleep(2000);
    //退出唤醒
    device.cancelKeepingAwake();
    exit();
}

/**
 * 在 waitTime 时间内 每隔 sleepTime 时间调用单次函数 fun 一次 直至执行成功或 waitTime 时间截至
 * 返回函数 执行成功与否
 * @param {String} fun - 调用的函数名,赋值给 invokeFun 函数
 * @param {String} findText - 需寻找的 String 参数, 赋值给 invokeFun 函数
 * @param {int} i - 如果相同的文本在屏幕中出现多次, 则i表示第几个文本, i从0开始
 */
function untilFind(fun,findText,i){
    let whetherFind = false;
    let sleepTime = 1000;//每次间隔时间
    let time = 0;//循环次数
    let waitTime = 10*1000;//截至时间
    do{
        //通过调用 invokeFun 实现方法重载
        whetherFind = invokeFun(fun,findText,i);
        sleep(sleepTime);

        waitTime = waitTime - sleepTime;
        if (waitTime<=0){
            break;
        }

        //显示进度,检测是否卡死
        runningPoint(time,findText);
        time++;
    }while(!whetherFind);
    return whetherFind;
}

/**
 * 引用其他单次调用函数 实现方法重载 返回调用的函数是否执行成功
 * 暂只有 click(text) 和 textContains(text).exists();
 * @param {String} fun - 调用的函数名
 * @param {String} findText - 调用函数的参数
 * @param {int} i - 如果相同的文本在屏幕中出现多次, 则i表示第几个文本, i从0开始
 */
function invokeFun(fun,findText,i){
    returnBoolean = false;
    if("click"==fun){
        returnBoolean = click(findText,i);
    }else if ("textContainsExists"==fun) {
        returnBoolean = textContains(findText).exists();
    }else{
        console.error("invokeFun(fun,findText,i)引用错误");
        close();
    }
    return returnBoolean;
}

/**
 * 调用 untilFind(fun,findText,i) 的 toString 方法
 * 当 点击失败时 调用 close() 终止整个程序
 * @param {String} fun - 调用的函数名
 * @param {String} findText - 函数需寻找的 String 参数
 * @param {int} i - 如果相同的文本在屏幕中出现多次, 则i表示第几个文本, i从0开始
 */
function untilFindToString(fun,findText,i){
    let whetherFind = untilFind(fun,findText,i);
    let returnString;
    let funEvent = "查找\"";

    if(whetherFind){
        returnString = funEvent+findText+"\"成功";
    }else{
        returnString = funEvent+findText+"\"失败";
        close();
    }
    console.log(returnString);
    return returnString;
}

/**
 * 显示进度,检测是否卡死
 * .  ..  ...   ....  .....  ......
 * @param {int} time - 第 time 次调用
 * @param {String} findText - 函数参数 用于显示当前进度
 */
function runningPoint(time,findText){
    let pointString = ".";
    time = time%6;//最多6个点
    for(let i = 0; i<time; i++){
        pointString = pointString+" .";
    }
    console.log("查找\""+findText+"\"ing"+pointString);
}
