<template>
  <a-card :bordered="false">
    <div style="padding-bottom: 8px">
      <a-button type="primary" @click="openProjectModal('create')" style="margin-right: 12px"> 新建指标项目 </a-button>
      <a-button type="primary" @click="openProjectModal('edit')" style="margin-right: 12px"> 编辑{{ ProjectName() }}项目名称 </a-button>
      <a-button type="primary" @click="openModal('create')" style="margin-right: 12px; float: right"> 新建{{ ProjectName() }}指标条目 </a-button>
    </div>
    <a-tabs v-model="currentTabKey">
      <a-tab-pane v-for="tab in data" :key="tab.id" :tab="tab.name" >
        <!-- <div style="padding-bottom: 42px">
          <a-button style="float: right" type="primary"> 新建{{ tab.name }}指标 </a-button>
        </div> -->
        <a-table
          :scroll="{ x: 600 }"
          row-key="id"
          size="small"
          :columns="columns"
          :data-source="tab.items"
          :pagination="false"
        >
          <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
          <span slot="referenceRange" slot-scope="text, record">{{ record.min }}-{{ record.max }}
            <!-- <div v-if="text.length > 0">
              <div v-for="range_item in text" :key="range_item.id" style="margin-bottom: 6px;">
                <span v-if="range_item.type === 'simple'">
                  <div style="font-size: 12px; border: 1px solid #ddd; border-radius: 12px; padding: 4px 8px 8px 8px;">
                    <a-divider style="font-size: 12px; color: #999; margin: 4px 0;" orientation="left"> {{ range_item.name }} </a-divider>
                    <a-tag v-for="option in range_item.options" :key="option.id" style="margin-bottom: 2px;">
                      {{ option.name }}
                    </a-tag>
                  </div>
                </span>
                <span v-if="range_item.type === 'range'">
                  <div style="font-size: 12px; border: 1px solid #ddd; border-radius: 12px; padding: 4px 8px 8px 8px;">
                    <a-divider style="font-size: 12px; color: #999; margin: 4px 0;" orientation="left"> {{ range_item.name }} </a-divider>
                    <div v-for="option in range_item.options" :key="option.id" style="padding-top: 2px;">
                      <a-tag> {{ option.name }} </a-tag>:
                      <span v-if="option.start">
                        <span style="text-decoration: underline;"> {{ option.start }}</span>
                        ≤
                      </span>
                      <span v-if="option.start && option.end"> 且 </span>
                      <span v-if="option.end">
                        &lt;
                        <span style="text-decoration: underline;"> {{ option.end }}</span>
                      </span>
                      {{ range_item.unit }}
                    </div>
                  </div>
                </span>
              </div>
            </div> -->
            <!-- <div v-if="text.length === 0"> - </div> -->
          </span>
          <span slot="result" slot-scope="text">
            <div v-if="text.length">
              <span v-for="range_item in text" :key="range_item.id">
                <span v-if="range_item.type === 'simple'">
                  <a-tag color="#2db7f5" style="font-weight: 700; margin-bottom: 2px;"> {{ range_item.name }} </a-tag>
                </span>
                <div v-if="range_item.type === 'range'">
                  <!-- <div style="font-size: 12px; padding-bottom: 2px; white-space: nowrap;"> -->
                  <div style="font-size: 12px; border: 1px solid #ddd; border-radius: 12px; padding: 4px 8px 8px 8px; margin-bottom: 6px; white-space: nowrap;">
                    <a-divider style="font-size: 12px; color: #999; margin: 4px 0; font-weight: 700;" orientation="left">
                      <a-tag color="#2db7f5" style="font-weight: 700"> {{ range_item.name }} </a-tag>
                    </a-divider>
                    <span v-if="range_item.products">
                      <div v-for="prod in range_item.products" :key="prod.id" style="margin-bottom: 2px;">
                        <span v-if="prod.conditionFilters?.length">
                          <a-tag v-for="filter in prod.conditionFilters" :key="filter.optionId+Math.random()">
                            {{ filter.option?.name }}
                          </a-tag>:
                        </span>
                        <span v-if="prod.start">
                          <span style="text-decoration: underline;"> {{ prod.start }}</span>
                          ≤
                        </span>
                        <span v-if="prod.start && prod.end"> 且 </span>
                        <span v-if="prod.end">
                          &lt;
                          <span style="text-decoration: underline;"> {{ prod.end }}</span>
                        </span>
                        {{ prod.unit }}
                      </div>
                    </span>
                  </div>
                  <!-- </div> -->
                </div>
              </span>
            </div>
            <span v-if="!text.length"> - </span>
          </span>
          <span slot="action" slot-scope="text, record" style="white-space: nowrap;">
            <a @click="openModal('edit', record)" style="margin-right: 12px;">编辑</a>
            <a-popconfirm
              title="是否永久删除该指标？"
              @confirm="handleOnDeleteIndexItem(record)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      :title="mode === 'create' ? `新建 ${this.currentProjectName()} 指标条目` : `编辑 ${this.currentProjectName()} 指标条目【${current.name}】`"
      style="top: 20px"
      :width="1000"
      v-if="visible"
      :visible="visible"
      @ok="handleOkDone"
      ok-text="确定"
      @cancel="closeModal"
    >
      <a-form :form="form" v-model="current">
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-item label="指标名称">
              <a-input v-model="current.name" type="text" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测方式">
              <a-input v-model="current.testMethod" type="text" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-item label="指标类型">
              <a-select v-model="current.type">
                <a-select-option value="Integer">整数</a-select-option>
                <a-select-option value="Float">小数</a-select-option>
                <a-select-option value="Text">主观文本</a-select-option>
                <a-select-option value="Report">图文报告</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="指标单位">
              <a-input v-model="current.unit" type="text" :disabled="!['Integer', 'Float'].includes(current.type)"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-item label="检测频率">
              <a-input-group compact>
                <a-input
                  v-model="current.testRateValue"
                  type="number"
                  addon-after="次"
                  style="width: 70%"
                  aria-autocomplete="inline"
                />
                <div style="width: 5%; text-align: center; line-height: 2">/</div>
                <a-select v-model="current.testRateUnit" style="width: 25%; top: -1px">
                  <a-select-option value="年">年</a-select-option>
                  <a-select-option value="月">月</a-select-option>
                  <a-select-option value="周">周</a-select-option>
                  <a-select-option value="日">日</a-select-option>
                </a-select>
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测环境">
              <a-input type="text" v-model="current.testEnvironment"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="参考条件">
              <a-row
                v-for="condition in current.conditions"
                :key="condition.name"
                :gutter="24"
                style="padding: 12px 14px 12px 14px; margin: 12px 0; border: 1px #ddd dashed; border-radius: 8px;"
              >
                <div style="float: right; line-height: 12px;">
                  <a-icon type="close" @click="handleAddNewConditionRemove(condition)"/>
                </div>
                <a-col :span="24">
                  <a-col :span="2" style="white-space: nowrap; padding-left: 0;"> 参考条件： </a-col>
                  <a-col :span="8">
                    <a-select v-model="condition.name" @select="handleAddNewConditionSelectType(condition)" style="margin-left: 12px;">
                      <a-select-option value="性别">性别</a-select-option>
                      <a-select-option value="年龄">年龄</a-select-option>
                      <a-select-option value="时辰">时辰</a-select-option>
                      <a-select-option value="其它">其它</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="14" v-if="condition.name === '其它'">
                    <a-col :span="12">
                      <a-input placeholder="条件名称，如：孕期" style="margin-right: 12px;"/>
                    </a-col>
                    <a-col :span="12">
                      <a-select v-model="condition.type" style="margin-right: 12px;">
                        <a-select-option value="range">数值范围</a-select-option>
                        <a-select-option value="simple">选项</a-select-option>
                      </a-select>
                    </a-col>
                  </a-col>
                </a-col>
                <a-col :span="24" v-if="condition.type">
                  <a-row :gutter="24">
                    <a-col :span="3" style="white-space: nowrap;"> 判定条件： </a-col>
                    <a-col :span="21" v-if="condition.type == 'range'" style="padding-left: 4px;">
                      <div v-if="condition.options">
                        <div v-for="option in condition.options" :key="option.id">
                          <a-col :span="6" style="padding-left: 0px;">
                            <a-input type="text" v-model="option.name" placeholder="可选择项名称"/>
                          </a-col>
                          <a-col :span="17" style="display: flex; align-items: center;">
                            <a-input type="text" v-model="option.start" placeholder="数值下界" style="width: 40%" :addonAfter="condition.unit"/>
                            <div style="width: 20%; font-size: 12px; text-align: center; color: #999;"> ≤ 条件值 &lt; </div>
                            <a-input type="text" v-model="option.end" placeholder="数值上界" style="width: 40%" :addonAfter="condition.unit"/>
                          </a-col>
                          <a-col :span="1">
                            <a-icon type="close" @click="handleAddNewConditionOptionRemove(condition, option)"/>
                          </a-col>
                        </div>
                      </div>
                      <a-button style="width: 100%" type="dashed" @click="handleAddNewConditionRange(condition)"> 增添一组条件选项 </a-button>
                    </a-col>
                    <a-col :span="21" v-if="condition.type == 'simple'" style="padding-left: 4px;">
                      <div v-if="condition.options">
                        <a-tag
                          type="text"
                          v-for="option in condition.options"
                          :key="option.id"
                          closable
                          @close="handleAddNewConditionOptionRemove(condition, option)"
                        >
                          {{ option.name }}
                        </a-tag>
                      </div>
                      <div style="width: 100%">
                        <a-col :span="9" style="padding: 0;">
                          <a-input type="text" v-model="condition.pending_value" placeholder="输入可选项"/>
                        </a-col>
                        <a-col :span="12" style="padding-left: 8px; top: -1px">
                          <a-button type="" @click="handleAddNewConditionOption(condition)"> 确认新增选项 </a-button>
                        </a-col>
                      </div>
                    </a-col>
                    <a-col :span="21" v-if="condition.type == 'text'" style="padding-left: 4px;">
                      <span style="color: #999; font-size: 12px;">&lt; 录入指标数据时手动填写 &gt;</span>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- <div style="margin-top: 12px; height: 1px; width: 100%; background: #ddd; clear: both;"/> -->
                <!-- <a-divider style="margin-top: 12px;"/> -->
              </a-row>
              <a-button @click="handleAddNewCondition" style="width: 100%" type="dashed"> 添加参考条件 </a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col style="display: flex; align-items: center;width: 600px;">
            <span style="width:100px;font-weight: bold;">参考范围：</span>
            <a-input
              type="text"
              v-model="current.min"
              placeholder="数值下界"
              style="width: 42%"
              :addonAfter="current.unit"
            />
            <div style="width: 14%; font-size: 12px; text-align: center; color: #999;"> ≤ 指标值 &lt; </div>
            <a-input
              type="text"
              v-model="current.max"
              placeholder="数值上界"
              style="width: 42%"
              :addonAfter="current.unit"
            />
          </a-col>
          <a-col :span="24">
            <a-form-item label="参考结果">
              <a-row
                :gutter="24"
                style="padding: 12px 14px; margin: 12px 0; border: 1px #ddd dashed; border-radius: 8px;"
              >
                <a-col :span="12">
                  <a-col :span="5" style="white-space: nowrap; padding-left: 0;"> 数据类型： </a-col>
                  <a-col :span="19">
                    <a-select v-model="current.result.type" @select="handleAddNewResultSelectType(current.result)">
                      <a-select-option value="range">数值范围</a-select-option>
                      <a-select-option value="simple">主观选项</a-select-option>
                      <a-select-option value="text">主观文本</a-select-option>
                    </a-select>
                  </a-col>
                </a-col>
                <a-col :span="24">
                  <a-row :gutter="24">
                    <a-col :span="3" style="white-space: nowrap;"> 判定结果： </a-col>
                    <a-col :span="24" v-if="current.result.type == 'range'" style="padding-left: 12px;">
                      <div v-for="result_option in current.result.options" :key="result_option.id" style="display:inline-block;position: relative;">
                        <a-col :span="4" style="padding-left: 0px;">
                          <a-input
                            type="text"
                            :value="result_option.name"
                            @change="e => { result_option.name = e.target.value }"
                            placeholder="名称，如：偏高、偏低、正常"
                          />
                        </a-col>
                        <a-col :span="13">
                          <div v-if="result_option.products">
                            <div v-for="prod in result_option.products" :key="prod.id">
                              <a-row>
                                <a-col :span="7" v-if="prod.conditionFilters.length > 0">
                                  <span v-for="(opt, idx) in prod.conditionFilters" :key="idx">
                                    <span v-if="idx > 0" style="padding-right: 4px;"> + </span>
                                    <a-tag> {{ opt.option?.name }} </a-tag>
                                  </span>
                                  <span>:</span>
                                </a-col>
                                <a-col :span="prod.conditionFilters.length > 0 ? 16 : 24" style="display: flex; align-items: center;">
                                  <a-input
                                    type="text"
                                    :value="prod.start"
                                    @change="e => { prod.start = e.target.value }"
                                    :key="prod.id + '-start'"
                                    placeholder="数值下界"
                                    style="width: 42%"
                                    :addonAfter="current.unit"
                                  />
                                  <div style="width: 28%; font-size: 12px; text-align: center; color: #999;"> ≤ 指标值 &lt; </div>
                                  <a-input
                                    type="text"
                                    :value="prod.end"
                                    @change="e => { prod.end = e.target.value }"
                                    :key="prod.id + '-end'"
                                    placeholder="数值上界"
                                    style="width: 42%"
                                    :addonAfter="current.unit"
                                  />
                                </a-col>
                              </a-row>
                            </div>
                          </div>
                        </a-col>
                        <a-col :span="6">
                          <a-textarea
                            style="height: 100%;"
                            v-model="result_option.products[0].remark"
                            placeholder="指标结果备注"
                          />
                        </a-col>
                        <a-col :span="1">
                          <a-icon type="close" @click="handleAddNewResultOptionRemove(current.result, result_option)"/>
                        </a-col>
                      </div>
                      <a-button style="width: 100%" type="dashed" @click="handleAddNewResultRange(current.result)"> 增添一组结果选项 </a-button>
                    </a-col>
                    <a-col :span="24" v-if="current.result.type == 'simple'" style="padding-left: 12px;">
                      <span v-if="current.result.options">
                        <a-row
                          v-for="option in current.result.options"
                          :key="option.id"
                        >
                          <a-col :span="3"><a-tag>{{ option.name }}</a-tag></a-col>
                          <a-col :span="19" style="margin:10px;">
                            <a-textarea
                              style="height: 100%;"
                              placeholder="指标结果备注"
                              v-model="option.products[0].remark"
                            />
                          </a-col>
                          <a-col :span="1">
                            <a-icon type="close" @click="handleAddNewResultOptionRemove(current.result, option)"/>
                          </a-col>
                        </a-row>
                      </span>
                      <div style="width: 100%">
                        <a-col :span="9" style="padding: 0;">
                          <a-input type="text" v-model="current.result.pending_value" placeholder="如：偏高、偏低、正常"/>
                        </a-col>
                        <a-col :span="12" style="padding-left: 8px; top: -1px">
                          <a-button type="" @click="handleAddNewResultOption(current.result)"> 确认新增选项 </a-button>
                        </a-col>
                      </div>
                    </a-col>
                    <a-col :span="24" v-if="current.result.type == 'text'" style="padding-left: 12px;">
                      <span style="color: #999; font-size: 12px;">&lt; 录入指标数据时手动填写 &gt;</span>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col>
            <a-form-item label="指标意义">
              <a-input type="textarea" v-model="current.meaning"/>
            </a-form-item>
            <a-form-item label="备注">
              <a-input type="textarea" v-model="current.remark"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      :title="currentProject.mode === 'create' ? '新建指标项目' : '编辑指标项目'"
      style="top: 20px"
      :width="800"
      v-model="projectVisible"
      @ok="handleOkProjectModalDone"
      ok-text="确认"
    >
      <a-form v-model="currentProject">
        <a-row :gutter="48">
          <a-col :span="18" :offset="3">
            <a-form-item label="项目名称">
              <a-input v-model="currentProject.name" type="text" placeholder="如：血常规" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
// type::
// result: [{ id, name, type, products: [] }]
// products: [{ id: 'prod>'+id, conditionFilters, name, type, unit, start, end }]
// conditionFilters: [{ conditionId, optionId, condition: {}, option: {} }]
// condition: { id, name, type, unit, options: [] }
// option: { id, name, start, end }
import {
  listAllIndexes,
  createIndexItem as apiCreateIndexItem,
  updateIndexItem as apiUpdateIndexItem,
  deleteIndexItem as apiDeleteIndexItem,
  createProject as apiCreateProject,
  updateProjectName as apiUpdateProjectName,
  deleteProject as apiDeleteProject
} from '@/api/health_indexes'
import { ref } from 'vue'

const columns = [
  {
    title: '指标名称',
    dataIndex: 'name',
    fixed: 'left',
    width: 200
  },
  {
    title: '检测方式',
    dataIndex: 'testMethod',
    align: 'center',
    width: 100
  },
  {
    title: '指标类型',
    dataIndex: 'type',
    width: 80,
    align: 'center',
    customRender: (text) => {
      switch (text) {
        case 'Integer':
        case 'Float':
          return '数值'
        case 'Text':
          return '主观文本'
        case 'Report':
          return '图文报告'
      }
      return '-'
    }
  },
  {
    title: '指标单位',
    dataIndex: 'unit',
    width: 80,
    align: 'center',
    customRender: (status) => {
      switch (status) {
        case 'inactive':
          return '未激活'
        case 'active':
          return '正常'
        case 'disable':
          return '不可用'
      }
      return status
    }
  },
  {
    title: '参考范围',
    dataIndex: 'referenceRange',
    width: 150,
    scopedSlots: { customRender: 'referenceRange' },
    align: 'center'
  },
  {
    title: '参考结果',
    dataIndex: 'result',
    width: 240,
    scopedSlots: { customRender: 'result' }
  },
  {
    title: '检测频率',
    dataIndex: 'testRate',
    width: 80,
    customRender: (text, record) => {
      if (record.testRateValue > 0) {
        return `${record.testRateValue} 次 / ${record.testRateUnit}`
      }
      return '-'
    }
  },
  {
    title: '检测环境',
    dataIndex: 'testEnvironment',
    width: 100
  },
  {
    title: '指标意义',
    dataIndex: 'meaning',
    width: 80
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 100,
    scopedSlots: { customRender: 'createTime' },
    align: 'center'
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    fixed: 'right',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

const randomId = () => {
  return (new Date().getTime() + '').substring(6)
}

const prodId = (prodlist = [], index) => {
  return 'prod>' + prodlist.map(prod => `${prod.conditionId}(${prod.optionId})`).join('-') + (index !== undefined ? index : '')
}

const InitialPropOfModel = {
  type: 'Float',
  conditions: [],
  result: {
    type: 'range',
    options: []
  }
}

export default {
  name: 'IndexPage',
  components: {
    // STable
  },
  data () {
    return {
      currentTabKey: null,
      // modal
      mode: 'create', // or: 'edit'
      visible: false,
      current: {
        // conditions: [{ id: new Date().getTime() }] // {name, options}
        conditions: [], // {type, unit, options}
        result: {}
      },
      // form
      form: this.$form.createForm(this),
      // table
      columns,
      scroll: { x: true },
      data: [],
      // create project modal
      projectVisible: false,
      currentProject: { name: '' }
    }
  },
  filters: {
  },
  created () {
    this.$setPageDataLoader(this.reloadData)
    this.reloadData()
  },
  methods: {
    currentProjectName () {
      const project = (this.data || []).find(tab => tab.id === this.currentTabKey + 0)
      // console.log({ data: this.data, project, key: this.currentTabKey })
      if (project) {
        return project.name
      }
      return ''
    },
    ProjectName () {
      const project = (this.data || []).find(tab => tab.id === this.currentTabKey + 0)
      // console.log({ data: this.data, project, key: this.currentTabKey })
      if (project) {
        if (project.name.length > 18) {
          return project.name.substr(0, 18) + '...'
        }
        return project.name
      }
      return ''
    },
    async reloadData () {
      const resp = await listAllIndexes()
      if (resp.status === 200) {
        // reform data
        const data = (resp.data || []).map(record => {
          const items = (record.items || []).map(item => {
            const conditions = item.conditions || []
            const result = (item.result || []).map(result => {
              const conditionFilters = (result.conditionFilters || []).map(filter => {
                const condition = conditions.find(cond => cond.id === filter.conditionId)
                // console.log({ item, conditions, condition })
                if (condition) {
                  const option = (condition.options || []).find(op => op.id === filter.optionId)
                  return {
                    conditionId: filter.conditionId,
                    optionId: filter.optionId,
                    condition, // add field
                    option // add field
                  }
                }
                // console.log({ conditionFilters })
                return filter
              })
              return { ...result, conditionFilters }
            }).reduce((resultOptions, currentResult, currentIndex) => {
              const resultItem = resultOptions.find(item => item.id === currentResult.id)
              // const conditionFilters = (currentResult.conditionFilters || []).map(filt => {
                // return { ...filt } // extract option props
              // })
              const id = prodId(currentResult.conditionFilters, currentResult.id)
              if (resultItem) {
                resultItem.products.push({
                  ...currentResult,
                  id
                  // conditionFilters
                })
              } else {
                resultOptions.push({
                  id: currentResult.id,
                  name: currentResult.name,
                  type: currentResult.type,
                  products: [{
                    ...currentResult,
                    id
                    // conditionFilters
                  }]
                })
              }
              return resultOptions
            }, [])
            return { ...item, result }
          })
          return { ...record, items }
        })
        this.data = data
        if (!this.currentTabKey && resp.data.length > 0) {
          this.currentTabKey = ref(resp.data[0].id)
        }
      }
    },
    openModal (mode, record) {
      console.log('recordrecordrecord', record)
      const reform = (data) => {
        if (!data) return null
        // conditions:
        const conditions = data.conditions || []
        // result:
        const resultOptions = (data.result || [])
        const resultType = ((options) => {
          if (options.length === 0) return 'range'
          return options[0].type || 'range'
        })(resultOptions)
        const result = {
          type: resultType,
          options: resultOptions,
          pending_value: ''
        }
        // return
        const view = { ...data, conditions, result }
        return JSON.parse(JSON.stringify(view))
      }
      this.mode = mode
      this.current = reform(record) || InitialPropOfModel
      this.visible = true
      this.updateCurrentProducts()
    },
    closeModal () {
      this.visible = false
    },
    updateCurrentProducts () {
      if (this.current.result.type !== 'range') {
        this.$forceUpdate()
        return
      }
      // redener result/range options
      const descartProduct = (bilist) => {
        const list = bilist.reduce((a, b) => {
          return a.map(item => b.map(i => [i].concat(item).reverse())).reduce((c, d) => c.concat(d), [])
        }, [[]])
        // console.log({ bilist, list }, bilist.length, list.length)
        // if (bilist.length === 1) {
        //   return list.map(item => [item])
        // }
        return list
      }
      // const descartProduct = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
      const conditions = (this.current.conditions || []).map(cond => {
        if (cond.options) {
          return cond.options.map(op => { return { condition: cond, option: op, conditionId: cond.id, optionId: op.id } })
        }
        return [] // options
      }).filter(opts => opts.length > 0)
      // make cross prod, object: {name, type, value, start, end}
      // console.log('prepared products', conditions, descartProduct(conditions))
      // prepared:
      const originalProducts = (this.current.result.options || []).map(option => option.products).flat()
      const options = (this.current.result.options || []).map((option, index) => {
        const preparedProducts = descartProduct(conditions).map(condFilters => { // prod: [{男}, {女}]
          return { id: prodId(condFilters, option.id), conditionFilters: condFilters, name: 'descart-placeholder', start: null, end: null, value: null, remark: null }
        })
        // 判断原始值是否填写，保留用户填写内容
        const newProducts = preparedProducts.map(prod => {
          const original = originalProducts.find(originalProd => originalProd.id === prod.id)
          if (original) {
            return { ...prod, name: original.name, start: original.start, end: original.end, remark: original.remark }
          }
          return prod
        })
        return { ...option, products: newProducts }
      })
      // console.log({ originalProducts, options })
      // console.log('[range] current products:', products)
      // console.log('[range] original options:', this.current.result.options)
      // cache original values
      // const originalProducts = (this.current.result.options || []).map(option => option.products).flat()
      // console.log({ originalProducts, products })
      // const options = (this.current.result.options || []).map(option => {
      //   // if (option.products && option.products.length === products.length) {
      //   //   // 保留之前编辑项内容
      //   //   if (option.products.length === 0) return option
      //   //   if (option.products[0].id === products[0].id) return option
      //   // }
      //   // if (products.length === 0) return option
      //   // console.log('products changed:', { option, products })
      //   // return { ...option, products }
      //   const newProducts = products.map(prod => {
      //     const original = originalProducts.find(originalProd => originalProd.id === prod.id)
      //     if (original) {
      //       return { ...prod, name: original.name, start: original.start, end: original.end }
      //     }
      //     return prod
      //   })
      //   return { ...option, products: newProducts }
      // })
      // console.log('[range] rendering...', options)
      this.current.result.options = options
      this.$forceUpdate()
      // this.current.products = products
      // this.current.result.options = options
    },
    handleAddNewConditionSelectType (condition) { // reset options
      // console.log(condition)
      switch (condition.name) {
        case '性别':
          condition.type = 'simple'
          condition.options = [
            { id: 1, name: '男' },
            { id: 2, name: '女' }
          ]
          break
        case '年龄':
          condition.type = 'range'
          condition.unit = '岁'
          condition.options = [
            { id: 1, name: '未成年', start: 0, end: 18 },
            { id: 2, name: '成年', start: 18, end: 100 }
          ]
          break
        case '时辰':
          condition.type = 'range'
          condition.unit = '时'
          condition.options = [
            { id: 1, name: '凌晨', start: 0, end: 6 },
            { id: 2, name: '上午', start: 6, end: 12 },
            { id: 3, name: '下午', start: 12, end: 18 },
            { id: 4, name: '晚上', start: 18, end: 24 }
          ]
          break
        case '其它':
          condition.type = 'range'
          condition.unit = ''
          condition.options = []
      }
      this.updateCurrentProducts()
    },
    handleAddNewCondition () {
      const conditions = this.current.conditions || []
      conditions.push({ id: randomId(), name: '', type: '', options: [] })
      this.current = { ...this.current, conditions }
      this.updateCurrentProducts()
    },
    handleAddNewConditionRemove (condition) {
      this.current.conditions = (this.current.conditions || []).filter(cond => cond.id !== condition.id)
      this.updateCurrentProducts()
    },
    handleAddNewConditionOption (condition) { // type: simple
      if (!condition.pending_value || !condition.pending_value.trim()) {
        console.warn('Value Not Valid')
        return
      }
      const options = condition.options || []
      options.push({ id: randomId(), name: condition.pending_value })
      condition.options = options
      condition.pending_value = ''
      this.updateCurrentProducts()
    },
    handleAddNewConditionRange (condition) { // type: range
      const options = condition.options || []
      options.push({ id: randomId(), name: '', start: null, end: null, remark: null })
      condition.options = options
      this.updateCurrentProducts()
    },
    handleAddNewConditionOptionRemove (condition, option) {
      condition.options = condition.options.filter(op => op.id !== option.id)
      this.updateCurrentProducts()
    },
    handleAddNewResultSelectType (condition) {
      switch (condition.type) {
        case 'range':
          condition.options = [{ id: randomId(), name: '示例', products: [{ id: 'prodn>' + randomId(), name: null, start: null, end: null, reamrk: null, conditionFilters: [] }] }]
          condition.pending_value = ''
          break
        case 'simple':
        case 'text':
          condition.options = []
          condition.pending_value = ''
          break
      }
    },
    handleAddNewResultOption (condition) { // type: simple
      console.log('condition', condition)
      if (!condition.pending_value || !condition.pending_value.trim()) {
        console.warn('Value Not Valid')
        return
      }
      const options = condition.options || []
      options.push({ id: randomId(), name: condition.pending_value, products: [{ remark: '' }] })
      condition.options = options
      condition.pending_value = ''
      this.$forceUpdate()
    },
    handleAddNewResultRange (condition) { // type: range
      // console.log('result.options:', { condition })
      const options = condition.options || []
      options.push({ id: randomId(), name: '', products: [{ id: 'prodn>' + randomId(), name: null, start: null, end: null, reamrk: null, conditionFilters: [] }] })
      condition.options = options
      this.$forceUpdate()
      this.updateCurrentProducts()
    },
    handleAddNewResultOptionRemove (result, option) {
      result.options = result.options.filter(op => op.id !== option.id)
      this.updateCurrentProducts()
      this.$forceUpdate()
    },
    async handleOkDone (e) {
      e.preventDefault()
      // reform to payload
      const reform = (payload) => {
        if (payload.result.type === 'range') {
          console.log('pppppppppppp', payload)
          const result = (payload.result.options || []).map(resultOption => {
            return (resultOption.products || []).map(prod => {
              // const conditionFilters = (prod.conditionFilters || []).map(p => { return { conditionId: p.conditionId, optionId: p.optionId } })
              return {
                id: resultOption.id,
                name: resultOption.name,
                unit: payload.unit, // use main unit, for index
                type: payload.result.type,
                start: prod.start,
                end: prod.end,
                remark: prod.remark,
                conditionFilters: prod.conditionFilters
              }
            })
          // if (resultOption.products) {
          //   return resultOption.products.map(prod => {
          //     const conditionFilters = (prod.conditionFilters || []).map(p => { return { conditionId: p.conditionId, optionId: p.optionId } })
          //     return {
          //       id: resultOption.id,
          //       name: resultOption.name,
          //       unit: payload.unit, // use main unit, for index
          //       type: payload.result.type,
          //       start: prod.start,
          //       end: prod.end,
          //       conditionFilters
          //     }
          //   })
          // }
          // return {
          //   id: resultOption.id,
          //   name: resultOption.name,
          //   unit: payload.unit, // use main unit, for index
          //   type: payload.result.type,
          //   start: resultOption.start,
          //   end: resultOption.end,
          //   conditionFilters: [] // none
          // }
          }).flat()
          return { ...payload, result }
        }
        if (payload.result.type === 'simple') {
          const result = (payload.result.options || []).map(resultOption => {
            return {
              id: resultOption.id,
              name: resultOption.name,
              remark: resultOption.products[0].remark,
              type: 'simple'
            }
          })
          return { ...payload, result }
        } else {
          return payload
        }
      }
      console.log('this.currentthis.current', this.current)
      const payload = reform(this.current || {})
      const projectName = this.currentProjectName() // this.data[this.currentTabKey - 1].name
      // valid payload
      const validPayload = (payload) => {
        if (!payload.name) {
          this.$message.warning('请输入指标名称')
          return false
        }
        if (payload.testRateUnit && !payload.testRateValue) {
          this.$message.warning('请输入检测频率')
          return false
        }
        if (!payload.testRateUnit && payload.testRateValue) {
          this.$message.warning('请选择检测频率单位')
          return false
        }
        return true
      }
      // check it!
      if (!validPayload(payload)) {
        return
      }
      // do request
      let resp = null
      if (this.mode === 'create') {
        // create
        resp = await apiCreateIndexItem(projectName, payload)
        console.log('apiCreateIndexItem', payload)
      } else {
        // update
        resp = await apiUpdateIndexItem(projectName, payload.id, payload)
      }
      if (resp && resp.status) {
        if (resp.status === 200 || resp.status === 201) {
          this.$message.info(resp.message)
          this.reloadData()
          this.closeModal()
        } else {
          this.$message.warning(resp.message)
        }
      }
    },
    // create project modal
    openProjectModal (mode) {
      switch (mode) {
        case 'create':
          this.currentProject.name = ''
          this.currentProject.mode = 'create'
          this.projectVisible = true
          break
        case 'edit':
          const projectName = this.currentProjectName() // this.data[this.currentTabKey - 1].name
          this.currentProject.name = '' + projectName
          this.currentProject.mode = 'edit'
          this.projectVisible = true
          break
      }
    },
    closeProjectModal () {
      this.projectVisible = false
    },
    async handleOkProjectModalDone (e) {
      e.preventDefault()
      const projectName = this.currentProject.name.trim()
      if (!projectName) {
        this.$message.warning('请输入项目名称')
        return
      }
      if (this.currentProject.mode === 'create') {
        const resp = await apiCreateProject(projectName)
        if (resp.status === 201) {
          this.$message.success(resp.message)
          this.reloadData()
          this.closeProjectModal()
        } else {
          this.$message.warning(resp.message)
        }
      } else {
        const originalProjectName = this.currentProjectName() // this.data[this.currentTabKey - 1].name
        const resp = await apiUpdateProjectName(originalProjectName, projectName)
        if (resp.status === 200) {
          this.$message.success(resp.message || '指标名称更新成功')
          this.reloadData()
          this.closeProjectModal()
        } else {
          this.$message.warning(resp.message || '更新失败')
        }
      }
    },
    async handleOnDeleteIndexItem (record) {
      const projectName = this.currentProjectName() // this.data[this.currentTabKey - 1].name
      const resp = await apiDeleteIndexItem(projectName, record.id)
      if (resp.status > 204) {
        this.$message.warning(resp.message || '删除失败')
      } else {
        this.$message.success('指标删除成功')
        this.reloadData()
      }
    },
    async handleOnDeleteCurrentProject () {
      const projectName = this.currentProjectName() // this.data[this.currentTabKey - 1].name
      const resp = await apiDeleteProject(projectName)
      if (resp.status > 204) {
        this.$message.warning(resp.message || '删除失败')
      } else {
        this.$message.success('指标项目删除成功')
        this.reloadData()
      }
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>

</style>
