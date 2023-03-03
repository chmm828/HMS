<template>
  <a-select mode="tags" style="width: 100%;" placeholder="请输入症状，按回车确认" @change="handleChangeSymptom">
    <a-select-option v-for="i in symptomData" :key="i.name">
      {{ i.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import Symptom from '@/components/DiaMsg/symptom.json'
export default {
  data () {
      return {
        symptomData: Symptom
      }
  },
  methods: {
    handleChangeSymptom (value) {
      // console.log(`selected ${value}`)
      this.$emit('changeSymptom', value)
    }
  }
}
</script>

<style>

</style>
