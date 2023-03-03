<template>
  <div>
    <a-modal
      title="设备管理"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="1100"
    >
      <a-button type="primary" @click="editEquipment">新增设备</a-button>
      <a-table :columns="columns" :data-source="dataSource">
        <span slot="operation" slot-scope="text, scope">
          <a @click="editEquipment(scope)">编辑</a>
          <a-divider type="vertical" />
          <a style="color:red">删除</a>
        </span>
      </a-table>
    </a-modal>
    <EditEquipment
      v-if="editVisible"
      :editVisible="editVisible"
      :equipmentData="equipmentData"
      @closeEditModel="closeEditModel"
    />
  </div>
</template>

<script>
import EditEquipment from './EditEquipment.vue'
const columns = [
  {
    title: '设备编号',
    dataIndex: 'number'
  },
  {
    title: '设备名称',
    dataIndex: 'name'
  },
  {
    title: '状态',
    dataIndex: 'status'
  },
  {
    title: '型号',
    dataIndex: 'model'
  },
  {
    title: '启用时间',
    dataIndex: 'enableTime'
  },
  {
    title: '生产日期',
    dataIndex: 'productionTime'
  },
  {
    title: '厂商',
    dataIndex: 'manufacturer'
  },
  {
    title: '备注',
    dataIndex: 'remarks'
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
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
    closeModel: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  components: {
    EditEquipment
  },
  data () {
    return {
      columns,
      dataSource: [{
        number: '001',
        status: '检修',
        name: '验光机',
        model: 'MD100736',
        enableTime: '2022-1-1',
        productionTime: '2021-11-16',
        manufacturer: '广东省深圳市xxx厂',
        remarks: '-',
        operation: '编辑'
      }],
      editVisible: false,
      equipmentData: {}
    }
  },
  methods: {
    handleOk () {
      this.$emit('closeModel')
    },
    handleCancel () {
      this.$emit('closeModel')
    },
    editEquipment (scope) {
      this.editVisible = true
      this.equipmentData = scope
    },
    closeEditModel () {
      this.editVisible = false
    }
  }
}
</script>

<style>

</style>
