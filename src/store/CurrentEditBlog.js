import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCurrentEditBlogStore = defineStore('currentBlog', () => {
  const blogId = ref('')

  const setBlogId = id => {
    blogId.value = id
  }

  const getBlogId = computed(() => {
    return blogId.value
  })

  return {
    blogId,
    setBlogId,
    getBlogId
  }
})
