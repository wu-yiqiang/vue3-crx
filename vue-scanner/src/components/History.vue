<template>
  <Dialog :visible="props.DialogVisible"  @update="cancelDialog">
    <div v-for="(item, index) in props.list" :key="index">
      <div class="item">
        <span>{{ item }}</span>
        <SvgIcon name="copy" color="#000" size="30px" @click.stop="handleCopy(item)"/>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue'
import SvgIcon from './SvgIcon.vue'
const props = defineProps({
  list: {
    require: true,
    type: Object,
    default: () => []
  },
  DialogVisible: {
    require: true,
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['update:DialogVisible'])

function handleCopy(str: string) {
  var aux = document.createElement('input')
  aux.setAttribute('value', str)
  document.body.appendChild(aux)
  aux.select()
  document.execCommand('copy')
  document.body.removeChild(aux)
}

function cancelDialog() {
  emit('update:DialogVisible', false)
}
</script>

<style lang="scss" scoped>
.Dialog {
  .item {
    display: flex;
    align-items: center;
  }
}
</style>
