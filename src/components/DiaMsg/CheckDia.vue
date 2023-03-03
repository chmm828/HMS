<template>
  <div>
    <a-row :gutter="12">
      <a-col :span="6">
        <a-select class="selectDia" v-model="firstLev" @change="firstChange">
          <a-select-option v-for="first in firstData" :key="first.id">
            <a-tooltip placement="left">
              <template slot="title">
                {{ first.title }}
              </template>
              {{ first.title }}
            </a-tooltip>
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-select class="selectDia" v-model="secLev" @change="secChange" :disabled="!firstLev">
          <a-select-option v-for="second in secArr" :key="second.id">
            <a-tooltip placement="left">
              <template slot="title">
                {{ second.title }}
              </template>
              {{ second.title }}
            </a-tooltip>
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-select class="selectDia" v-model="thirdLev" @change="thirdChange" :disabled="!secLev">
          <a-select-option v-for="third in thirdArr" :key="third.id">
            <a-tooltip placement="left">
              <template slot="title">
                {{ third.title }}
              </template>
              {{ third.title }}
            </a-tooltip>
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-select class="selectDia" v-model="fourLev" @change="fourChange" :disabled="!thirdLev">
          <a-select-option v-for="four in fourArr" :key="four.id">
            <a-tooltip placement="left">
              <template slot="title">
                {{ four.title }}
              </template>
              {{ four.title }}
            </a-tooltip>
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="10">
        <a-select class="selectDia" v-model="fifthLev" @change="fifthChange" :disabled="!fourLev">
          <a-select-option v-for="fifth in fifthArr" :key="fifth.id">
            <a-tooltip placement="left">
              <template slot="title">
                {{ fifth.title }}
              </template>
              {{ fifth.title }}
            </a-tooltip>
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <!-- <a-row>
      <a-col>
        <a-button @click="clearDia">11</a-button>
      </a-col>
    </a-row> -->
  </div>
</template>
<script>
import { gethealthDis } from '@/api/health'
export default {
    data () {
        return {
            firstLev: null,
            secLev: null,
            thirdLev: null,
            fourLev: null,
            fifthLev: null,
            firstArr: [],
            secArr: [],
            thirdArr: [],
            fourArr: [],
            fifthArr: [],
            firstData: [
                {
                    id: '1',
                    name: '一级1'
                },
                {
                    id: '2',
                    name: '一级2'
                }
            ],
            secData: [
                {
                    id: '1',
                    idLast: '1',
                    name: '一级1二级1'
                },
                {
                    id: '2',
                    idLast: '1',
                    name: '一级1二级2'
                },
                {
                    id: '3',
                    idLast: '2',
                    name: '一级2二级1'
                },
                {
                    id: '4',
                    idLast: '2',
                    name: '一级2二级2'
                }
            ],
            thirdData: [
                {
                    id: '1',
                    idLast: '1',
                    name: '一级1二级1三级1'
                },
                {
                    id: '2',
                    idLast: '1',
                    name: '一级1二级1三级2'
                },
                {
                    id: '3',
                    idLast: '2',
                    name: '一级1二级2三级1'
                },
                {
                    id: '4',
                    idLast: '2',
                    name: '一级1二级2三级2'
                },
                {
                    id: '5',
                    idLast: '3',
                    name: '一级2二级1三级1'
                },
                {
                    id: '6',
                    idLast: '3',
                    name: '一级2二级1三级2'
                },
                {
                    id: '7',
                    idLast: '4',
                    name: '一级2二级2三级1'
                },
                {
                    id: '8',
                    idLast: '4',
                    name: '一级2二级2三级2'
                }
            ]
        }
    },
    mounted () {
      gethealthDis('-1').then(res => {
        if (res.status === 200) {
          // console.log('获取疾病诊断', res.data)
          this.firstData = res.data
        }
      })
    },
    methods: {
        firstChange (value) {
            const that = this
            this.firstData.forEach(function (val) {
                if (val.id === value) {
                    that.firstLev = val.title
                    const dia = value
                    that.$emit('changes', dia)
                }
            })
            gethealthDis(value).then(res => {
              if (res.status === 200) {
                this.secArr = res.data
              }
            })
            this.secArr.length = 0
            this.thirdArr.length = 0
            this.fourArr.length = 0
            this.fifthArr.length = 0
            this.secLev = null
            this.thirdLev = null
            this.fourLev = null
            this.fifthLev = null
        },
        secChange (value) {
            const that = this
            this.secArr.forEach(function (val) {
                if (val.id === value) {
                    that.secLev = val.title
                    const dia = value
                    that.$emit('changes', dia)
                }
            })
            gethealthDis(value).then(res => {
              if (res.status === 200) {
                this.thirdArr = res.data
              }
            })
            this.thirdArr.length = 0
            this.fourArr.length = 0
            this.fifthArr.length = 0
            this.thirdLev = null
            this.fourLev = null
            this.fifthLev = null
        },
        thirdChange (value) {
            const that = this
            this.thirdArr.forEach(function (val) {
                if (val.id === value) {
                    that.thirdLev = val.title
                    const dia = value
                    that.$emit('changes', dia)
                }
            })
            gethealthDis(value).then(res => {
              if (res.status === 200) {
                this.fourArr = res.data
              }
            })
            this.fourArr.length = 0
            this.fifthArr.length = 0
            this.fourLev = null
            this.fifthLev = null
        },
        fourChange (value) {
            const that = this
            this.fourArr.forEach(function (val) {
                if (val.id === value) {
                    that.fourLev = val.title
                    const dia = value
                    that.$emit('changes', dia)
                }
            })
            gethealthDis(value).then(res => {
              if (res.status === 200) {
                this.fifthArr = res.data
              }
            })
            this.fifthArr.length = 0
            this.fifthLev = null
        },
        fifthChange (value) {
            const that = this
            this.fifthArr.forEach(function (val) {
                if (val.id === value) {
                    that.fifthLev = val.title
                    const dia = value
                    that.$emit('changes', dia)
                }
            })
        },
        clearDia () {
          this.firstLev = null
          this.secLev = null
          this.thirdLev = null
          this.fourLev = null
          this.fifthLev = null
        }
    }
}
</script>
<style>
.selectDia{
  width: 230px;
  margin-top:2px;
}
</style>
