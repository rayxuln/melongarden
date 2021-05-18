<template>
<div class="search-bar-popover">
  <div class="hottop-title">HotTops</div>
  <el-divider></el-divider>
  <div v-if="hottopList.length > 0">
    <div class="list-item" v-for="item in hottopList" :key="item" @click="$emit('select-hottop-item', item)">{{ item.title }}</div>
  </div>
  <el-empty v-else description="No hot top."></el-empty>

  <div v-if="historyList.length > 0" class="history-title-container"><div class="history-title">History</div><el-button type="text" icon="el-icon-delete" @click="$emit('clear')">Clear</el-button></div>
  <el-divider v-if="historyList.length > 0"></el-divider>
  <div v-if="historyList.length > 0">
    <div class="list-item" v-for="(item, index) in historyList" :key="item" @mouseenter="onHoverHistoryItemEnter(index)" @mouseleave="onHoverHistoryItemLeave(index)" @click="$emit('select-history-item', item)">
      {{ item }}
      <el-button :class="{ hide: !historyItemStateList[index].hover }" type="text" icon="el-icon-close" @click.stop="$emit('delete-history-item', index)"></el-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    hottopList: Array,
    historyList: Array
  },
  emits: ['select-history-item', 'select-hottop-item', 'clear', 'delete-history-item'],
  data () {
    return {
      historyItemStateList: []
    }
  },
  watch: {
    historyList (h) {
      this.historyItemStateList = []
      for (const i of h) {
        this.historyItemStateList.push({
          hover: false
        })
      }
    }
  },
  methods: {
    onHoverHistoryItemEnter (id:number) {
      this.historyItemStateList[id].hover = true
    },
    onHoverHistoryItemLeave (id:number) {
      this.historyItemStateList[id].hover = false
    }
  }
})
export default class SearchBarPopover extends Vue {}
</script>

<style scoped>
.search-bar-popover{
  margin: -12px;
}

.hottop-title, .history-title{
  font-size: 13pt;
  color: gray;
}

.hottop-title, .history-title-container{
  padding: 15px;
  padding-bottom: 0px;
}

.history-title{
  display: flex;
  align-items: flex-end;
}

.el-divider{
  margin-top: 8px;
  margin-bottom: 8px;
}

.history-title-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.list-item{
  font-size: 12pt;
  color: black;
  line-height: 36px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.list-item:hover{
  background-color: #f2f1f1;
}

.hide{
  display: none;
}
</style>
