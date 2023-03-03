<template>
  <a-modal
    title="编辑设备"
    :visible="editVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="600"
  >
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm" :rules="rules">
      <a-form-model-item label="设备编号" prop="number">
        <a-input v-model="form.number" />
      </a-form-model-item>
      <a-form-model-item label="设备名称" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="设备型号" prop="model">
        <a-input v-model="form.model" />
      </a-form-model-item>
      <a-form-model-item label="设备状态" prop="status">
        <a-radio-group v-model="form.stationStatus" class="stationStatus">
          <a-radio value="OPEN">启用</a-radio>
          <a-radio value="CLOSED">检修</a-radio>
          <a-radio value="DISABLED">退休</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="厂商">
        <a-input v-model="form.manufacturer" />
      </a-form-model-item>
      <a-form-model-item label="设备日期">
        <a-row>
          <!-- <a-col :span="6"></a-col> -->
          <a-col :span="12">
            <a-date-picker
              v-model="form.enableTime"
              type="date"
              placeholder="设备启用日期"
              style="width: 100%;"
            />
          </a-col>
          <a-col :span="12">
            <a-date-picker
              v-model="form.productionTime"
              type="date"
              placeholder="设备生产日期"
              style="width: 100%;"
            />
          </a-col>
        </a-row>
      </a-form-model-item>
      <!-- <a-form-model-item label="设备生产日期"> -->
      <!-- </a-form-model-item> -->
      <a-form-model-item label="备注">
        <a-input v-model="form.remark" type="textarea" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    equipmentData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted () {
    if (this.equipmentData) {
      this.form = this.equipmentData
    }
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        number: '',
        status: '',
        name: '',
        model: '',
        enableTime: '',
        productionTime: '',
        manufacturer: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        model: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        status: [{ required: true, message: '请选择设备状态', trigger: 'change' }]
      }
    }
  },
  methods: {
    handleOk () {
      this.$emit('closeEditModel')
    },
    handleCancel () {
      this.$emit('closeEditModel')
    }
  }
}
</script>

<style>

</style>
