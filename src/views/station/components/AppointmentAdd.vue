<template>
  <a-modal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
      <a-form-model-item label="预约用户" prop="name">
        <a-select v-model="form.name" placeholder="请选择用户" @change="changeName">
          <a-select-option v-for="item in customers" :key="item.id" :value="item.id">
            {{ item.nickname }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- <a-form-model-item label="用户电话" prop="phone">
        <a-input v-model="form.phone" placeholder="请输入用户电话"/>
      </a-form-model-item> -->
      <a-form-model-item label="预约日期">
        <a-date-picker
          :disabled-date="disabledDate"
          format="YYYY-MM-DD HH:mm"
          v-model="form.date1"
          :show-time="{ format: 'YYYY-MM-DD HH mm' }"
          type="date"
          placeholder="请选择预约日期"
          style="width: 100%;"
        />
      </a-form-model-item>
      <a-form-model-item label="预约项目" prop="stationType">
        <a-radio-group v-model="form.stationType" button-style="solid" @change="changeProject">
          <a-radio-button value="STATION">小站预约</a-radio-button>
          <a-radio-button value="EXAMINATION">体检预约</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="预约地点" prop="address">
        <a-select v-model="form.address" placeholder="请选择小站" @change="changeStation">
          <a-select-option v-for="item in filterStations" :key="item.index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="预约备注">
        <a-input v-model="form.remark" type="textarea" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getStations, addAppointment, putAppointment } from '@/api/station'
import { getChronic } from '@/api/customer'
import moment from 'moment'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    bookingId: {
      type: Number,
      default: null
    },
    appointmentInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    successAppointment: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        // phone: '',
        date1: '',
        stationType: '',
        address: '',
        remark: ''
      },
      stations: [],
      customers: [],
      filterStations: [],
      rules: {
        name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        // phone: [{ required: true, message: '请输入用户电话', trigger: 'blur' }],
        address: [{ required: true, message: '请选择预约地点', trigger: 'change' }],
        stationType: [{ required: true, message: '请选择预约项目', trigger: 'change' }]
      },
      title: '新增预约',
      stationId: null,
      customerId: null,
      status: 'UNEXECUTED'
    }
  },
  mounted () {
    this.loadData()
    if (this.bookingId) {
      console.log('this.appointmentInfo', this.appointmentInfo)
      this.title = '编辑预约信息'
      this.form.name = this.appointmentInfo.customer.nickname
      this.form.address = this.appointmentInfo.healthStation.name
      this.form.date1 = this.appointmentInfo.bookingDate
      this.form.stationType = this.appointmentInfo.type
      this.form.remark = this.appointmentInfo.remark
      this.customerId = this.appointmentInfo.customer.id
      this.stationId = this.appointmentInfo.healthStation.id
      this.status = this.appointmentInfo.status
    }
  },
  methods: {
    async loadData () {
      const res = await getStations()
      if (res.status === 200) {
        this.stations = res.data
      }
      const pages = {
        page: 1,
        size: 100
      }
      const resp = await getChronic(pages)
      if (resp.status === 200) {
        this.customers = resp.data.content
      }
    },
    handleOk () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const payload = {}
          payload.customerId = this.customerId
          payload.bookingTime = this.form.date1
          payload.remark = this.form.remark
          payload.type = this.form.stationType
          payload.status = this.status
          if (this.bookingId) {
            putAppointment(this.stationId, this.bookingId, payload).then(res => {
              if (res.status === 200) {
                this.$message.success('更新成功')
                this.$emit('successAppointment')
              }
            })
          } else {
            addAppointment(this.stationId, payload).then(res => {
              if (res.status === 200) {
                this.$message.success('新增预约成功')
                this.$emit('successAppointment')
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel () {
      this.$emit('closeAppointment')
    },
    changeProject (e) {
      this.filterStations = this.stations.filter(item => {
        if (item.type === e.target.value) { return true }
      })
      this.form.address = ''
    },
    changeStation (e) {
      this.stationId = e
    },
    changeName (e) {
      this.customerId = e
    },
    disabledDate (current) {
      // Can not select days before today
      return current && current < moment().subtract(1, 'day')
    }
  }
}
</script>

<style>

</style>
