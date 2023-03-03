<template>
  <div>
    <a-card>
      <div style="padding-bottom: 8px">
        <a-button @click="openMedModal('add')" type="primary" style="margin-right: 12px">新建治疗目标</a-button>
        <a-button @click="openMedModal('edit')" type="primary">编辑{{ getProName() }}治疗目标名称</a-button>
        <a-button @click="openItemModal('add')" type="primary" style="float: right;">新建{{ getProName() }}药物</a-button>
      </div>
      <a-tabs v-model="checkTabKey">
        <a-tab-pane v-for="tab in medArr" :key="tab.id" :tab="tab.name">
          <a-table
            :scroll="{ y: 600 }"
            size="small"
            row-key="id"
            :columns="columns"
            :data-source="tab.medicines"
            :pagination="false"
          >
            <span slot="dosage" slot-scope="text, record">
              {{ record.frequency }}次/{{ record.unit }}，每次{{ text }}
            </span>
            <span slot="sideEffect" slot-scope="text">
              <a-tooltip :overlayStyle="{maxWidth:'720px'}">
                <template slot="title">
                  <span>{{ text }}</span>
                </template>
                <span class="sideEffect">{{ text }}</span>
              </a-tooltip>
            </span>
            <span slot="createdAt" slot-scope="text, record">
              {{ record.createdAt | getMoment }}
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="openItemModal('edit', record)">编辑</a>
              <span>
                |
              </span>
              <a-popconfirm
                title="确定删除此药物吗?"
                @confirm="delOk(record)"
                @cancel="delCel"
              >
                <a>删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-modal
      :visible="MedVisible"
      v-if="MedVisible"
      :title="MedData.index === 'edit' ? '编辑治疗目标' : '新建治疗目标'"
      @ok="handAddOk"
      @cancel="handleAddCancel"
      :width="700"
    >
      <div>
        <a-row>
          <a-col :span="4" style="text-align: right;line-height: 30px;">
            治疗目标:&nbsp;
          </a-col>
          <a-col :span="20">
            <a-input v-model="MedData.name" placeholder="输入治疗目标" ></a-input>
          </a-col>
        </a-row>
      </div>
    </a-modal>

    <addMedicine
      :addVisible="addVisible"
      :medicineData="medicineData"
      :mode="mode"
      :goalName="goalName"
      @closeAddModal="closeAddModal"
    />
  </div>
</template>
<script>
import addMedicine from './components/ChronicMedicineAdd.vue'
import { getMedicine as apiGetMedicine, editMedicineGoal as apiEditMedicineGoal, addMedicine as apiAddMedicine, delMedicineItem as apiDelMedicineItem } from '@/api/medicine'
import moment from 'moment'
const columns = [
  {
    title: '药物类别',
    dataIndex: 'type'
  },
  {
    title: '药物名',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '使用剂量',
    dataIndex: 'dosage',
    align: 'center',
    scopedSlots: { customRender: 'dosage' }
  },
  {
    title: '不良反应',
    dataIndex: 'sideEffect',
    align: 'center',
    scopedSlots: { customRender: 'sideEffect' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    align: 'center',
    scopedSlots: { customRender: 'createdAt' }

  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    addMedicine
  },
  name: 'APP',
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
      mode: '',
      goalName: '',
      addVisible: false,
      medicineData: null,
      checkTabKey: null,
      MedVisible: false,
      MedData: {
        name: null,
        index: null
      },
      columns,
      medArr: []
    }
  },
  methods: {
    getMedicine () {
      apiGetMedicine().then(res => {
        if (res.status === 200) {
          this.medArr = res.data
          // console.log('获取成功', this.medArr)
          this.checkTabKey = this.medArr[0].id
        } else {
          this.$message.error('获取失败' + res.message)
          // console.log('获取失败')
        }
      })
    },
    updateMedicine () {
      apiGetMedicine().then(res => {
        if (res.status === 200) {
          this.medArr = res.data
          // console.log('获取成功', this.medArr)
          // this.checkTabKey = this.medArr[0].id
        } else {
          this.$message.error('获取失败' + res.message)
          // console.log('获取失败')
        }
      })
    },
    getProName () {
      // return this.checkTabKey
      const project = (this.medArr || []).find(tab => tab.id === this.checkTabKey)
      if (project) {
        return project.name
      } else {
        return ''
      }
    },
    openMedModal (index) {
      // console.log('弹窗')
      switch (index) {
        case 'add':
          this.MedData.name = ''
          this.MedData.index = 'add'
          this.MedVisible = true
          break
        case 'edit':
          this.MedData.name = this.getProName()
          this.MedData.index = 'edit'
          this.MedVisible = true
          break
      }
    },
    openItemModal (mode, data) {
      // console.log('mode', mode)
      // console.log('data', data)
      // console.log('goalname', this.getProName())
      switch (mode) {
        case 'add':
          this.medicineData = {}
          this.mode = mode
          this.goalName = this.getProName()
          this.addVisible = true
          break
        case 'edit':
          this.mode = mode
          this.goalName = this.getProName()
          this.medicineData = JSON.parse(JSON.stringify(data))
          this.addVisible = true
      }
    },
    closeAddModal () {
      this.addVisible = false
    },
    handAddOk () {
      switch (this.MedData.index) {
        case 'edit':
          if (this.MedData.name) {
            // console.log(this.getProName(), '确定', this.MedData.name)
            const apiData = { goal: this.MedData.name }
            apiEditMedicineGoal(this.getProName(), apiData).then(res => {
              if (res.status === 200) {
                // console.log('成功', res)
                this.$message.info('编辑治疗目标成功')
                this.MedVisible = false
                this.updateMedicine()
              } else {
                this.$message.error('编辑失败' + res.message)
              }
            })
            break
          } else {
            this.$message.error('治疗目标不能为空')
            break
          }
        case 'add' :
          if (this.MedData.name) {
            // console.log(this.getProName(), '确定', this.MedData.name)
            apiAddMedicine(this.MedData.name).then(res => {
              if (res.status === 201) {
                // console.log('成功', res)
                this.$message.info('新建治疗目标成功')
                this.MedVisible = false
                this.updateMedicine()
              } else {
                this.$message.error('新建失败' + res.message)
                // console.log(res)
              }
            })
            break
          } else {
            this.$message.error('治疗目标不能为空')
            // console.log('错误', this.MedData.name)
            break
          }
      }
    },
    handleAddCancel () {
      this.MedVisible = false
      // console.log('取消')
    },
    delOk (data) {
      apiDelMedicineItem(this.getProName(), data.id).then(res => {
        // console.log(res)
        if (res.status <= 204) {
          this.updateMedicine()
          this.$message.info('删除药物成功')
        } else {
          this.$message.error('删除失败' + res.message)
        }
      })
      // console.log(this.getProName(), '111', data)
    },
    delCel () {
      // console.log('取消')
    }
  },
  created () {
    this.$setPageDataLoader(this.getMedicine)
  },
  mounted () {
    this.getMedicine()
      // console.log('this.medArr', this.medArr)
      // if (this.medArr.length !== 0) {
      //   this.checkTabKey = this.medArr[0].id
      //   console.log('medArr', this.medArr)
      // }
  },
  watch: {
    checkTabKey (newData, oldData) {
      // console.log(oldData, 'checkTabKey', newData)
    }
  }
}
</script>
<style scoped>
.sideEffect{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
