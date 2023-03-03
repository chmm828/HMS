<template>
  <div>
    <a-modal
      :visible="medicineVisible"
      v-if="medicineVisible"
      :title="'编辑药物【'+medicineInfo.name+'】'"
      @ok="medicineHandleOk"
      @cancel="medicineHandleCancel"
      width="80%"
      :maskClosable="false"
      :ok-button-props="{ style: {display: 'none'} }"
    >
      <div >
        <a-card>
          <div style="padding-bottom: 8px">
            <a-select style="width: 200px" placeholder="请选择药物" v-model="checkItemid" show-search :filterOption="filterOption">
              <a-select-option v-for="item in medAllData" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-button type="primary" @click="addMed" style="margin-left: 12px">添加药物</a-button>
          </div>
          <a-table
            :scroll="{ y: 600 }"
            size="small"
            :columns="columns"
            :rowKey="(record,index)=>{return index}"
            :data-source="medicineDatas"
            :pagination="false"
          >
            <span slot="dosage" slot-scope="text, record">
              {{ record.medicine.frequency }}次/{{ record.medicine.unit }}，每次{{ text }}
            </span>
            <span slot="createdAt" slot-scope="text, record">
              {{ record.medicine.createdAt | getMoment }}
            </span>
            <span slot="action" slot-scope="text, record">
              <a-popconfirm
                title="确定删除此药物吗?"
                @confirm="delOk(record)"
                @cancel="delCel"
              >
                <a>删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { getMedicine as apiGetMedicine, addMedicineToChronic as apiAddMedicineToChronic, delMedicineToChronic as apiDelMedicineToChronic } from '@/api/medicine'
import { getOneChronic as apiGetOneChronic } from '@/api/chronic'
const columns = [
  {
    title: '药物类别',
    dataIndex: 'medicine.type'
  },
  {
    title: '药物名',
    dataIndex: 'medicine.name'
  },
  {
    title: '使用剂量',
    dataIndex: 'medicine.dosage',
    scopedSlots: { customRender: 'dosage' }
  },
  {
    title: '不良反应',
    dataIndex: 'medicine.sideEffect',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'medicine.createdAt',
    scopedSlots: { customRender: 'createdAt' }

  },
  {
    title: '操作',
    key: 'action',
    width: 70,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  props: {
    medicineVisible: {
      type: Boolean,
    default: false
      },
    medicineData: {
      type: Array,
      default: function () {
      return []
      }
    },
    medicineInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  filters: {
    getMoment: function (value) {
      if (value === null) {
        return ''
      } else {
        return moment(value).format('YYYY-MM-DD HH:mm')
      }
    }
  },
  data () {
    return {
      columns,
      checkItemid: undefined,
      medAllData: [],
      medicineDatas: this.medicineData
    }
  },
  methods: {
    medicineHandleOk () {
      // console.log('1', this.medicineDatas)
      const medData = this.medicineDatas
      for (const item of medData) {
        // console.log(item)
        var okIndex = true
        for (const key in item) {
        //   console.log(item[key])
          if (item[key] === '') {
            okIndex = false
            break
          }
        }
        // console.log(okIndex)
        if (okIndex === false) {
          // console.log('结束')
          break
        }
      }
      if (okIndex) {
        // console.log('调接口')
      } else {
        // console.log('提示')
      }
    },
    medicineHandleCancel () {
      this.$emit('closeMedicineModal')
    },
    getMedinine () {
      apiGetMedicine().then(res => {
        if (res.status === 200) {
          // console.log('获取成功', res.data)
          const medAllData = []
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < res.data[i].medicines.length; j++) {
              medAllData.push(res.data[i].medicines[j])
              // console.log(res.data[i].medicines[j])
            }
          }
          this.medAllData = medAllData
          // console.log('medAllData', medAllData)
        } else {
          this.$message.error('获取失败，' + res.message)
          // console.log('获取失败')
        }
      })
    },
    // 将输入的内容与显示的内容进行匹配
    filterOption (value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },
    addMed () {
      const medicineId = { medicineId: this.checkItemid }
      apiAddMedicineToChronic(this.medicineInfo.id, medicineId).then(res => {
        if (res.status === 201) {
          this.$message.info('添加药物成功')
          this.$parent.getChronic()
          apiGetOneChronic(this.medicineInfo.id).then(res => {
            if (res.status === 200) {
              this.medicineDatas = res.data.medicines
            } else {
              this.$message.error('获取失败，' + res.message)
            }
          })
          this.checkItemid = undefined
        } else if (res.status === 400) {
          this.$message.error('添加失败，' + res.message)
        }
      })
      // console.log(this.medicineInfo.id, '选择的', this.checkItemid)
    },
    delOk (data) {
      const diseaseId = this.medicineInfo.id
      const indexId = data.medicine.id
      apiDelMedicineToChronic(diseaseId, indexId).then(res => {
        // console.log(res)
        if (res.status === 200) {
          apiGetOneChronic(diseaseId).then(res => {
            if (res.status === 200) {
              this.medicineDatas = res.data.medicines
            } else {
              this.$message.error('获取失败，' + res.message)
            }
          })
          this.$message.info('删除药物成功')
        } else {
          this.$message.error('删除药物失败')
        }
      })
      // console.log(this.medicineInfo.id, data.medicine.id)
    },
    delCel () {
    }
  },
  created () {
  },
  mounted () {
    this.getMedinine()
  },
  watch: {
    medicineData (newData, oldData) {
      this.medicineDatas = newData
      this.checkItemid = undefined
      // console.log('this.medicineDatas', this.medicineDatas)
    },
    checkItemid (newid, oldid) {
      // console.log(oldid, newid)
    }
  }
}
</script>
<style scoped>

</style>
