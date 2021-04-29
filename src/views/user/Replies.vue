<template>
  <data-list-viewer
    baseURL="/user-center/comments"
    :getDataAPI="getMessageList"
    emptyText="You haven't commented anything, yet"
    @error="onError"
  ></data-list-viewer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DataListViewer from '@/components/DataListViewer.vue'
import APIs from '@/APIs'
import { ElMessage } from 'element-plus'

@Options({
  components: {
    'data-list-viewer': DataListViewer
  },
  data () {
    return {
      getMessageList: APIs.getUserPostLevelList
    }
  },
  methods: {
    onError (e:unknown) {
      ElMessage.error('Can\'t load. ' + e)
      this.$router.push('/signin')
    }
  }
})
export default class Replies extends Vue {}
</script>

<style scoped>

</style>
