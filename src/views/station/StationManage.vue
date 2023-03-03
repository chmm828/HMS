<template>
  <div>
    <a-card :bordered="false">
      <a-button type="primary" @click="addStation" style="margin-bottom:10px;">
        新增小站
      </a-button>
      <a-table :columns="columns" rowKey="id" :data-source="dataSource" :loading="isLoading">
        <span slot="operation" slot-scope="text, record">
          <a @click="editStation(record)"><a-icon type="edit" /> 编辑</a>
          <a-divider type="vertical" />
          <a @click="editEquipment(record)">设备</a>
          <!-- <a>删除</a> -->
        </span>
        <span slot="doctors" slot-scope="text">
          <span v-for="item in text.doctors" :key="item.id">
            <a-tag>{{ item.nickname }}</a-tag>
          </span>
        </span>
        <span slot="stationStatus" slot-scope="text">
          <span style="color: #1890FF;" v-if="text.status === 'OPEN'"><a-icon type="smile" /> 营业中</span>
          <span style="color: orange;" v-if="text.status === 'CLOSED'"><a-icon type="coffee" /> 休息中</span>
          <span v-if="text.status === 'DISABLED'"><a-icon type="stop" /> 暂停</span>
        </span>
        <span slot="type" slot-scope="text">
          <a-tag color="blue" v-if="text.type === 'STATION'">健康小站</a-tag>
          <a-tag color="green" v-if="text.type === 'EXAMINATION'">体检中心</a-tag>
        </span>
      </a-table>
    </a-card>
    <HealthStationAdd
      v-if="stationVisible"
      :visible="stationVisible"
      :stationId="stationId"
      :stationInfo="stationInfo"
      @successAddStation="closeAddStationModel"
    />
    <StationEquipment
      v-if="equipmentVisible"
      :visible="equipmentVisible"
      :stationId="stationId"
      @closeModel="closeModel"
    />
  </div>
</template>

<script>
import HealthStationAdd from './components/HeathStationAdd.vue'
import StationEquipment from './components/StationEquipment.vue'
import { getStations, getStationInfo } from '@/api/station'
const columns = [
  {
    title: '小站名称',
    width: 100,
    dataIndex: 'name'
  },
  {
    title: '小站类型',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '店长',
    align: 'center',
    width: 80,
    dataIndex: 'manager.nickname'
  },
  {
    title: '联系电话',
    align: 'center',
    dataIndex: 'phone'
  },
  {
    title: '健康师',
    align: 'center',
    scopedSlots: { customRender: 'doctors' }
  },
  {
    title: '营业状态',
    width: 100,
    scopedSlots: { customRender: 'stationStatus' }
  },
  {
    title: '地址',
    dataIndex: 'address'
  },
  {
    title: '操作',
    width: 140,
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    HealthStationAdd,
    StationEquipment
  },
  data () {
    return {
      dataSource: [
      ],
      columns,
      stationVisible: false,
      stationId: null,
      stationInfo: {},
      equipmentVisible: false,
      isLoading: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const res = await getStations()
      if (res.status === 200) {
        this.dataSource = res.data
        this.isLoading = false
      }
    },
    addStation () {
      this.stationId = null
      this.stationVisible = true
    },
    closeAddStationModel () {
      this.stationVisible = false
      this.loadData()
    },
    editStation (record) {
      this.stationId = record.id
      getStationInfo(this.stationId).then(res => {
        this.stationInfo = res.data
        this.stationVisible = true
      })
      // editstation(record.id)
    },
    editEquipment (record) {
      this.equipmentVisible = true
      this.stationId = record.id
    },
    closeModel () {
      this.equipmentVisible = false
    }
  },
  created () {
    this.$setPageDataLoader(this.loadData)
  }
}
</script>

<style>

</style>
