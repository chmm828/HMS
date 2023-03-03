<template>
  <div>
    <a-card class="chronicCard" :bordered="false">
      <a-row>
        <a-col :span="4">
          <a-button type="primary" @click="addChronic">新建慢病</a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-table class="chronicTable" :columns="columns" :data-source="tableData" :rowKey="record=>record.id" :pagination="pagination">
      <span slot="items" slot-scope="text, record">
        <!-- <a>{{ record.items }}</a> -->
        <a-popover>
          <template slot="content">
            <div style="max-width:600px;">
              <a-tag v-for="(item,index) in record.items" :key="index">
                {{ item.indexItem.name }}
              </a-tag>
            </div>
          </template>
          <span class="chronicItem">
            <a-tag v-for="(item,index) in record.items" :key="index">
              {{ item.indexItem.name }}
            </a-tag>
          </span>
        </a-popover>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="openSpeechModal(record)">话术</a>
        <a-divider type="vertical" />
        <a @click="GradingStandard(record)">分级标准</a>
        <a-divider type="vertical" />
        <a @click="editChronicTable(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="openMedicineModal(record)">药物</a>
        <!-- <a-divider type="vertical" />
        <a @click="delChronicTable(record)">删除</a> -->
      </span>
    </a-table>
    <a-modal
      title="新建慢病"
      v-if="addChronicIndexVisible"
      :visible="addChronicIndexVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
      :width="700">
      <a-form-model
        ref="formData"
        class="addModal"
        :rules="rules"
        validateOnRuleChange
        :model="formData"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="慢性病" prop="name">
              <a-input placeholder="请输入慢性病的名称" v-model="formData.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="描述" prop="describe">
              <a-textarea v-model="formData.describe" placeholder="请输入慢性病的描述" :rows="4" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="慢病资料">
              <a-upload
                v-model="formData.files"
                name="file"
                multiple
                :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane'"
                @change="value => handleChange(value)"
              >
                <!-- :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-' + formData.name" -->
                <a-button><a-icon type="upload" />上传慢病资料</a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider type="horizontal" dashed style="margin-bottom:24px">添加指标</a-divider>
        <div class="index-tip"><a-icon type="info-circle" /> 请慎重添加指标，添加后将不能删除和编辑指标</div>
        <a-row v-for="target in formData.targetArr" :key="target.id">
          <a-col>
            <a-form-model-item label="指标名">
              <a-row>
                <a-col :span="22">
                  <getChronicName
                    @changeIndex="({ id, filterAr }) => {
                      target.indexItemId = id;
                      const filter = filterAr
                      setChronicName(id, filter)
                    }"
                    :indexArr="indexArr"
                    :formData="formData"
                    :sendFilter="sendFilter"
                  />
                </a-col>
                <a-col :span="2" style="text-align: center;margin: 0 auto;">
                  <!-- <a-icon class="targetIcon" @click="addTargetArr" type="plus-circle" /> -->
                  <a-icon class="targetIcon" @click="delTargetArr(target)" type="close-circle" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col v-show="target.indexItemId">
            <a-form-model-item label="结果">
              <a-row>
                <a-col v-for="(result,index) in target.result" :key="index" class="index-result">
                  <span v-if="result.type==='range'">{{ result | getRange }}</span>
                  <span v-if="result.type==='simple'">{{ result.name }}</span>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <!-- <span style="font-size: 16px;">指标</span>
            <a-icon @click="addTargetArr" type="plus-circle" />-->
            <a-button @click="addTargetArr" type="dashed" style="display:block;margin:0 auto;width:60%">
              <a-icon type="plus" /> 添加指标
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <editChronice
      :editData="editData"
      :editVisible="editVisible"
      @closeEditModal="closeEditModal"
    />
    <GradingStandard
      :gradingVisible="gradingVisible"
      :gradingData="gradingData"
      @closeGradingModal="closeGradingModal"
      :gradingInfo="gradingInfo"
    />
    <speechChronic
      :speechVisible="speechVisible"
      @closeSpeechModal="closeSpeechModal"
      :speechData="speechData"
      :speechInfo="speechInfo"
    />
    <medicineChronic
      :medicineVisible="medicineVisible"
      @closeMedicineModal="closeMedicineModal"
      :medicineData="medicineData"
      :medicineInfo="medicineInfo"
    />
  </div>
</template>

<script>
import { getHealthIndex, getHeathLevels } from '@/api/health'
// import { getHealthIndex } from '@/api/health'
// import { addChronic as apiAddChronic, getChronic as apiGetChronic } from '@/api/chronic'
import { getChronic as apiGetChronic, addChronic as apiAddChronic, getSpeechList as apiGetSpeechList, getOneChronic as apiGetOneChronic } from '@/api/chronic'
// import { getChronic as apiGetChronic, getSpeechList as apiGetSpeechList } from '@/api/chronic'

import getChronicName from './components/HealthChronicName.vue'
import editChronice from './HealthChronicEdit.vue'
import speechChronic from './HealthChronicSpeechModal.vue'
import GradingStandard from './components/GradingStandard.vue'
import medicineChronic from './HealthChronicMedicine.vue'
import { notification } from 'ant-design-vue'
export default {
    components: {
      getChronicName,
      editChronice,
      GradingStandard,
      speechChronic,
      medicineChronic
    },
    data () {
      return {
        editData: null, // 传给编辑弹窗的数据
        editVisible: false, // 用于控制编辑弹窗
        speechData: null, // 传给话术弹窗的数据
        speechInfo: null, // 话术信息
        speechVisible: false, // 用于控制话术弹窗
        gradingVisible: false, // 控制分级弹窗
        gradingData: null, // 传给分级的数据
        gradingInfo: null, // 分级信息
        medicineData: [], // 传给药物弹窗的数据
        medicineInfo: null, // 药物信息
        medicineVisible: false, // 用于控制药物弹窗
        sendFilter: [],
        rules: {
          name: [{
            required: true, message: '请输入慢性病名', trigger: 'blur'
          }],
          describe: [{
            required: true, message: '请输入慢性病描述', trigger: 'blur'
          }]
        },
        columns: [
          {
            title: '慢性病名',
            dataIndex: 'name',
            key: 'name',
            width: 120
          },
          {
            title: '慢性病描述',
            dataIndex: 'describe',
            key: 'describe'
          },
          {
            title: '指标',
            dataIndex: 'items',
            key: 'items',
            width: '20%',
            scopedSlots: { customRender: 'items' }
          },
          {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
            width: 230,
            align: 'center'
          }
        ],
        tableData: [],
        formData: {
          name: null,
          describe: null,
          files: [],
          targetArr: []
        },
        indexArr: [
        ],
        addChronicIndexVisible: false,
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10, // 默认每页显示数量
          // showSizeChanger: true, // 显示可改变每页数量
          // pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
          showTotal: total => `共 ${total} 个慢病`, // 显示总数
          onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
          onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
        }
      }
    },
    filters: {
      getRange: function (value) {
        // 判断范围或数值
        if (value.type === 'range') {
          // 范围
          if (value.start === null) {
            // 无上界
            return `${value.name}:\t ${value.end || 'INF'} > 指标值 (${value.unit})`
          } else if (value.end === null) {
            // 无下界
            return `${value.name}:\t ${value.start || 'INF'} ≤ 指标值 (${value.unit})`
          } else {
            return `${value.name}:\t ${value.start || 'INF'} ≤ 指标值 < ${(value.end || 'INF')} (${value.unit})`
          }
        } else if (value.type === 'simple') {
        // 数值
          return value.value
        }
      }
    },
    created () {
      this.$setPageDataLoader(this.getChronic)
    },
    mounted () {
      // 获取指标
      getHealthIndex().then(res => {
        if (res.status === 200) {
          const resData = res.data
          // console.log('接口数据', resData)
          for (var i = 0; i < resData.length; i++) {
            if (resData[i].items) {
              for (var j = 0; j < resData[i].items.length; j++) {
                // console.log('指标', resData[i].items[j].name)
                const firstIndex = resData[i]
                const secondIndex = resData[i].items[j]
                this.indexArr.push({
                  category: firstIndex.name,
                  id: secondIndex.id,
                  name: secondIndex.name,
                  result: secondIndex.result,
                  type: secondIndex.type,
                  unit: secondIndex.unit
                })
              }
            }
          }
        }
      })
      this.getChronic()
    },
    methods: {
      addChronic () {
        this.addChronicIndexVisible = true
        this.resetForm()
        // console.log('新建慢病')
      },
      handleOk () {
        if (this.formData.targetArr.length === 0) {
          this.$message.warning('请添加指标')
        } else {
            this.$refs.formData.validate(valid => {
            if (valid) {
              const apiData = {
                name: this.formData.name,
                describe: this.formData.describe,
                files: this.formData.files,
                items: this.formData.targetArr
              }
              apiAddChronic(apiData).then(res => {
                if (res.status === 201) {
                  // console.log('添加慢病成功，添加的数据', apiData)
                  this.addChronicIndexVisible = false
                  this.$message.info('成功添加慢病')
                } else {
                  this.$message.err(res.message)
                }
              })
              // console.log('确定formData', this.formData)
              // this.addChronicIndexVisible = false
              // console.log('确定apiData', apiData)
            } else {
              // console.log('原版不完整')
              return false
            }
          })
        }
      },
      handleCancel () {
        this.addChronicIndexVisible = false
        // console.log('取消')
      },
      // 添加指标
      addTargetArr () {
        const item = {
          id: new Date().getTime(),
          indexItemId: null,
          // coefficient: 1,
          result: null
          // 分割
        }
        this.formData.targetArr.push(item)
      },
      // 从指定位置删除
      delTargetArr (item) {
        //  console.log(item)
        this.formData.targetArr = this.formData.targetArr.filter(i => i.id !== item.id)
        var waitArr = this.indexArr
        for (var i = 0; i < this.formData.targetArr.length; i++) {
          // console.log('1111', this.formData.targetArr[i].indexItemId)
          waitArr = waitArr.filter((item) => {
            return item.id !== this.formData.targetArr[i].indexItemId
          })
        }
        // console.log('删除过滤后', waitArr)
        // console.log('选择的指标', this.formData.targetArr)
        // console.log('全部指标', this.indexArr)
        // 将删除指标后过滤的指标传给子组件
        this.sendFilter = waitArr
      },
      resetForm () {
        // 不用nextTick会报初始化错误
        this.$nextTick(() => {
          // this.$refs.formData.resetFields()
          this.formData.name = null
          this.formData.describe = null
        })
        this.formData.files.length = 0
        this.formData.targetArr.length = 0
        this.$forceUpdate()
      },
      GradingStandard (data) {
        // console.log('gradingVisible', this.gradingVisible)
        const diseaseId = data.id
        this.gradingVisible = true
        getHeathLevels(diseaseId).then(res => {
          if (res.status === 200) {
            this.gradingInfo = data
            this.gradingData = []
            const oldLevels = res.data
            const aaa = []
            oldLevels.forEach(function (item) {
              const levelItem = {
                key: item.level,
                level: item.level + '级',
                describe: item.remark
              }
              aaa.push(levelItem)
            })
            this.gradingData = aaa
            // this.$refs.openChildModel.openModel(data)
            // this.$refs.openChildModel.getHealthLevels(res.data)
          } else {
            notification.warning({ message: '请求失败', description: res.message })
          }
        })
      },
      editChronicTable (data) {
        // 需要解除双向绑定，不然在编辑框改变数据，table里面的数据也会跟着变
        // console.log('刷新', data)
        this.editVisible = true
        this.editData = JSON.parse(JSON.stringify(data))
        // this.$refs.editChronic.openModel()
        // this.$refs.editChronic.getChronicData(data)
        // console.log('编辑', data)
      },
      refEditDate (item) {
        apiGetOneChronic(item.id).then(res => {
          if (res.status === 200) {
            // console.log(res.data)
            this.editData = res.data
          } else {
            this.$message.error(res.message)
          }
        })
        // console.log(this.tableData, '刷新', item.id)
      },
      delChronicTable (data) {
        // console.log('删除', data)
      },
      // 获取慢病表
      getChronic () {
        const pages = {
          page: this.pagination.current,
          size: this.pagination.pageSize
        }
        apiGetChronic(pages).then(res => {
          if (res.status === 200) {
            // const resData = res.data.content
            // this.tableData = resData
            this.tableData = (res.data.content || []).map(record => { return { ...record, key: record.id } })
            this.pagination.total = res.data.totalElements
          }
        })
      },
      onSizeChange (current, pageSize) {
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
        this.getChronic()
      },
      onPageChange (page, pageSize) {
        this.pagination.current = page
        this.getChronic()
      },
      setChronicName (value, filter) {
        // console.log('value', value)
        // console.log('filter', filter)
        this.sendFilter = filter
        const targetArr = this.formData.targetArr
        const indexArr = this.indexArr
        // console.log('结果', targetArr)
        // console.log('指标', this.indexArr)
        // console.log('sendFilter', this.sendFilter)
        for (var j = 0; j < indexArr.length; j++) {
          if (indexArr[j].id === value) {
            for (var i = 0; i < targetArr.length; i++) {
              if (targetArr[i].indexItemId === value) {
                const result = indexArr[j].result
                targetArr[i].result = result
              }
            }
          }
        }
      },
      openSpeechModal (data) {
        this.speechInfo = data
        // console.log('话术', data)
        const diseaseId = data.id
        apiGetSpeechList(diseaseId).then(res => {
          if (res.status === 200) {
            // console.log('话术列表', res.data)
            this.speechData = res.data
            this.speechVisible = true
          } else {
            this.$message.error('获取失败')
          }
        })
      },
      closeSpeechModal () {
        this.speechVisible = false
      },
      closeGradingModal () {
        this.gradingVisible = false
      },
      closeEditModal () {
        this.editVisible = false
      },
      handleChange (item) {
        if (item.file.status === 'done') {
          // console.log('上传的', item.file)
          this.formData.files.push(item.file.response.data)
          // console.log('上传成功', this.formData.files)
        } else if (item.file.status === 'error') {
          // console.log('上传失败', this.formData.files)
        } else if (item.file.status === 'removed') {
          const newArr = []
          for (let i = 0; i < this.formData.files.length; i++) {
            for (let j = 0; j < item.fileList.length; j++) {
              if (this.formData.files[i].fileName === item.fileList[j].name) {
                newArr.push(this.formData.files[i])
              }
            }
          }
          this.formData.files = newArr
          // console.log('删除成功', this.formData.files)
        }
      },
      openMedicineModal (data) {
        this.medicineInfo = data
        this.medicineData = data.medicines
        this.medicineVisible = true
        // console.log('medicineData', this.medicineData)
        // console.log('medicineInfo', data)
      },
      closeMedicineModal () {
        this.medicineVisible = false
      }
    }
}
</script>
<style scoped>
.ant-divider-horizontal{
  margin: 1px
}
.targetIcon{
  width: 18px;
  height: 18px;
  margin-top: 10px;
  margin-left: 12px;
  color: #999;
}
/* .ant-card-body{
  padding: 10px;
} */
.chronicTable{
  background-color: white;
  padding: 0 20px;
}
.index-result{
  color: #999;
  line-height: 22px;
  font-size: 12px;
}
.index-tip{
  text-align: center;
  margin-bottom: 20px;
  color: rgb(228, 152, 11);
  font-size: 17px;
  letter-spacing: 0.1em;
}
.chronicItem{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
</style>
