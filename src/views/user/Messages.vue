<template>
  <div v-loading="isLoading" class="message-container">
    <el-empty v-if="isEmpty" description="There is no post, yet."></el-empty>
    <div v-else class="list-container">
        <el-card shadow="hover" v-for="m in msgList" :key="m">
          <template #header>
            <div class="message-title">
              <el-tag v-for="t in m.tags" :key="t" :type="t.type">{{ t.tag }}</el-tag>
              <el-link type="primary" :href="m.url" @click.prevent="$router.push(m.url)">{{ m.title }}</el-link>
            </div>
          </template>
          <div class="message-content">
            {{ m.content }}
          </div>
          <div class="message-date">
            {{ m.date }}
          </div>
        </el-card>

      <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="pageSize"
          :page-count="5"
          :total="totalNum"
          :current-page="pageNumber"
          :hide-on-single-page="true"
          @current-change="onCurrentPageChanged">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { Options, Vue } from 'vue-class-component'
import APIs from '@/APIs'

@Options({
  data () {
    return {
      msgList: [],
      pageSize: 5,
      pageNumber: 1,
      totalNum: 100,
      isEmpty: false,
      isLoading: false
    }
  },
  created () {
    this.$watch(
      () => this.$route.query,
      () => {
        if (this.$route.path === '/user-center/messages') {
          this.loadMessages()
        }
      }
    )
  },
  mounted () {
    this.loadMessages()
  },
  methods: {
    onCurrentPageChanged (pageNumber:number) {
      const r = {
        path: this.$route.path,
        query: { ...this.$route.query, page: pageNumber },
        hash: this.$route.hash,
        params: { ...this.$route.params }
      }
      this.$router.push(r)
    },
    loadMessages () {
      this.isLoading = true
      this.pageNumber = Number.parseInt(this.$route.query.page)
      if (!this.pageNumber) {
        this.pageNumber = 1
      }
      const filter = this.$route.query.search || ''
      APIs.getUserMessageList(this.pageSize, this.pageNumber, filter).then((value:unknown) => {
        const v = value as { msgList:unknown, totalNum:unknown }
        this.msgList = v.msgList
        this.totalNum = v.totalNum

        this.isEmpty = this.msgList.length === 0
      }).catch((e:unknown) => {
        ElMessage.error('Can\'t load messages. ' + e)
        this.$router.push('/signin')
      }).then(() => {
        this.isLoading = false
      })
    }
  }
})
export default class Messages extends Vue {}
</script>

<style scoped>
.message-container {
  padding: 15px;
  width: 100%;
}

.el-pagination{
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
}

.message-date{
  text-align: right;
  font-size: 10pt;
  color: gray;
}

.message-title .el-tag{
  margin-right: 5px;
}
</style>
