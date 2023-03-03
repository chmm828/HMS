<template>
  <div>
    <a-modal
      title="家庭分配"
      :width="800"
      :visible="dutyVisible"
      @ok="editDuty"
      @cancel="closeModal"
    >
      <a-table
        :columns="dutyColumns"
        :pagination="pagination"
        :data-source="homeData"
        :rowKey="(record,index)=>{return record.id}"
        :row-selection="rowSelection"
      >

      </a-table>
    </a-modal>
  </div>
</template>
<script>
import { searchCustomerUnderGroup as apiCustomerSearch } from '@/api/customer'
import { editHomeDuty as apiEditHomeDuty } from '@/api/manage'
// import { getUserInfo } from '@/api/login'
export default {
  props: {
    dutyVisible: {
      type: Boolean,
      default: false
    },
    accountCheckData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      // 分页
      pagination: {
        total: 0,
        current: 1,
        pageSize: 4,
        showTotal: total => `共 ${total} 条`, // 显示总数
        onChange: (page, pageSize) => this.onPageChange(page, pageSize) // 点击页码事件
      },
      homeData: [],
      oldHaveData: [],
      dutyColumns: [
        {
          title: '家庭名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: '家庭管理员',
          dataIndex: 'managerName',
          key: 'managerName',
          align: 'center'
        },
        {
          title: '负责人',
          dataIndex: 'craetedName',
          key: 'craetedName',
          align: 'center'
        }
      ],
      loginId: '',
      selectDuty: []
    }
  },
  methods: {
    // 翻页
    findHome () {
      const pages = {
        page: this.pagination.current,
        // size: 3
        size: this.pagination.pageSize
      }
    //   console.log('pages', pages)
      apiCustomerSearch('', pages).then(res => {
        if (res.status === 200) {
          const homeArr = res.data.content
          this.homeData = []
          for (let i = 0; i < homeArr.length; i++) {
            const addDuty = {
              id: homeArr[i].id,
              name: homeArr[i].name,
              managerName: homeArr[i].manager.nickname
            }
            if (homeArr[i].createdBy) {
              addDuty.craetedById = homeArr[i].createdBy.account
              addDuty.craetedName = homeArr[i].createdBy.nickname
            } else {
              addDuty.craetedById = ''
              addDuty.craetedName = ''
            }
            this.homeData.push(addDuty)
          }
        }
      })
    },
    closeModal () {
      this.$emit('closeDuty')
    },
    onPageChange (page, _pageSize) {
      this.pagination.current = page
      this.findHome()
    },
    onSelect (record, selected, selectedRows, nativeEvent) {
      if (selected) {
        this.selectDuty.push(record)
      } else {
        const delIndex = this.selectDuty.findIndex((val) => {
          return val.id === record.id
        })
        this.selectDuty.splice(delIndex, 1)
      }
    //   console.log(this.selectDuty, '选择的', record, 'selectedRows', selectedRows)
    },
    getCheckboxProps (record) {
      return {
        props: {
          name: record.name,
          defaultChecked: record.craetedById === this.loginId
        }
      }
    },
    editDuty () {
    //   console.log('selectDuty', this.selectDuty)
    //   console.log('homeData', this.homeData)
    //   console.log('oldHaveData', this.oldHaveData)
    //   console.log('accountCheckData.id', this.accountCheckData.account)
      const groupIds = this.selectDuty.map(item => {
        return item.id
      })
      const apiData = {
        account: this.accountCheckData.account,
        groupIds
      }
    //   console.log(apiData)
      apiEditHomeDuty(apiData).then(res => {
        if (res.status === 200) {
        //   console.log('修改成功')
          this.$message.success('家庭分配成功')
          this.closeModal()
        } else {
          this.$message.error('家庭分配失败' + res.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
    // 不带createdBy，查询所有家庭
    const pages = {
      page: this.pagination.current,
    //   size: 3
      size: this.pagination.pageSize
    }
    apiCustomerSearch('', pages).then(res => {
      if (res.status === 200) {
        // console.log('res.data', res.data)
        //   this.homeData = res.data.content
        this.pagination.total = res.data.totalElements
        const homeArr = res.data.content
        for (let i = 0; i < homeArr.length; i++) {
          const addDuty = {
            id: homeArr[i].id,
            name: homeArr[i].name,
            managerName: homeArr[i].manager.nickname
          }
          if (homeArr[i].createdBy) {
            addDuty.craetedById = homeArr[i].createdBy.account
            addDuty.craetedName = homeArr[i].createdBy.nickname
          } else {
            addDuty.craetedById = ''
            addDuty.craetedName = ''
          }
          this.homeData.push(addDuty)
        }
        // console.log('家庭', this.homeData)
      }
    })

    // 带createdBy，查询打开的账户负责的家庭
    this.loginId = this.accountCheckData.account
    // console.log('负责账号', this.loginId)
    const pagess = {
      page: 1,
      size: 1,
      createdBy: this.accountCheckData.id
    }
    // totalElements
    apiCustomerSearch('', pagess).then(res => {
      if (res.status === 200) {
        const totalElements = res.data.totalElements // 获取打开的用户最大责任家庭数
        const pagesss = {
          page: 1,
          size: totalElements,
          createdBy: this.accountCheckData.id
        }
        apiCustomerSearch('', pagesss).then(res => {
          const homeArr = res.data.content
          for (let i = 0; i < homeArr.length; i++) {
            const addDuty = {
              id: homeArr[i].id,
              name: homeArr[i].name,
              managerName: homeArr[i].manager.nickname
            }
            if (homeArr[i].createdBy) {
              addDuty.craetedById = homeArr[i].createdBy.account
              addDuty.craetedName = homeArr[i].createdBy.nickname
            } else {
              addDuty.craetedById = ''
              addDuty.craetedName = ''
            }
            this.oldHaveData.push(addDuty)
          }
          // console.log('有的家庭', this.oldHaveData)
          this.selectDuty = this.oldHaveData
          // console.log('所有', res.data)
        })
      }
    })
  },
  computed: {
    rowSelection () {
      return {
        columnTitle: ' ',
        hideDefaultSelections: false, // 全选
        onSelect: this.onSelect,
        getCheckboxProps: this.getCheckboxProps
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
