<template>
  <div>
    <a-card>
      <a-row>
        <a-col>
          <a-button type="primary" @click="openModal('create')">新建角色</a-button>
        </a-col>
      </a-row>

      <a-table :columns="columns" :data-source="data" :row-key="record => record.id" style="background-color:white">
        <!-- <a slot="displayName" slot-scope="displayName">{{ displayName }}</a> -->
        <span slot="permissions" slot-scope="permissions" >
          <span
            v-for="tag in permissions"
            :key="tag.permission"
          >
            <a-tag v-if="tag.canCreate || tag.canEdit || tag.canView || tag.canDelete">
              <a-tooltip>
                <template slot="title">
                  {{ tag.describe }}
                </template>
                {{ tag.name }}
              </a-tooltip>
            </a-tag>
          </span>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="openModal('edit', record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="openDeleteModal(record)">删除</a>
        </span>
      </a-table>
    </a-card>
    <a-modal
      destroyOnClose
      :title="current.mode === 'create' ? '新增角色' : '编辑角色权限'"
      :visible="modalVisible"
      @ok="handleOkClick"
      @cancel="closeModal">
      <div>
        <p v-if="current.mode === 'create'">唯一标识：<a-input placeholder="输入唯一标识，如：admin" v-model="current.name "></a-input></p>
        <p>角色名：<a-input placeholder="输入角色名，如：公众号推送者" v-model="current.displayName "></a-input></p>
        <p>角色描述：<a-textarea v-model="current.description" placeholder="该角色的权限、职责等"/></p>
        <a-table :data-source="current.permissions" :columns="modalColumns" :row-key="record => record.permission">
          <span slot="canCreate" slot-scope="text, record">
            <a-checkbox v-model="record.canCreate" :defaultChecked="record.canCreate" />
          </span>
          <span slot="canDelete" slot-scope="text, record">
            <a-checkbox v-model="record.canDelete" :defaultChecked="record.canDelete" />
          </span>
          <span slot="canView" slot-scope="text, record">
            <a-checkbox v-model="record.canView" :defaultChecked="record.canView" />
          </span>
          <span slot="canEdit" slot-scope="text, record">
            <a-checkbox v-model="record.canEdit" :defaultChecked="record.canEdit" />
          </span>
          <span slot="all" slot-scope="text, record">
            <a @click="onCheckAll(record)">全选</a>
          </span>
        </a-table>
      </div>
    </a-modal>
    <!-- 删除窗口 -->
    <a-modal
      title="删除窗口"
      :visible="deleteVisible"
      @ok="handleDeleteClick"
      @cancel="closeDeleteModal">
      <div>
        <span>你确定要删除<span style="color:red"> {{ this.current.displayName + '[' + this.current.name + ']' }} </span>这个角色吗</span>
      </div>
    </a-modal>
  </div>
</template>
<script>

import { GetPermissionRoles, GetPermissionPermissions, EditRole, AddRole, DeleteRole } from '@/api/permission'

export default {
  data () {
    return {
      modalVisible: false,
      deleteVisible: false,
      data: [],
      permissionList: [],
      // 权限表列属性
      columns: [
        {
          dataIndex: 'displayName',
          key: 'displayName',
          title: '角色',
          scopedSlots: { customRender: 'displayName' },
          width: 130
        },
        {
          title: '唯一标识',
          dataIndex: 'name',
          key: 'name',
          width: 100
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '权限',
          key: 'permissions',
          dataIndex: 'permissions',
          scopedSlots: { customRender: 'permissions' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: 130
        }
      ],
      current: {
        mode: 'create', // or: 'edit'
        name: '',
        displayName: '',
        description: '',
        permissions: [] // { canView: false, ... }
      },
      modalColumns: [
        {
          title: '权限名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '增添',
          key: 'canCreate',
          scopedSlots: { customRender: 'canCreate' }
        },
        {
          title: '删除',
          key: 'canDelete',
          dataIndex: 'canDelete',
          scopedSlots: { customRender: 'canDelete' }
        },
        {
          title: '查寻',
          key: 'canView',
          dataIndex: 'canView',
          scopedSlots: { customRender: 'canView' }
        },
        {
          title: '修改',
          key: 'canEdit',
          scopedSlots: { customRender: 'canEdit' }
        },
        {
          title: 'All',
          key: 'all',
          scopedSlots: { customRender: 'all' }
        }
      ]
    }
  },
  mounted () {
    // 获取表格初始数据
    this.loadPage()
  },
  created () {
    this.$setPageDataLoader(this.loadPage)
  },
  methods: {
    fillValues (role, permissionList) { // {}
      const defaultObject = function (permission, name, describe) {
        return { permission, name, describe, canCreate: false, canDelete: false, canEdit: false, canView: false }
      }
      const permissions = permissionList.map(per => {
        const item = role.permissions.find(rolPer => rolPer.permission === per.permission)
        if (item) {
          return {
            ...defaultObject(per.permission, per.name, per.describe),
            canCreate: item.canCreate,
            canDelete: item.canDelete,
            canEdit: item.canEdit,
            canView: item.canView
          }
        }
        return defaultObject(per.permission, per.name, per.describe)
      })
      return { ...role, permissions }
    },
    toPayload (role) {
      // remove false permissions
      return {
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        permissions: role.permissions.filter(per => per.canCreate || per.canEdit || per.canView || per.canDelete)
      }
    },
    loadPage () {
      GetPermissionRoles().then(res => {
        if (res.status === 200) {
          const roleList = res.data || []
          GetPermissionPermissions().then(res2 => {
            if (res2.status === 200) {
              const permissionList = res2.data || []
              this.permissionList = permissionList
              this.data = roleList.map(role => this.fillValues(role, permissionList))
            }
          })
        }
      })
    },
    onCheckAll (record) {
      const selected = !(record.canCreate && record.canDelete && record.canEdit && record.canView)
      record.canCreate = selected
      record.canDelete = selected
      record.canEdit = selected
      record.canView = selected
    },
    openModal (mode, record) {
      if (mode === 'create') {
        this.modalVisible = true
        const defaultRole = {
          name: '',
          displayName: '',
          description: '',
          permissions: []
        }
        const modalValues = { ...this.fillValues(defaultRole, this.permissionList), mode }
        this.current = JSON.parse(JSON.stringify(modalValues))
      } else if (mode === 'edit') {
        this.modalVisible = true
        const modalValues = {
          mode,
          name: record.name,
          displayName: record.displayName,
          description: record.description,
          permissions: record.permissions
        }
        this.current = JSON.parse(JSON.stringify(modalValues))
      }
    },
    openDeleteModal (record) {
      this.deleteVisible = true
      this.current = record
    },
    handleOkClick () {
      if (this.current.mode === 'create') {
        const payload = this.toPayload(JSON.parse(JSON.stringify(this.current)))
        AddRole(payload).then(res => {
          if (res.status === 201) {
            this.$message.success('添加成功')
          }
        }).then(_ => { this.loadPage() })
        this.closeModal()
      } else if (this.current.mode === 'edit') {
        const payload = this.toPayload(JSON.parse(JSON.stringify(this.current)))
        EditRole(payload).then(res => {
          if (res.status === 200) {
            this.$message.success('修改成功')
          }
        }).then(_ => { this.loadPage() })
        this.closeModal()
      }
    },
    // 点击取消编辑，数据还原
    closeModal () {
      this.modalVisible = false
    },
    handleDeleteClick () {
      const name = this.current.name
      DeleteRole(name).then(res => {
        if (res.status === 204) {
          this.$message.success('删除成功')
        }
      }).then(_ => { this.loadPage() })
      this.closeDeleteModal()
    },
    closeDeleteModal () {
      this.deleteVisible = false
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
