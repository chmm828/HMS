<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row>
          <a-col :xl="5" :sm="10">
            <a-form-item label="用户名">
              <a-input v-model="checkId" placeholder="请输入用户名"/>
            </a-form-item>
          </a-col>
          <a-col :xl="3" :sm="10">
            <span class="table-page-search-submitButtons">
              <a-button @click="searchId" type="primary">查询</a-button>
            </span>
          </a-col>
          <a-col :xl="5" :sm="10">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-model="checkState" default-value="all">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="active">正常</a-select-option>
                <a-select-option value="disable">禁用</a-select-option>
                <a-select-option value="registering">未激活</a-select-option>
                <a-select-option value="inactive">激活中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="3" :sm="10">
            <span class="table-page-search-submitButtons">
              <a-button @click="searchStatus" type="primary">查询</a-button>
            </span>
          </a-col>
          <a-col :xl="8" :sm="10">
            <span class="table-page-search-submitButtons">
              <a-button @click="openCreateModal" type="primary" style="float: right">创建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :data-source="accountData"
      :pagination="pagination"
    >
      <span slot="displayName" slot-scope="text, record">
        <span v-for="item in roles" :key="item.id">
          <a-tag v-if="(item.name===record.roleName)">{{ item.displayName }}</a-tag>
        </span>
      </span>
      <span slot="nickname" slot-scope="text">
        {{ text || '----' }}
      </span>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          v-if="record.status !== 'disable'"
          title="禁用后不可恢复，确定禁用此用户吗? "
          @confirm="statusDisable(record)"
        >
          <a >禁用</a>
          |
        </a-popconfirm>
        <a v-else>---</a>

        <a @click="openDuty(record)">家庭分配</a>
      </span>
    </a-table>

    <a-modal
      title="新建账户"
      style="top: 20px;"
      :width="800"
      v-model="createModalVisible"
      @ok="handleCreateOk"
      ok-text="下载账户 Excel 文件"
    >
      <a-form class="create-account-form" :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色"
        >
          <a-select v-decorator="['roleId', { initialValue: role.initialValue }]">
            <a-select-option v-for="item in role.list" :value="item.id" :key="item.id">
              {{ item.displayName || item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数量"
        >
          <a-input-number
            type="number"
            placeholder="1-10"
            :min="1"
            :max="10"
            v-decorator="['amount', { initialValue: 1 }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <AssignDuty
      v-if="dutyVisible"
      :dutyVisible="dutyVisible"
      :accountCheckData="accountCheckData"
      @closeDuty="closeDuty"
    />
  </a-card>
</template>

<script>
import { getUserList, getRoleList, changeDisable } from '@/api/manage'
// import { getRoleList } from '@/api/manage'
import AssignDuty from './AssignDuty.vue'

const columns = [
  {
    title: '用户账号',
    dataIndex: 'account'
  },
  {
    title: '用户名',
    dataIndex: 'nickname',
    scopedSlots: { customRender: 'nickname' }
  },
  {
    title: '用户角色',
    dataIndex: 'displayName',
    scopedSlots: { customRender: 'displayName' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: (status) => {
      switch (status) {
        case 'inactive':
          return '激活中'
        case 'active':
          return '正常'
        case 'disable':
          return '禁用'
        case 'registering':
          return '未激活'
      }
      return status
    }
    // scopedSlots: { customRender: 'status' }
  },
  {
    title: '手机号',
    dataIndex: 'telephone'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    scopedSlots: { customRender: 'createTime' }
    // sorter: true
  },
  {
    title: '操作',
    width: '150px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'AccountList',
  components: {
    AssignDuty
  },
  data () {
    return {
      accountData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        // showSizeChanger: true, // 显示可改变每页数量
        // pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
        showTotal: total => `共 ${total} 个账户`, // 显示总数
        onShowSizeChange: (current, pageSize) => this.onSizeChange(current, pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      },
      checkState: 'all',
      checkId: null,
      role: {
        list: [],
        initialValue: -1
      },
      roles: [],
      createModalVisible: false,

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      permissions: [],
      // 表头
      columns,
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
      dutyVisible: false,
      accountCheckData: {}
    }
  },
  filters: {
  },
  mounted () {
    this.getAccount()
  },
  created () {
    getRoleList().then(res => {
      this.roles = res.data || []
      this.role.list = (res.data || []).filter(role => role.name !== 'root')
      if (this.role.list.length > 0) {
        this.role.initialValue = this.role.list[0].id
      }
      // console.log('getRoleList.call()', res.data)
    })
    this.$setPageDataLoader(this.getAccount)
  },
  methods: {
    openCreateModal () {
      this.createModalVisible = true
    },
    closeCreateModal () {
      this.createModalVisible = false
    },
    handleCreateOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // download files
          const a = document.createElement('a')
          a.id = 'account-gen-a'
          a.href = `/api/users/generate/${values.roleId}/${values.amount}/自动生成账户（${values.amount}个）.xlsx`
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.getElementById('account-gen-a').remove()
        }
      })
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    searchId () {
      console.log('搜索Id', this.checkId)
      this.pagination.current = 1
      // this.getAccount()
    },
    searchStatus () {
      // console.log('搜索状态', this.checkState)
      this.pagination.current = 1
      this.getAccount()
    },
    statusDisable (data) {
      const id = data.id
      const apiData = {
        status: 'disable'
      }
      changeDisable(id, apiData).then(res => {
        // console.log('res', res)
        if (res.status === 200) {
          // console.log('成功')
          this.$message.info('禁用成功')
          this.getAccount()
        } else {
          this.$message.error('禁用失败,' + res.message)
        }
      })
      // console.log(apiData, 'data', id)
    },
    getAccount () {
      const pages = {
        page: this.pagination.current,
        size: this.pagination.pageSize
      }
      if (this.checkState !== 'all') {
        pages.status = this.checkState
      }
      // console.log('pages', test)
      getUserList(pages).then(res => {
        if (res.status === 200) {
          // console.log(res.data)
          this.accountData = (res.data.content || []).map(record => { return { ...record, key: record.id } })
          this.pagination.total = res.data.totalElements
        }
      })
    },
    onSizeChange (current, pageSize) {
      this.pagination.current = 1
      this.pagination.pageSizej = pageSize
      this.getAccount()
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      this.getAccount()
    },
    openDuty (record) {
      this.dutyVisible = true
      this.accountCheckData = record
      // console.log('责任分配', record)
    },
    closeDuty () {
      this.dutyVisible = false
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>

<style lang="less" scoped>
.permission-form {
  /deep/ .permission-group {
    margin-top: 0;
    margin-bottom: 0;
  }
}

</style>
