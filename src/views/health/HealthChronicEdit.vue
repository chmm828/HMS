<template>
  <div>
    <a-modal
      :visible="editVisible"
      v-if="editVisible"
      :title="'编辑慢病【'+editData.name+'】'"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="700"
    >
      <a-form-model :model="editData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="慢性病" prop="name">
              <a-input v-model="editData.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="描述" prop="describe">
              <a-textarea v-model="editData.describe" placeholder="慢性病描述" :rows="4" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="慢病资料">
              <!-- <span>{{ editData.files || '暂无资料' }}</span> -->
              <div v-for="(file, index) in editData.files" :key="index">
                <a :href="file.url" target="_blank">{{ file.fileName }}</a>
              </div>
              <div class="upload_tip"><a-icon type="info-circle" />上传资料将覆盖原有资料</div>
              <a-upload
                name="file"
                multiple
                :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-'"
                @change="value => handleChange(value)"
              >
                <a-button><a-icon type="upload" />上传慢病资料</a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider type="horizontal" dashed style="margin-bottom:24px"/>
        <a-row v-for="target in editData.items" :key="target.indexItem.id">
          <a-col>
            <a-form-model-item label="指标名">
              <a-row>
                <a-col :span="22">
                  <a-select :disabled="!target.timeid" v-model="target.indexItem.id" show-search :filterOption="filterOption">
                    <a-select-option v-for="item in indexArr" :key="item.id">
                      {{ item.name }} - <span style="font-size: 11px; color: #999">({{ item.category }})</span>
                    </a-select-option>
                  </a-select>
                </a-col>
                <!-- <a-col :span="2" v-show="target.timeid">
                  <a-icon @click="delEdit(target)" type="close-circle" />
                </a-col> -->
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="结果">
              <a-row>
                <a-col v-for="(result,index) in target.indexItem.result" :key="index" class="index-result">
                  <span v-if="result.type==='range'">{{ result | getRange() }}</span>
                  <span v-if="result.type==='simple'">{{ result.name }}</span>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row>
          <a-col :span="22">
            <a-button @click="addEdit" type="dashed" style="display:block;margin:0 auto;width:60%">
              <a-icon type="plus" /> 添加指标
            </a-button>
          </a-col>
        </a-row> -->
        <a-row v-if="newIndex.length">
          <a-col>
            <a-form-model-item label="新增指标名">
              <a-row>
                <a-col :span="22">
                  <a-select @change="selectIndex" v-model="newIndex[0].indexItem.id" show-search :filterOption="filterOption">
                    <a-select-option v-for="item in indexArr" :key="item.id">
                      {{ item.name }} - <span style="font-size: 11px; color: #999">({{ item.category }})</span>
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="2">
                  <a-icon @click="delNewIndex" type="close-circle" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="newIndex.length">
          <a-col :span="4" :push="10">
            <a-button @click="okIndex">确定</a-button>
          </a-col>
        </a-row>
        <a-row v-if="!newIndex.length">
          <a-col :span="24">
            <a-button @click="addIndex" type="dashed" style="display:block;margin:0 auto;width:60%">
              <a-icon type="plus" /> 添加指标，<span class="index_tip"><a-icon type="info-circle" />指标添加后不能删除</span>
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getHealthIndex } from '@/api/health'
import { editChronic as apiEditChronic, editChronicIndex as apiEditChronicIndex } from '@/api/chronic'
// import { editChronicIndex as apiEditChronicIndex } from '@/api/chronic'

export default {
  props: {
    editVisible: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  filters: {
    getRange: function (value) {
      // 范围或数值
      if (value.type === 'range') {
        if (value.start === null) {
          return `${value.name}:\t ${value.end * 1 || 'INF'} > 指标值 (${value.unit})`
        } else if (value.end === null) {
          return `${value.name}:\t ${value.start * 1 || 'INF'} ≤ 指标值 (${value.unit})`
        } else {
          return `${value.name}:\t ${value.start * 1 || 'INF'} ≤ 指标值 < ${value.end * 1 || 'INF'} (${value.unit})`
        }
      } else if (value.type === 'simple') {
      // 数值
        return value.value
      }
    }
  },
  data () {
    return {
      // editVisible: false,
      indexArr: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      loadList: [],
      fiterArr: [],
      newIndex: []
    }
  },
  mounted () {
    // console.log('进入编辑')
    getHealthIndex().then(res => {
      if (res.status === 200) {
        const resData = res.data
        // console.log('接口数据', resData)
        for (var i = 0; i < resData.length; i++) {
          if (resData[i].items) {
            // console.log('指标', resData[i].items)
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
      //   console.log('指标', this.indexArr)
      }
    })
  },
  methods: {
    handleOk () {
      const apiData = this.editData
      // console.log('this.loadList', this.loadList)
      if (this.loadList.length !== 0) {
        apiData.files = this.loadList
      }
      // console.log(this.editData)
      // console.log('apiData', apiData)
      const diseaseId = apiData.id
      apiEditChronic(diseaseId, apiData).then(res => {
        if (res.status === 200) {
          // console.log('编辑成功')
          this.$message.info('成功编辑慢病')
          this.$parent.getChronic() // 编辑后触发父组件刷新
          // this.$parent.closeEditModal()
          this.loadList = []
          this.$emit('closeEditModal')
          // this.editVisible = false
        } else {
          this.$message.error(res.message)
        }
      })
      // console.log('确定', this.editData)
      // console.log('确定', this.newIndex)
    },
    handleCancel () {
      // this.editVisible = false
      this.loadList = []
      this.$emit('closeEditModal')
      // console.log('取消')
    },
    // 将输入的内容与显示的内容进行匹配
    filterOption (value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },
    addEdit () {
      // console.log(this.editData, '11')
      const item = {
        timeid: new Date().getTime(),
        indexItem: {
          id: null,
          result: null
        }
      }
      this.editData.items.push(item)
    },
    addIndex () {
      const item = {
        timeid: new Date().getTime(),
        indexItem: {
          id: null,
          result: null
        }
      }
      this.newIndex.push(item)
      // console.log(this.newIndex.length, 'newIndex', this.newIndex)
    },
    delNewIndex () {
      this.newIndex.length = 0
      this.$forceUpdate()
      // console.log(this.newIndex.length, '11', this.newIndex)
    },
    okIndex () {
      const diseaseId = this.editData.id
      const apiData = {
        indexItemId: this.newIndex[0].indexItem.id,
        coefficient: 0
       }
      apiEditChronicIndex(diseaseId, apiData).then(res => {
        if (res.status === 201) {
          this.$message.info('编辑慢病指标成功')
          this.newIndex.length = 0
          this.$parent.getChronic() // 编辑后触发父组件刷新
          this.$parent.refEditDate(this.editData)
          // console.log('数据', this.editData)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleChange (item) {
      if (item.file.status === 'done') {
        // console.log('上传成功', item.file)
        this.loadList.push(item.file.response.data)
      } else if (item.file.status === 'error') {
        // console.log('上传失败')
      } else if (item.file.status === 'removed') {
        const newArr = []
        for (let i = 0; i < this.loadList.length; i++) {
          for (let j = 0; j < item.fileList.length; j++) {
            if (this.loadList[i].fileName === item.fileList[j].name) {
              newArr.push(this.loadList[i])
            }
          }
        }
        this.loadList = newArr
        // console.log('删除成功', this.loadList)
      }
    },
    delEdit (item) {
        // console.log(item)
       this.editData.items = this.editData.items.filter(i => i.indexItem.id !== item.indexItem.id)
    },
    selectIndex (value) {
      // console.log('选择', value)
      // console.log('indexArr', this.indexArr)
      this.fiterArr = this.indexArr
      // let indexArr = this.indexArr
      // for (let i = 0; i < indexArr.length; i++) {
      //   if (value === indexArr[i].id) {
      //     console.log(indexArr[i].name)
      //   }
      // }
      this.fiterArr = this.fiterArr.filter(i => i.id !== value)
      // console.log('fiterArr', this.fiterArr)
    }
  }
}
</script>
<style scoped>
.index-result{
  color: #999;
  line-height: 22px;
  font-size: 12px;
}
.upload_tip{
  color: rgb(228, 152, 11);
  font-size: 17px;
}
.index_tip{
  color: rgb(228, 152, 11);
}
</style>
