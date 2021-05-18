<template>
  <div class="check-in-panel">
    <div class="head">
      <div>Records in {{ monthNameMap[month-1] }}</div>
      <div>{{ checkedNum }}/{{ totalNum }}</div>
    </div>
    <el-divider></el-divider>
    <div class="check-in-calendar">
      <el-row type="flex" justify="space-between">
        <el-col :span="3">
          Sun
        </el-col>
        <el-col :span="3">
          Mon
        </el-col>
        <el-col :span="3">
          Tue
        </el-col>
        <el-col :span="3">
          Wen
        </el-col>
        <el-col :span="3">
          Thi
        </el-col>
        <el-col :span="3">
          Fri
        </el-col>
        <el-col :span="3">
          Sat
        </el-col>
      </el-row>

      <el-row v-for="row in data" :key="row" type="flex" justify="space-between">
        <el-col v-for="col in row" :key="col" :span="3">
          <el-tooltip :content="col.checked ? 'Checked' : 'Unchecked'" placement="top" effect="light">
            <el-link :class="{ hide: col.empty }" @click.prevent :type="col.checked ? 'primary' : 'default'">{{ col.num }}<i class="el-icon-s-flag" :class="{ hide: !col.checked }"></i></el-link>
          </el-tooltip>
        </el-col>
      </el-row>

    </div>
    <el-button class="check-in-button" :class="{ hide: hasCheckedIn }" type="primary" plain @click="$emit('check-in')">Check In</el-button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    dateData: Array,
    month: {
      type: Number,
      default: 1
    },
    hasCheckedIn: {
      type: Boolean,
      default: false
    }
  },
  emits: ['check-in'],
  data () {
    return {
      data: [
        [
          {
            empty: true,
            checked: false,
            num: '1'
          },
          {
            empty: true,
            checked: false,
            num: '2'
          },
          {
            empty: false,
            checked: false,
            num: '3'
          },
          {
            empty: false,
            checked: true,
            num: '4'
          },
          {
            empty: false,
            checked: false,
            num: '5'
          },
          {
            empty: false,
            checked: false,
            num: '6'
          },
          {
            empty: true,
            checked: false,
            num: '7'
          }
        ]
      ],
      monthNameMap: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
  },
  computed: {
    totalNum () {
      let cnt = 0
      for (const r of this.data) {
        for (const c of r) {
          if (!c.empty) {
            cnt += 1
          }
        }
      }
      return cnt
    },
    checkedNum () {
      let cnt = 0
      for (const r of this.data) {
        for (const c of r) {
          if (c.checked) {
            cnt += 1
          }
        }
      }
      return cnt
    }
  },
  watch: {
    dateData (v) {
      this.genData(v)
    }
  },
  methods: {
    genData (rawData:Array<boolean>) {
      const date = new Date()
      date.setMonth(this.month - 1, 1)
      const firstDateWeek = date.getDay() // 0 = Sun, 6 = Sat
      const totalDateNum = this.dayNumInMonth(this.month)
      if (totalDateNum !== rawData.length) {
        console.log(`The month days in raw data is not competiple: ${totalDateNum} != ${rawData.length}`)
        return
      }

      this.data = []

      let pos = -1
      while (pos < totalDateNum) {
        const row = []
        for (let i = 0; i < 7; ++i) {
          if (pos === -1 && i === firstDateWeek) {
            pos = 0
          }
          if (pos >= 0 && pos < totalDateNum) {
            row.push(this.genDateCol(false, rawData[pos], `${pos + 1}`))
            pos += 1
          } else {
            row.push(this.genDateCol(true, false, ''))
          }
        }
        this.data.push(row)
      }
    },
    dayNumInMonth (m:number) {
      const date = new Date()
      date.setMonth(m, 0)
      return date.getDate()
    },
    genDateCol (empty:boolean, checked:boolean, num:string) {
      return {
        empty,
        checked,
        num
      }
    }
  }
})
export default class CheckInPanel extends Vue {}
</script>

<style scoped>
.check-in-panel{
  margin: -12px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.head{
  display: flex;
  justify-content: space-between;
  padding: 7px;
  color: gray;
}

.el-divider{
  margin: 0px;
}

.check-in-button{
  border-radius: 0px 0px 4px 4px;
}

.check-in-calendar{
  text-align: center;
  margin: 5px;
}

.hide{
  display: none;
}

.marked{
  color: #409eff;
}
</style>
