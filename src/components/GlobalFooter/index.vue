<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://hms.yootane.com" target="_blank">Yootane HMS</a>
      <a href="https://yootane.com" target="_blank">Yootane Website</a>
      <!-- <a href="https://www.github.com/sendya/" target="_blank">@Sendya</a> -->
    </template>
    <template v-slot:copyright>
      <a href="https://hms.yootane.com" target="_blank">2022 © YOOTANE</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
