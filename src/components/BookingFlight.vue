<script setup>
    import { ref, computed } from 'vue'
    const flightType = ref('singleFlight')
    const departureDate = ref(dateToString(new Date()))
    const returnDate = ref(departureDate.value)

    const isReturn = computed(() => flightType.value === 'returnFlight')

    function stringToDate(str) {
        const [y, m, d] = str.split('-')
        console.log('stringToDate: ', +y, m - 1, +d)
        return (+y, m - 1, +d)
    }

    function getCurrentDateString() {
        let date = new Date()
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
    function dateToString(date) {
        return(date.getFullYear() + '-' + getMonthString(date.getMonth() + 1) + '-' + date.getDate())
    }

    function getMonthString(month) {
        let curr_month = String(month)
        return curr_month.length < 2 ? '0' + curr_month : curr_month
    }

    const isValidDate = computed(() => {
        return new Date(getCurrentDateString()) <= new Date(departureDate.value) 
    })
    

    const canBook = computed(() => {
        return !isReturn.value || stringToDate(departureDate.value) <= stringToDate(returnDate.value)
    })

    function bookFlight(){
        isReturn.value 
        ?
        window.alert(`你成功预订了[去程]：${departureDate.value} && [回程]：${returnDate.value}的机票`) 
        : 
        window.alert(`你成功预订了[去程]：${departureDate.value} 的机票`)
    }
</script>

<template>
    <section class="flight-section">
        <label for="">选择航班类型：</label>
        <select name="flightType" v-model="flightType">
            <option value="singleFlight">single flight</option>
            <option value="returnFlight">return flight</option>
        </select>
        <br/>

        <label for="#departureDate" :class="isValidDate ? '' : 'error'">出发日期：
            <input id="departureDate" type="date" v-model="departureDate" >
            <span v-show="!isValidDate">日期错误</span>
        </label>
        <br/>

        <label for="#departureDate" :class="canBook ? '' : 'error'">返回日期：
            <input id="return" type="date" v-model="returnDate" :disabled="!isReturn">
            <span v-show="!canBook">日期错误</span>
        </label>
        <br/>

        <button class="book-btn" @click="bookFlight" :disabled="!isValidDate || !canBook">预订</button>

    </section>

    
</template>

<style scoped>
    .flight-section {
        label,
        select {
            line-height: 30px;
        }
        button {
            line-height: 28px;
            background-color: #fff;
            &:hover {
                background-color: #999;
            }
        }
    }
    .error {
        input, 
        span {
            color: red;
        }
    }
</style>