<template>
  <div>
    <a-modal
      :visible="speechVisible"
      v-if="speechVisible"
      :title="'编辑话术【'+speechInfo.name+'】'"
      @ok="speechHandleOk"
      @cancel="speechHandleCancel"
      :width="1100"
    >
      <!-- 模板示例 -->
      <div class="template_example">
        <div class="template_title">模板示例:</div>
        <div>
          身高为<span class="check_variable">${身高}</span>cm,体重为<span class="check_variable">${体重}</span>kg <span class="check_variable">&nbsp;>>>>>>&nbsp;</span> 身高为170cm,体重为50kg
        </div>
        <div>模板可选变量:
          <a-tag color="blue" class="">${身高}</a-tag>
          <a-tag color="blue" class="">${体重}</a-tag>
        </div>
        <!-- <div>可用后面的代码组合自动获取用户的指标,点击标签可添加至模板中</div> -->
        <div>可用后面的代码组合自动获取用户的指标</div>
      </div>

      <a-card class="speech_card" v-for="item in formData" :key="item.id" :title="'等级'+item.level+'话术模板'">
        <a-tabs type="card">
          <a-tab-pane key="1" tab="生活指导">
            <a-textarea
              :id="item.id+'lifeTemplate'"
              v-model="item.lifeTemplate.templateText"
              placeholder="请编辑生活话术模板"
              :auto-size="{ minRows: 3, maxRows: 10 }"
            />
          </a-tab-pane>
          <a-tab-pane key="2" tab="运动指导">
            <a-textarea
              :id="item.id+'sportTemplate'"
              v-model="item.sportTemplate.templateText"
              placeholder="请编辑运动话术模板"
              :auto-size="{ minRows: 3, maxRows: 10 }"
            />
          </a-tab-pane>
          <a-tab-pane key="3" tab="饮食指导">
            <a-textarea
              :id="item.id+'dietTemplate'"
              v-model="item.dietTemplate.templateText"
              placeholder="请编辑饮食话术模板"
              :auto-size="{ minRows: 3, maxRows: 10 }"
            />
          </a-tab-pane>
        </a-tabs>
        <div class="check_variable_list">
          模板可选变量:
          <!-- <a-tag color="blue" class="" @click="addTmp(item,variable)" v-for="variable in variablesArr" :key="variable.targetId"> {{ variable.name }} </a-tag> -->
          <a-tag color="blue" class="" v-for="variable in variablesArr" :key="variable.targetId"> {{ variable.name }} </a-tag>
        </div>
      </a-card>
    </a-modal>
  </div>
</template>
<script>
import { editSpeech as apiEditSpeech, getSpeechVariables as apiGetSpeechVariables } from '@/api/chronic'
// import { editSpeech as apiEditSpeech } from '@/api/chronic'
// import { getSpeechVariables as apiGetSpeechVariables } from '@/api/chronic'
export default {
  props: {
    speechVisible: {
      type: Boolean,
      default: false
    },
    speechData: {
      type: Array,
      default: function () {
        return []
      }
    },
    speechInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      formData: this.speechData, // 用于展示
      variablesArr: [] // 可选变量
    }
  },
  methods: {
    speechHandleOk () {
      // 校验
      // console.log('传进来的', this.formData)
      var haveArr = [] // 慢病拥有的变量
      // console.log('慢病拥有的变量', haveArr)
      // 保存慢病可选变量
      var checkArr = this.variablesArr.map(item => {
          return item.name
      })
      // console.log('保存慢病可选变量', checkArr)
      // 新方法
      this.formData.forEach(item => {
        // console.log('lifeTemplate', item.lifeTemplate.templateText)
        if (item.lifeTemplate.templateText !== '' && item.lifeTemplate.templateText !== null) {
          const cutArr1 = item.lifeTemplate.templateText
          // // 校验规则
          if (cutArr1.match(/\$\{\}|\$\{[\u20-\u9fa5]+\}/g)) {
            const cutArr2 = [...cutArr1.match(/\$\{\}|\$\{[\u20-\u9fa5]+\}/g)]
            haveArr = haveArr.concat(cutArr2)
          }
        }
        if (item.dietTemplate.templateText !== '' && item.dietTemplate.templateText !== null) {
          const cutArr1 = item.dietTemplate.templateText
          // // 校验规则
          if (cutArr1.match(/\$\{\}|\$\{[\u20-\u9fa5]+\}/g)) {
            const cutArr2 = [...cutArr1.match(/\$\{\}|\$\{[\u20-\u9fa5]+\}/g)]
            haveArr = haveArr.concat(cutArr2)
          }
        }
        if (item.sportTemplate.templateText !== '' && item.sportTemplate.templateText !== null) {
          const cutArr1 = item.sportTemplate.templateText
          // // 校验规则
          if (cutArr1.match(/\$\{\}|\$\{[\u20-\u9fa5]+\}/g)) {
            const cutArr2 = [...cutArr1.match(/\$\{\}|\$\{[\u20-\u9fa5]+\}/g)]
            haveArr = haveArr.concat(cutArr2)
          }
        }
      })
      // 新方法
      const resultArr = [] // 保存结果
      // console.log('haveArr', haveArr)
      haveArr.filter(item => {
        resultArr.push(checkArr.includes(item)) // includes 判断一个数组中是否包含某一个元素，有则返回true，没有返回false
      })
      // console.log('结果', resultArr)
      var checkIndex = true // 最终判定，一假即假
      for (var j = 0; j < resultArr.length; j++) {
        if (resultArr[j] === false) {
          checkIndex = false
          break
        } else {
          checkIndex = true
        }
      }
      // 满足校验
      if (checkIndex) {
        const diseaseId = this.speechInfo.id
        const apiData = this.formData.map((item) => {
          const temporaryData = {
            level: item.level,
            dietTemplate: {
              templateText: item.dietTemplate.templateText
            },
            lifeTemplate: {
              templateText: item.lifeTemplate.templateText
            },
            sportTemplate: {
              templateText: item.sportTemplate.templateText
            }
          }
          return temporaryData
        })
        const templates = {}
        templates.templates = apiData
        // console.log('确定formData', apiData)
        apiEditSpeech(diseaseId, templates).then(res => {
          if (res.status === 200) {
            this.$message.info('编辑话术成功')
            this.$emit('closeSpeechModal')
          } else {
            this.$message.error('编辑失败')
          }
        })
        // console.log('传给后端', templates)
      } else {
        this.$message.error('使用错误的模板变量，请修改模板')
      }
      // 校验
    },
    speechHandleCancel () {
      this.$emit('closeSpeechModal')
    },
    // 获取话术变量
    getSpeechVariables (diseaseId) {
      apiGetSpeechVariables(diseaseId).then(res => {
        if (res.status === 200) {
          // console.log('变量', res.data)
          this.variablesArr = res.data
        }
      })
    },
    addTmp (item, check) {
      // console.log(item, check.name)
      const tmpText = item.lifeTemplate.templateText
      const test = document.getElementById(item.id + 'lifeTemplate')
      // console.log('test', test.selectionStart)
      item.lifeTemplate.templateText = tmpText.slice(0, test.selectionStart) + check.name + tmpText.slice(test.selectionEnd)
      // console.log('endDom', test.selectionStart, 'offset', test.selectionEnd)
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    // 处理数组
    speechData () {
      this.formData = this.speechData
      // console.log('formData', this.formData)
      // this.formData.forEach(item => {
      //   // console.log(item)
      //   if (!item.template) {
      //     const objData = {
      //       templateText: '',
      //       templateVariables: ''
      //     }
      //     item.template = objData
      //   }
      // })
    },
    speechInfo () {
      // console.log('info', this.speechInfo.id)
      const diseaseId = this.speechInfo.id
      this.getSpeechVariables(diseaseId)
    }
  }
}
</script>
<style lang="less" scoped>
.template_title{
  font-size: 16px;
  font-weight: 600;
}
.speech_card{
  margin: 20px 0;
}
.check_variable_list{
  margin-top: 10px;
}
.check_variable{
  color: blue;
}
.template_example{
  line-height: 25px;
  opacity: 0.75
}
/deep/.ant-card-body{
  padding: 16px;
  background-color: #fafafa;
}
/deep/.ant-card-head{
  padding: 0 16px;
  background-color: #f0f0f0;
}
</style>
