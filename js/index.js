$(function () {
    let arr = [];
    var flag = false;

    $("button").click(function () {
        if (flag) {
            return alert("请完成其他操作");
        }
        if ($('#uname').val() == '' || $('#fen').val() == '' || $('#money').val() == '') {
            alert("请将信息补充完整");
        } else {
            let info = {
                uname: $('#uname').val(),
                fen: $('#fen').val(),
                money: $('#money').val(),
            };
            arr.unshift(info);
            $('#uname').val('');
            $('#fen').val('');
            $('#money').val('');
            infoNew()
        }

    })
    window.addEventListener("click", function (e) {
        if (e.keyCode == 13) {
            $("button").click();
        }
    })

    if (localStorage.getItem("infomation")) {
        arr = JSON.parse(localStorage.getItem("infomation"))
        console.log(arr);
        loadView();
        Chart();
        Chart1();
    }

    //删除操作
    $("tbody ").on("click", "span", function () {
        if (flag) {
            return alert("请完成其他操作");
        }
        let index = $(this).parents("tr").attr("id"); //获取点击的对应数据索引号
        console.log(index);
        arr.splice(index, 1); //删除对应数据
        saveData(); //保存数据到本地
        loadView(); //渲染到页面
        Chart(); //柱状图
        Chart1(); //折线图
    })

    $("tbody").on("click", "s", function () {
        if (flag) return alert("请先完成其他操作");
        // let id = $(this).siblings('a').attr("id");
        let id = $(this).parents('tr').attr("id");
        let xulie = {};
        if (id >= 1) {
            console.log(arr[id]);
            xulie = arr[id - 1];
            arr[id - 1] = arr[id];
            arr[id] = xulie;
            infoNew();
        }
        console.log(arr);
    })
    //向下移动
    $("tbody").on("click", "b", function () {
        if (flag) return alert("请先完成其他操作");
        // let id = parseFloat($(this).siblings('a').attr("id"));
        let id = $(this).parents('tr').attr("id") - 0;
        let xulie = {};
        if (id < arr.length - 1) {
            xulie = arr[id + 1];
            arr[id + 1] = arr[id];
            arr[id] = xulie;
            infoNew();
        }
    })

    //修改操作
    $("tbody ").on("click", "i", function () {
        if (flag) return alert("请先完成其他操作");
        flag = true;
        let index = $(this).parents("tr").attr("id"); //获取点击的对应数据索引号
        let tr = `<tr class="edit"><td><input class="one" type="text"></td><td><input class="two" type="text"></td><td><input class="three" type="text"></td><td ><i class="yes"></i><span class="no"></span></td></tr>`;
        $(this).parents('tr').html(tr);
        $(".yes").click(function (e) {
            flag = false;
            e.stopPropagation();
            if ($('.one').val() == '' || $('.two').val() == '' || $('.three').val() == '') {
                alert("请补全信息");
            } else {
                arr[index].uname = $('.one').val();
                arr[index].fen = $('.two').val();
                arr[index].money = $('.three').val();
                infoNew()
            }
        })
        $(".no").click(function (e) {
            flag = false;
            e.stopPropagation();
            infoNew();
        })
    })

    function infoNew() {
        saveData(); //保存数据到本地
        loadView(); //渲染到页面
        Chart(); //柱状图
        Chart1(); //折线图
    }


    //保存到本地
    function saveData() {
        localStorage.setItem("infomation", JSON.stringify(arr));
    }
    //渲染到页面
    function loadView() {
        $("tbody").empty();
        $.each(arr, function (index, ele) {
            let tr = `<tr id=${index}><td>${ele.uname}</td><td>${ele.fen}</td><td>${ele.money}</td><td><span></span><s>上移    </s><b> 下移</b><i></i></td></tr>`
            $("tbody").append(tr);
            // $("tbody").prepend(tr);
        })
    }
    //柱状图
    function Chart() {
        let arrUname = [];
        let arrFen = [];
        let arrMoney = [];
        $.each(arr, function (index, ele) {
            arrUname.push(ele.uname);
            arrFen.push(ele.fen);
            arrMoney.push(ele.money);
        })
        //柱状图
        var myChart = echarts.init(document.querySelector(".zhuzhuang"));
        option = {
            title: {
                text: "评分图示",
                textStyle: {
                    color: "#fff",
                }
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '0%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{

                    type: 'category',
                    data: arrUname,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        align: 'center',
                        interval: 0,
                        axisLabel: {
                            formatter: '{value}',
                        },
                        color: '#fff'
                    },
                },

            ],
            yAxis: [{
                    type: 'value',
                    axisLabel: {
                        color: '#fff'
                    },
                },

            ],
            series: [{
                name: '评分',
                type: 'bar',
                barWidth: '60%',
                data: arrFen,
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            //浏览器窗口发生变化时图表调用resize方法
            myChart.resize();
        })
    }
    //折线图
    function Chart1() {
        let arrUname = [];
        let arrFen = [];
        let arrMoney = [];
        $.each(arr, function (index, ele) {
            arrUname.push(ele.uname);
            arrFen.push(ele.fen);
            arrMoney.push(ele.money);
        })
        var myChart = echarts.init(document.querySelector(".zhexian"));
        option = {
            title: {
                text: "薪资图示",
                textStyle: {
                    color: "#fff",
                }
            },
            grid: {
                left: '0%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: arrUname,
                axisLabel: {
                    color: '#fff'
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#fff'
                },
                splitLine: {
                    show: false //不显示网格线
                },
            },
            series: [{
                data: arrMoney,
                type: 'line'
            }]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            //浏览器窗口发生变化时图表调用resize方法
            myChart.resize();
        })
    }
})