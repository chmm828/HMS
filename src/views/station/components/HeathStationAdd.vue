<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
      <a-form-model-item label="小站名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入小站名称"/>
      </a-form-model-item>
      <a-form-model-item label="小站位置" prop="address">
        <!-- 地图容器 -->
        <div class="mapBox">
          <MapContainer @selectAddress="getAddress" :formData="form"/>
        </div>
      </a-form-model-item>
      <a-form-model-item label="小站地址" prop="address">
        <a-input v-model="form.address" placeholder="选择小站位置自动生成地址"/>
      </a-form-model-item>
      <a-form-model-item label="小站电话" prop="phone">
        <a-input v-model="form.phone" placeholder="请输入小站电话" />
      </a-form-model-item>
      <!-- <a-form-model-item label="小站成立日期">
        <a-date-picker
          v-model="form.date1"
          show-time
          type="date"
          placeholder="请选择小站成立日期"
          style="width: 100%;"
        />
      </a-form-model-item> -->
      <a-form-model-item label="营业状态" prop="type">
        <a-radio-group v-model="form.type" button-style="solid">
          <a-radio-button value="STATION">健康小站</a-radio-button>
          <a-radio-button value="EXAMINATION">体检中心</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="营业状态" prop="stationStatus">
        <a-radio-group v-model="form.stationStatus" class="stationStatus">
          <a-radio value="OPEN">营业中</a-radio>
          <a-radio value="CLOSED">休息中</a-radio>
          <a-radio value="DISABLED">暂停</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="小站介绍">
        <a-input v-model="form.remark" type="textarea" placeholder="请输入小站介绍" />
      </a-form-model-item>
      <a-divider v-if="this.stationId">小站人员</a-divider>
      <a-form-model-item label="小站店长" prop="stationmaster" v-if="this.stationId">
        <a-select v-model="form.stationmaster" placeholder="请选择小站店长" @change="changeManage">
          <a-select-option v-for="item in managers" :key="item.index" :value="item.id">
            {{ item.nickname }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="健康师人员" v-if="this.stationId">
        <a-checkbox-group v-model="form.doctors">
          <span v-for="item in doctors" :key="item.index">
            <span v-if="item.status === 'active'">
              <a-checkbox @change="changeDoctor" :value="item.id" style="width:120px;">
                {{ item.nickname }}
              </a-checkbox>
            </span>
          </span>
        </a-checkbox-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getUserList } from '@/api/manage'
import MapContainer from './MapContainer.vue'
import { addStation, editstation, addManager, addDoctors, deleteDoctor } from '@/api/station'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    stationId: {
      type: Number,
      default: null
    },
    stationInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    successAddStation: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  components: {
    MapContainer
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        adcode: '', // 地区区号
        stationmaster: '',
        phone: '',
        type: '',
        doctors: [],
        stationStatus: '',
        remark: '',
        manageChanged: false // 管理员是否改变
      },
      doctors: [],
      managers: [],
      rules: {
        name: [{ required: true, message: '请输入小站名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入小站地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入小站联系电话', trigger: 'blur' }],
        stationmaster: [{ required: true, message: '请选择小站管理员', trigger: 'change' }],
        type: [{ required: true, message: '请选择小站类型', trigger: 'change' }],
        stationStatus: [{ required: true, message: '请选择营业状态', trigger: 'change' }]
      },
      title: '新增小站'
    }
  },
  mounted () {
    if (this.stationId) {
      this.getUser()
      this.title = '编辑小站'
      console.log('this.stationInfo', this.stationInfo)
      this.form.name = this.stationInfo.name
      this.form.address = this.stationInfo.address
      this.form.latitude = this.stationInfo.latitude
      this.form.longitude = this.stationInfo.longitude
      this.form.phone = this.stationInfo.phone
      this.form.doctors = this.stationInfo.doctors.map(item => {
        return item.id
      })
      this.form.stationmaster = this.stationInfo.manager.nickname
      this.form.remark = this.stationInfo.remark
      this.form.stationStatus = this.stationInfo.status
      this.form.type = this.stationInfo.type
    }
  },
  methods: {
    getAddress (data) {
      this.form.address = data.address
      this.form.latitude = data.lat
      this.form.longitude = data.lng
      this.form.adcode = data.adcode
      console.log('data', this.form)
    },
    handleOk () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
          const apiForm = {}
          apiForm.name = form.name
          apiForm.address = form.address
          apiForm.longitude = form.longitude
          apiForm.latitude = form.latitude
          apiForm.phone = form.phone
          apiForm.remark = form.remark
          apiForm.status = form.stationStatus
          apiForm.type = form.type
          // apiForm.manager.nickname = form.stationmaster
          const manager = { managerId: '' }
          manager.managerId = form.stationmaster
          if (this.manageChanged) {
            addManager(this.stationId, manager).then(res => {
              console.log('manager', res)
            })
          }
          this.postForm(apiForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeManage () {
      this.manageChanged = true
    },
    changeDoctor (e) {
      const doctors = { doctorIds: [] }
      // doctors.doctorIds = JSON.parse(JSON.stringify(this.form.doctors))
      doctors.doctorIds.push(e.target.value)
      if (e.target.checked) {
        addDoctors(this.stationId, doctors).then(res => {
          if (res.status === 200) {
            this.$message.success('成功添加新成员')
          }
        })
      } else {
        deleteDoctor(this.stationId, e.target.value).then(res => {
          if (res.status === 200) {
            this.$message.warning('已移除该成员')
          }
        })
      }
    },
    // 提交表单
    async postForm (apiForm) {
      if (this.stationId) {
        console.log('apiFormapiForm', apiForm)
        const res = await editstation(this.stationId, apiForm)
        if (res.status === 200) {
          this.$message.success('修改成功')
          this.$emit('successAddStation')
        }
      } else {
        const res = await addStation(apiForm)
        if (res.status === 201) {
          this.$message.success('小站创建成功')
          this.$emit('successAddStation')
        }
      }
    },
    handleCancel () {
      this.$emit('successAddStation')
    },
    // 获取所有健康师账号
    async getUser () {
      const res = await getUserList({ page: 1, size: 100 })
      if (res.status === 200) {
        this.doctors = res.data.content
        this.managers = this.doctors.filter(item => {
          return item.roleName === 'Manager'
        })
      }
    }
  }
}
</script>

<style>
.stationStatus .ant-radio-wrapper{
  margin: 10px 16px;
}
.mapBox{
  border: 1px solid #ddd;
  width: 100%;
  height: 280px;
  background: #eee;
}

</style>
