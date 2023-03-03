<template>
  <div>
    <a-modal
      :visible="addVisible"
      v-if="addVisible"
      :title="mode === 'edit' ? '编辑药物' : '新建药物'"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="1000"
      :maskClosable="false"
    >
      <div>
        <a-form-model :model="medicineData" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules" ref="ruleForm">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="药物名" prop="name">
                <a-input v-model="medicineData.name" placeholder="输入药物名"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="药物类别" prop="type">
                <a-input v-model="medicineData.type" placeholder="输入药物类别"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="使用剂量" prop="dosage">
                <a-row>
                  <a-col :span="8">
                    <a-input addonAfter="次" v-model="medicineData.frequency"></a-input>
                  </a-col>
                  <a-col :span="1">
                    <span style="width: 5%; text-align: center; line-height: 2; margin-left: 3px" >/</span>
                  </a-col>
                  <a-col :span="4">
                    <a-select style="padding-top: 5px;" v-model="medicineData.unit">
                      <a-select-option value="年">年</a-select-option>
                      <a-select-option value="月">月</a-select-option>
                      <a-select-option value="周">周</a-select-option>
                      <a-select-option value="日">日</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="10">
                    <a-input addonBefore="每次" v-model="medicineData.dosage"></a-input>
                  </a-col>
                </a-row>
                <!-- <span style="width: 5%; text-align: center; line-height: 2">/</span> -->
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" :pull="3">
              <a-form-model-item label="不良反应">
                <a-textarea v-model="medicineData.sideEffect" :auto-size="{ minRows: 3, maxRows: 21 }" :maxLength="1000" placeholder="输入不良反应"></a-textarea>
                <span v-if="medicineData.sideEffect" style="position: relative;float: right;">{{ medicineData.sideEffect.length }}/1000</span>
                <span v-else style="position: relative;float: right;">0/1000</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" :pull="3">
              <a-form-model-item label="禁忌">
                <a-textarea v-model="medicineData.taboo" :auto-size="{ minRows: 3, maxRows: 21 }" :maxLength="1000" placeholder="输入禁忌"></a-textarea>
                <span v-if="medicineData.taboo" style="position: relative;float: right;">{{ medicineData.taboo.length || 0 }}/1000</span>
                <span v-else style="position: relative;float: right;">0/1000</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" :pull="3">
              <a-form-model-item label="注意事项">
                <a-textarea v-model="medicineData.attention" :auto-size="{ minRows: 3, maxRows: 21 }" :maxLength="1000" placeholder="输入注意事项"></a-textarea>
                <span v-if="medicineData.attention" style="position: relative;float: right;">{{ medicineData.attention.length }}/1000</span>
                <span v-else style="position: relative;float: right;">0/1000</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" :pull="3">
              <a-form-model-item label="备注">
                <a-textarea v-model="medicineData.remark" :auto-size="{ minRows: 3, maxRows: 21 }" :maxLength="1000" placeholder="输入备注"></a-textarea>
                <span v-if="medicineData.remark" style="position: relative;float: right;">{{ medicineData.remark.length }}/1000</span>
                <span v-else style="position: relative;float: right;">0/1000</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" :pull="3">
              <a-form-model-item label="漏服用法">
                <a-textarea v-model="medicineData.missUse" :auto-size="{ minRows: 3, maxRows: 21 }" :maxLength="500" placeholder="输入漏服用法"></a-textarea>
                <span v-if="medicineData.missUse" style="position: relative;float: right;">{{ medicineData.missUse.length }}/500</span>
                <span v-else style="position: relative;float: right;">0/500</span>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { addMedicineItem as apiAddMedicineItem, editMedicineItem as apiEditMedicineItem } from '@/api/medicine'
export default {
  props: {
    addVisible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: ' '
    },
    goalName: {
      type: String,
      default: ''
    },
    medicineData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  name: 'APP',
  data () {
    var checkDosage = (rule, value, callback) => {
      // console.log('medicineData', this.medicineData)
      if (this.medicineData.unit && this.medicineData.frequency) {
        callback()
      } else {
        callback(new Error('请输入剂量'))
      }
    }
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      rules: {
        name: [
          { required: true, message: '请输入药物名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入药物名', trigger: 'blur' }
        ],
        dosage: [
          { required: true, message: '请输入剂量', trigger: 'blur' },
          { validator: checkDosage, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleOk () {
      if (this.mode === 'add') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const apiData = {
              name: this.medicineData.name,
              type: this.medicineData.type,
              unit: this.medicineData.unit,
              usage: this.medicineData.usage || '',
              dosage: this.medicineData.dosage,
              frequency: this.medicineData.frequency || '',
              sideEffect: this.medicineData.sideEffect || '',
              taboo: this.medicineData.taboo || '',
              attention: this.medicineData.attention || '',
              remark: this.medicineData.remark || '',
              missUse: this.medicineData.missUse || ''
            }
            apiAddMedicineItem(this.goalName, apiData).then(res => {
              if (res.status === 201) {
                // console.log('成功', res)
                this.$message.info('添加药物成功')
                this.$emit('closeAddModal')
                this.$parent.updateMedicine()
              } else {
                this.$message.error('失败，' + res.message)
              }
            })
            // console.log(this.goalName, '验证通过', apiData)
          } else {
            // console.log('验证未通过')
          }
        })
      } else if (this.mode === 'edit') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const apiData = {
              name: this.medicineData.name,
              type: this.medicineData.type,
              unit: this.medicineData.unit,
              usage: this.medicineData.usage || '',
              dosage: this.medicineData.dosage,
              frequency: this.medicineData.frequency || '',
              sideEffect: this.medicineData.sideEffect || '',
              taboo: this.medicineData.taboo || '',
              attention: this.medicineData.attention || '',
              remark: this.medicineData.remark || '',
              missUse: this.medicineData.missUse || ''
            }
            apiEditMedicineItem(this.goalName, this.medicineData.id, apiData).then(res => {
              if (res.status === 200) {
                // console.log('成功', res)
                this.$message.info('编辑药物成功')
                this.$emit('closeAddModal')
                this.$parent.updateMedicine()
              } else {
                this.$message.error('失败，' + res.message)
              }
            })
            // console.log('验证通过', apiData)
          } else {
            // console.log('验证未通过')
          }
        })
      }
    },
    handleCancel () {
      // console.log('取消')
      this.$emit('closeAddModal')
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>

</style>
