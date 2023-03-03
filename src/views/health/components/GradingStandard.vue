<template>
  <div>
    <a-modal
      :visible="gradingVisible"
      v-if="gradingInfo"
      :title="`分级标准【${gradingInfo.name || ''}】`"
      @ok="handleOk"
      @cancel="gradingHandleCancel"
      width="800px"
      ok-text="保存">
      <div class="group-body">
        <a-input-group v-for="(item, index) in gradingData1" :key="index" class="group-item">
          <a-input style="width: 15%;text-align: center;" :value="index + 1 + '级'" disabled/>
          <a-input style="width: 80%;" v-model="item.describe" placeholder="请输入等级描述"/>
          <a-icon class="targetIcon" @click="deleteLevel(index)" type="close-circle" />
        </a-input-group>
        <a-button @click="addLevelArr" type="dashed" style="display:block;margin:10px auto;width:70%">
          <a-icon type="plus" /> 添加等级
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { message, notification } from 'ant-design-vue'
import { updateHeathLevels } from '@/api/health'
export default {
  props: {
      gradingVisible: {
          type: Boolean,
          default: false
      },
      gradingData: {
          type: Array,
          default: function () {
            return []
          }
      },
      gradingInfo: {
          type: Object,
          default: function () {
            return {}
          }
      }
  },
  data () {
    return {
      // visible1: this.gradingVisible,
      // chronicTitle: '',
      // levelArr: [],
      diseaseId: null,
      gradingData1: this.gradingData
    }
  },
  methods: {
    // openModel (data) {
      // this.chronicTitle = data.name
      // this.diseaseId = data.id
      // this.visible1 = true
    // },
    // async getHealthLevels () {
    //   this.diseaseId = this.gradingInfo.id
    //   console.log('this.gradingInfo', this.gradingInfo)
    //   const res = await getHeathLevels(this.diseaseId)
    //   if (res.status === 200) {
    //     this.gradingData = res.data
    //   } else {
    //     notification.warning({ message: '请求失败', description: res.message })
    //   }
    // },
    handleOk () {
      const apiData = {
        levels: (this.gradingData1 || []).map((item, index) => {
          return { level: index + 1, remark: item.describe }
        })
      }
      updateHeathLevels(this.gradingInfo.id, apiData).then(res => {
        // console.log('给后端的', apiData)
        if (res.status === 200) {
          this.$message.success('保存成功')
          this.$emit('closeGradingModal')
        } else {
          notification.warning({ message: '保存失败', description: res.message })
        }
      })
    },
    addLevelArr () {
      if (this.gradingData1.length < 9) {
        this.gradingData1.push({ level: null, describe: '' })
      } else {
        message.warning('你已达到分级上限，最高九级')
      }
    },
    deleteLevel (index) {
      this.gradingData1 = this.gradingData1.filter((item, idx) => idx !== index)
    },
    gradingHandleCancel () {
      this.$emit('closeGradingModal')
    }
  },
  watch: {
    gradingData () {
      // console.log('++')
      this.gradingData1 = this.gradingData
    }
  }
}
</script>

<style>
.group-body{
  width: 90%;
  margin: 0 auto;
}
.group-item{
  margin-bottom:15px;
  display: flex;
  /* align-content: center; */
}
.targetIcon{
  width: 5%;
  font-size: 18px;
  color: #ccc;
  /* line-height: 30px; */
  /* height: 30px; */
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
