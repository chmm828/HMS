<template>
  <div>
    <a-select v-model="id" show-search :filterOption="filterOption" @change="setChroincName">
      <a-select-option v-for="item in filterArr" :key="item.id">
        {{ item.name }} - <span style="font-size: 11px; color: #999">({{ item.category }})</span>
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
export default {
  props: {
    // 总的指标数组
    indexArr: {
      type: Array,
      required: true
    },
    formData: {
      type: Object,
      required: true
    },
    // 接受过滤后的指标数组
    sendFilter: {
      type: Array,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      id: null,
      filterData: this.formData.targetArr,
      filterArr: null
    }
  },
  methods: {
    async setChroincName () {
      const id = Number(this.id)
      // console.log('全部', this.indexArr)
      // const filterData = JSON.parse(JSON.stringify(this.filterData))
      // console.log('filterData,要过滤', this.filterData)
      setTimeout(() => {
        var filterAr = this.filterArr
        for (var i = 0; i < this.filterData.length; i++) {
          filterAr = filterAr.filter((item) => {
            const newFilter = Object.assign({}, this.filterData[i])
            // console.log('newFilter', newFilter.indexItemId)
            return item.id !== newFilter.indexItemId
          })
        }
        // console.log('过滤后', filterAr)
        this.filterArr = filterAr
        this.$emit('changeIndex', { id: id, filterAr: this.filterArr })
      }, 0)
      this.$emit('changeIndex', { id: id, filterAr: this.filterArr })
    },
    filterOption (value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    }
  },
  mounted () {
    // console.log('sendFilter', this.sendFilter.length)
    // this.filterArr = this.indexArr
    if (this.sendFilter.length === 0) {
        this.filterArr = this.indexArr
    } else {
      this.filterArr = this.sendFilter
    }
  }
}
</script>
