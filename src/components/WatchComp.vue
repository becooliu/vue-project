<script setup>
    import {onMounted, ref, watch} from 'vue'
    const question = ref('')
    const answer = ref('Questions usually contain a question mark. ;-)')
    const answerImg = ref('')
    const loading = ref(false)
    // ref 属性的使用：
    const input = ref(null)

    // 在onMounted 时，使带有ref 属性的节点获取焦点
    onMounted(() => {
        input.value.focus()
    })

    watch(question, async(newQuestion) => {
        if(newQuestion.includes('?')) {
            loading.value = true
            answer.value = 'thinking ...'
            
            try {
                let res = await fetch('https://yesno.wtf/api')
                const result = await res.json()
                answer.value = result.answer
                answerImg.value = result.image
            } catch (error) {
                answer.value = 'Sorry, could not fetch the api. '+ error
            }finally {
                loading.value = false
            }
        }
    })
    
</script>

<template>
    <p>
    Ask a yes/no question:
    <input v-model="question" :disabled="loading" ref="input" />
  </p>
  <p>{{answer}}</p>
  <img :src="answerImg" alt="">
</template>