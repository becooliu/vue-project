<template>
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import instance from "@/axios/base"

// 使用 ref 获取 DOM 元素
const chartRef = ref(null);
let myChart = null;

const apiPathArr = ref([])
const apiVisitedCountArr = ref([])

const responseData = ref(null)
instance.get('/get24HoursApiVisited').then(res => {
    responseData.value = res.data.apiRecord
    const countMap = responseData.value.reduce((acc, cur) => { acc[cur.path] = (acc[cur.path] || 0) + 1; return acc }, {})
    const countArray = Object.entries(countMap)

    // 将路由和访问量分别存入两个数组中，在图表初始化时传入
    const pathArr = []
    countArray.every(item => { return pathArr.push(item[0]) })
    apiPathArr.value = pathArr

    const visitedCountArr = []
    countArray.every(item => { return visitedCountArr.push(item[1]) })
    apiVisitedCountArr.value = visitedCountArr

    initChart()
})

// 初始化图表
const initChart = () => {
    if (chartRef.value) {
        // 初始化 ECharts 实例
        myChart = echarts.init(chartRef.value);

        // 设置图表配置项
        const option = {
            title: {
                text: '24小时接口访问量'
            },
            tooltip: {},
            xAxis: {
                data: apiPathArr.value // 数据格式['/login', '/blog/detail']
            },
            yAxis: {},
            series: [
                {
                    name: '24小时接口访问次数',
                    type: 'bar',
                    data: apiVisitedCountArr.value // 数据格式[3, 5, 12, 6]
                }
            ]
        };

        // 渲染图表
        myChart.setOption(option);
    }
};

// 在组件挂载时初始化图表
onMounted(() => {
    initChart();
    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', resizeChart);
});

// 在组件销毁前销毁图表
onBeforeUnmount(() => {
    if (myChart) {
        myChart.dispose(); // 销毁图表实例
    }
    window.removeEventListener('resize', resizeChart); // 移除事件监听
});

// 调整图表大小
const resizeChart = () => {
    if (myChart) {
        myChart.resize();
    }
};

</script>