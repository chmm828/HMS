<template>
  <div>
    <a-row>
      <a-col :span="6">
        <a-select placeholder="一级行政区" v-model="checkPro" style="" @change="handleProvinceChange">
          <a-select-option v-for="province in provinceData" :key="province.code">
            {{ province.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6" :push="1">
        <a-select :disabled="!checkPro" placeholder="二级行政区" v-model="checkCity" @change="handleCityChange">
          <a-select-option v-for="city in cityArr" :key="city.code">
            {{ city.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6" :push="2">
        <a-select :disabled="!checkCity" placeholder="三级行政区" v-model="checkArea" @change="handleAreaChange">
          <a-select-option v-for="area in areaArr" :key="area.code">
            {{ area.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6" :push="3">
        <a-select :disabled="!checkArea" placeholder="四级行政区" v-model="checkStreet" @change="handleStreetChange">
          <a-select-option v-for="street in streetArr" :key="street.code">
            {{ street.name }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import provinces from './AddressFile/provinces.json'
import cities from './AddressFile/cities.json'
import areas from './AddressFile/areas.json'
import streets from './AddressFile/streets.json'

export default {
    data () {
        return {
            provinceData: provinces,
            cityData: cities,
            areaData: areas,
            streetsData: streets,
            cityArr: [],
            areaArr: [],
            streetArr: [],
            checkPro: undefined,
            checkCity: undefined,
            checkArea: undefined,
            checkStreet: undefined
        }
    },
    mounted () {
    },
    methods: {
        handleProvinceChange (value) {
            // console.log('1')
            var that = this
            // console.log(this.provinceData)
            // 循环省级
            this.provinceData.forEach(function (val) {
                if (val.code === value) {
                    that.checkPro = val.name
                }
            })
            this.cityArr.length = 0
            this.areaArr.length = 0
            this.streetArr.length = 0
            // 循环市级,根据选择的省构造市级数组
            this.cityData.forEach(function (value2) {
                if (value2.provinceCode === value) {
                    const obj = { code: '', name: '' }
                    obj.code = value2.code
                    obj.name = value2.name
                    that.cityArr.push(obj)
                }
            })
            // 默认市
            // that.checkCity = that.cityArr[0].name
            that.checkCity = undefined
            that.checkArea = undefined
            that.checkStreet = undefined
        },
        handleCityChange (value) {
            var that = this
            this.areaArr.length = 0
            this.streetArr.length = 0
            // 循环区级,根据选择的省构造区级表
            this.areaData.forEach(function (value3) {
                if (value3.cityCode === value) {
                    const obj = { code: '', name: '' }
                    obj.code = value3.code
                    obj.name = value3.name
                    that.areaArr.push(obj)
                }
            })
            // 循环市级
            this.cityArr.forEach(function (value2) {
                if (value2.code === value) {
                    that.checkCity = value2.name
                }
            })
            // console.log(this.checkCity)
            // that.checkArea = that.areaArr[0].name
            that.checkArea = undefined
            that.checkStreet = undefined
        },
        handleAreaChange (value) {
            var that = this
            this.streetArr.length = 0
            // 循环区级
            this.areaArr.forEach(function (value2) {
                if (value2.code === value) {
                    that.checkArea = value2.name
                }
            })
            this.streetsData.forEach(function (value3) {
                if (value3.areaCode === value) {
                    const obj = { code: '', name: '' }
                    obj.code = value3.code
                    obj.name = value3.name
                    that.streetArr.push(obj)
                }
            })
            // this.checkStreet = this.streetArr[0].name
            this.checkStreet = undefined
        },
        handleStreetChange (value) {
            // console.log(value)
            var that = this
            this.streetArr.forEach(function (value2) {
                if (value2.code === value) {
                    that.checkStreet = value2.name
                }
            })
            const address = { pro: '', city: '', area: '', street: '' }
            address.pro = this.checkPro
            address.city = this.checkCity
            address.area = this.checkArea
            address.street = this.checkStreet
            this.$emit('changes', address)
        },
        setAddress (value) {
            this.checkPro = value.province
            this.checkCity = value.city
            this.checkArea = value.area
            this.checkStreet = value.street
            // console.log('省', value.province, '市', value.city, '区', value.area, '街道', value.street)
            this.cityArr.length = 0
            this.areaArr.length = 0
            this.streetArr.length = 0
            const that = this
            var provinceCode = null
            var cityCode = null
            var areaCode = null
            // 获取市
            this.provinceData.forEach(function (value1) {
                if (value1.name === value.province) {
                    provinceCode = value1.code
                }
            })
            this.cityData.forEach(function (value2) {
                if (value2.provinceCode === provinceCode) {
                  // console.log('+++', value2)
                  const obj = { code: '', name: '' }
                      obj.code = value2.code
                      obj.name = value2.name
                      that.cityArr.push(obj)
                }
            })
            // console.log(this.cityArr)
            // 获取市
            // 获取区
            this.cityData.forEach(function (value3) {
                if (value3.name === value.city) {
                    // console.log('value3', value3)
                    cityCode = value3.code
                    // console.log('市的code', cityCode)
                }
            })
            this.areaData.forEach(function (value4) {
                if (value4.cityCode === cityCode) {
                    const obj = { code: '', name: '' }
                    obj.code = value4.code
                    obj.name = value4.name
                    that.areaArr.push(obj)
                }
            })
            // console.log(this.areaArr)
            // 获取区
            // 获取街道
            this.areaData.forEach(function (value5) {
                if (value5.name === value.area) {
                    areaCode = value5.code
                    // console.log(areaCode, 'value5', value5.name)
                }
            })
            this.streetsData.forEach(function (value6) {
                if (value6.areaCode === areaCode) {
                    // console.log('value6', value6)
                    const obj = { code: '', name: '' }
                    obj.code = value6.code
                    obj.name = value6.name
                    that.areaArr.push(obj)
                }
            })
            // 获取街道
        }
    }
}
</script>

<style>
.qq{
  margin-right: 10px;
}
</style>
