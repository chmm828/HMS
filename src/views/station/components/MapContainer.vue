<template>
  <div style="width: 100%;position: relative;">
    <a-select
      show-search
      v-model="keywords"
      allowClear
      placeholder="请输入地点进行搜索"
      @search="remoteMethod"
      @change="currentSelect"
      style="width: 100%;position: absolute;z-index:999"
    >
      <a-icon slot="suffixIcon" type="search" :style="{ fontSize: '16px', color: '#08c' }"/>
      <a-select-option
        v-for="item in options"
        :key="item.id"
        :value="item.name"
      >
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.district }}</span>
      </a-select-option>
    </a-select>
    <div id="container" class="container"></div>
    <!-- <p>详细地址：{{ form.address }}</p> -->
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
  // 安全密钥
  securityJsCode: 'eb96e52013d6520646ac369924abbfd3'
}
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      // 地图实例
      map: null,
      // 标记点
      marker: '',
      // 地址逆解析
      geoCoder: null,
      // 搜索提示
      AutoComplete: null,
      // 搜索关键字
      keywords: undefined,
      // 位置信息
      form: {
        lng: '',
        lat: '',
        address: '',
        adcode: '' // 地区编码
      },
      // 搜索节流阀
      loading: false,
      // 搜索提示信息
      options: []
    }
  },
  methods: {
    initMap () {
      AMapLoader.load({
        // 你申请的Key
        key: '8b22fedf142119fb608cfbd2226709a9',
        version: '2.0',
        // 需要用到的插件
        plugins: ['AMap.Geocoder', 'AMap.AutoComplete']
      })
        .then((AMap) => {
          this.map = new AMap.Map('container', {
            viewMode: '3D', // 是否为3D地图模式
            zoom: 11, // 初始化地图级别
            center: [114.01159, 22.60032] // 初始化地图中心点位置
          })
          // 地址逆解析插件
          this.geoCoder = new AMap.Geocoder({
            city: '010', // 城市设为北京，默认：“全国”
            radius: 1000 // 范围，默认：500
          })
          // 搜索提示插件
          this.AutoComplete = new AMap.AutoComplete({ city: '全国' })
          // 点击获取经纬度;
          this.map.on('click', (e) => {
            // 获取经纬度
            this.form.lng = e.lnglat.lng
            this.form.lat = e.lnglat.lat
            // 清除点
            this.removeMarker()
            // 标记点
            this.setMapMarker()
          })
        })
        .catch((err) => {
          // 错误
          console.log(err)
        })
    },
    // 标记点
    setMapMarker () {
      // 自动适应显示想显示的范围区域
      this.map.setFitView()
      this.marker = new window.AMap.Marker({
        map: this.map,
        position: [this.form.lng, this.form.lat]
      })
      // 逆解析地址
      this.toGeoCoder()
      this.map.setFitView()
      this.map.add(this.marker)
    },
    // 清除点
    removeMarker () {
      if (this.marker) {
        this.map.remove(this.marker)
      }
    },
    // 逆解析地址
    toGeoCoder () {
      const lnglat = [this.form.lng, this.form.lat]
      this.geoCoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          this.form.address = result.regeocode.formattedAddress
          this.form.adcode = result.regeocode.addressComponent.adcode
        }
        this.$emit('selectAddress', this.form)
      })
    },
    // 搜索
    remoteMethod (query) {
      console.log(query)
      if (query !== '') {
        // this.loading = true
        setTimeout(() => {
          // this.loading = false
          this.AutoComplete.search(query, (status, result) => {
            this.options = result.tips
          })
        }, 200)
      } else {
        // this.options = []
      }
      console.log('this.options', this.options)
    },
    // 选中提示
    currentSelect (val) {
      console.log('选中的值', val)
      // 清空时不执行后面代码
      if (!val) {
        return
      }
      this.options = this.options.filter(item => {
        return val === item.name
        //
      })
      this.form = {
        lng: this.options[0].location.lng,
        lat: this.options[0].location.lat,
        address: this.options[0].district + val.address,
        adcode: this.options[0].adcode
      }
      this.$emit('selectAddress', this.form)
      // 清除点
      this.removeMarker()
      // 标记点
      this.setMapMarker()
    }
  },
  mounted () {
    this.initMap()
    this.form.lng = this.formData.longitude
    this.form.lat = this.formData.latitude
    setTimeout(() => {
      this.setMapMarker()
    }, 1000)
  }
}
</script>
<style>
.container {
  width: 100%;
  height: 280px;
}
</style>
