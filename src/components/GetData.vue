<script setup>
    import { ref, watchEffect } from 'vue';
    const pageNum = ref(3)

    const API_URL = `https://api.github.com/repos/vuejs/core/commits?per_page=`
    const branches = ['main', 'v2-compat']

    const currentBranch = ref(branches[0])
    const commits = ref(null)

    watchEffect(async() => {
        const url = `${API_URL}${pageNum.value}&sha=${currentBranch.value}`
        commits.value = await (await fetch(url)).json()
    })

    function truncate (v) {
        const newline = v.indexOf('\n')
        return newline > 0 ? v.slice(0, newline) : v
    }

    function formatDate (v) {
        return v.replace(/T|Z/g, ' ')
    }
</script>

<template>
  <div>
    <h1>最新vue 核心commits</h1>
    <template v-for="branch in branches" :key="branch">
        <input type="radio"  :value="branch" :id="branch" v-model="currentBranch" name="branch">
        <label :for="branch" class="label" :class="branch">{{branch}}</label>
    </template>
    <h3>每页展示{{pageNum}}条数据</h3>
    修改每页显示的数量：<input type="number" v-model="pageNum">
    <br />

    <p>vue.js/vue@{{ currentBranch }}</p>
    <ul>
      <li v-for="{ html_url, sha, author, commit } in commits" :key="sha">
        <a :href="html_url" class="commit" target="_blank">{{ sha?.slice(0, 7) }}</a>
        <span class="message">{{ truncate(commit.message) }}</span><br>
        by <span class="author">
          <a :href="author.html_url">{{ commit.author.name }}</a>
        </span>
        at <span class="date">{{ formatDate(commit.author.date) }}</span>
      </li>
    </ul>
  </div>
</template>

<style>
a {
  text-decoration: none;
  color: #42b883;
}
li {
  line-height: 1.5em;
  margin-bottom: 20px;
}
.author,
.date {
  font-weight: bold;
}
.label {
  margin-right: 1em;
  cursor: pointer;
}
</style>