<template>
  <div v-loading="isPageLoading" class="images">
    <el-empty v-if="isEmpty" description="There is no image, yet."></el-empty>
    <el-card v-else shadow="never">
      <div class="image-post-card-container">
        <div v-for="(i, index) in imagePostCardList" :key="index">
          <image-post-card
            :img="i.img"
            :imgList="i.imgList"
            :title="i.title"
            :content="i.content"
            :userAvatar="i.userAvatar"
            :userName="i.userName"
            :postId="i.postId"
          ></image-post-card>
        </div>
      </div>
    </el-card>

    <el-pagination
        v-if="!isEmpty"
        background
        layout="prev, pager, next, jumper"
        :page-size="pageSize"
        :page-count="5"
        :total="postNum"
        :current-page="currentPageNumber"
        :hide-on-single-page="true"
        @current-change="onCurrentPageChanged">
    </el-pagination>

  </div>
</template>

<script lang="ts">
import APIs from '@/APIs'
import { Options, Vue } from 'vue-class-component'
import ImagePostCard from '@/components/ImagePostCard.vue'
import { ElMessage } from 'element-plus'

@Options({
  data () {
    return {
      isEmpty: true,
      imagePostCardList: [],
      pageSize: 16,
      postNum: 0,
      currentPageNumber: 0,
      isPageLoading: false
    }
  },
  components: {
    'image-post-card': ImagePostCard
  },
  created () {
    this.$watch(
      () => this.$route.query,
      () => {
        if (this.$route.path === '/images') {
          this.loadPosts()
        }
      }
    )
  },
  mounted () {
    this.loadPosts()
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
    loadPosts () {
      this.isPageLoading = true
      this.currentPageNumber = Number.parseInt(this.$route.query.page)
      if (!this.currentPageNumber) {
        this.currentPageNumber = 1
      }
      const filter = this.$route.query.search || ''
      APIs.getImagePostList(this.pageSize, this.currentPageNumber, filter).then((value:unknown) => {
        const v = value as { posts:unknown, postNum:unknown }
        this.imagePostCardList = v.posts
        this.postNum = v.postNum

        this.isEmpty = this.imagePostCardList.length === 0
      }).catch((v:unknown) => {
        ElMessage.error('Can\'t get image post list.' + v)
      }).then(() => {
        this.isPageLoading = false
      })
    }
  }
})
export default class Images extends Vue {}
</script>

<style scoped>
.el-pagination{
  margin-top: 15px;
}
</style>
