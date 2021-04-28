<template>
  <div v-loading="isLoading" class="data-list-viewer">
    <el-empty v-if="isEmpty" :description="emptyText"></el-empty>
    <div v-else class="list-container">
        <el-card shadow="hover" v-for="m in dataList" :key="m">
          <template #header>
            <div class="data-title">
              <el-tag v-for="t in m.tags" :key="t" :type="t.type">{{ t.tag }}</el-tag>
              <el-link type="primary" :href="m.url" @click.prevent="$router.push(m.url)">{{ m.title }}</el-link>
            </div>
          </template>
          <div class="data-content">
            {{ m.content }}
          </div>
          <div class="data-date">
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
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    baseURL: String,
    getDataAPI: Function,
    postPageSize: {
      type: Number,
      default: 7
    },
    emptyText: String
  },
  emits: ['error'],
  data () {
    return {
      dataList: [],
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
        if (this.$route.path === this.baseURL) {
          this.loadDataList()
        }
      }
    )
  },
  mounted () {
    this.loadDataList()
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
    loadDataList () {
      this.isLoading = true
      this.pageNumber = Number.parseInt(this.$route.query.page)
      if (!this.pageNumber) {
        this.pageNumber = 1
      }
      const filter = this.$route.query.search || ''
      this.getDataAPI(this.pageSize, this.pageNumber, filter, this.postPageSize).then((value:unknown) => {
        const v = value as { dataList:unknown, totalNum:unknown }
        this.dataList = v.dataList
        this.totalNum = v.totalNum

        this.isEmpty = this.dataList.length === 0
      }).catch((e:unknown) => {
        this.$emit('error', e)
      }).then(() => {
        this.isLoading = false
      })
    }
  }
})
export default class DataListViewer extends Vue {}
</script>

<style scoped>
.data-list-viewer {
  padding: 15px;
  width: 100%;
}

.el-pagination{
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
}

.data-date{
  text-align: right;
  font-size: 10pt;
  color: gray;
}

.data-title .el-tag{
  margin-right: 5px;
}
</style>
