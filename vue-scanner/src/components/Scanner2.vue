<template>
  <div class="Scanner">
    <div class="logo-box">
      <SvgIcon name="qrcode" color="#fff" size="40px" />
    </div>
    <div class="scan">
      <div class="border">
        <div id="reader" class="reader"></div>
        <div class="borderRadio left-top"></div>
        <div class="borderRadio right-top"></div>
        <div class="borderRadio right-bottom"></div>
        <div class="borderRadio left-bottom"></div>
      </div>
      
    </div>
    <div class="light-box">
      <SvgIcon name="qrcode" color="#fff" size="40px" />
    </div>
    <div class="about-box">
      <SvgIcon name="qrcode-about" color="#fff" size="40px" />
    </div>
    <div class="convert-box">
      <SvgIcon name="OnlineConverter" color="#fff" size="40px" />
    </div>
    <div class="language-box">
      <SvgIcon name="qrcode-language" color="#fff" size="40px" />
    </div>
    <div class="history-box" @click="openHistoryRecord">
      <SvgIcon name="qrcode-history" color="#fff" size="40px" />
    </div>
    <div class="input-box">
      <SvgIcon name="photo-camera" color="#fff" size="40px" />
    </div>
    <History v-model:DialogVisible="show" :list="historyRecords"/>
    <History v-model:DialogVisible="itemShow" :list="Record"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import History from './History.vue'
import SvgIcon from './SvgIcon.vue'
let html5QrCode = reactive<any>(null)
let historyRecords = reactive<any>([])
let Record = reactive<any>([])
let isShow = ref(false)
let show = ref(false)
let itemShow = ref(false)
let devicesInfo = ref('')
onMounted(() => {
  getCameras()
})

onUnmounted(() => {
  stop()
})

const getCameras = () => {
  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices && devices.length) {
        isShow.value = true
        html5QrCode = new Html5Qrcode('reader')
        // start开始扫描
        start()
      }
    })
    .catch((err) => {
      // alert('获取设备信息失败')
      console.log('获取设备信息失败', err) // 获取设备信息失败
      // showToast('获取设备信息失败')
    })
}
const start = () => {
  html5QrCode
    ?.start(
    { facingMode: 'environment' },
    { 
      fps: 120, // 设置每秒多少帧
      // qrbox: { width: 547, height: 547 } // 设置取景范围
      // scannable, rest shaded.
    },
    (decodedText: string, decodedResult: string) => {
      if (!historyRecords.includes(decodedText))  historyRecords.push(decodedText)
      console.log('result', decodedResult)
      Record[0] = decodedText
      itemShow.value = true
    }
  )
    .catch((err: string) => {
      console.log(`Unable to start scanning, error: ${err}`)
    })
}


const stop = () => {
  if (devicesInfo?.value) {
    html5QrCode
      .stop()
      .then((ignore: string) => {
        // QR Code scanning is stopped.
        console.log('QR Code scanning stopped.', ignore)
      })
      .catch((err: string) => {
        // Stop failed, handle it.
        console.log('Unable to stop scanning.', err)
      })
  }
}

const openHistoryRecord = () => {
  if (!Boolean(historyRecords.length)) return
  show.value = true
}
</script>

<style lang="scss" scoped>
.Scanner {
  height: calc(100vh - 40px);
  width: 100%;
  overflow: hidden;
  background-color: #111;
  display: grid;
  justify-content: center;
  align-items: center;
  position: relative;
  .logo-box {
    position: absolute;
    left: 10px;
    top: 10px;
  }
  .input-box {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  .about-box {
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  .light-box {
  }
  .convert-box {
    position: absolute;
    right: 10px;
    bottom: 150px;
  }
  .language-box {
    position: absolute;
    left: 10px;
    bottom: 150px;
  }
  .history-box {
    position: absolute;
    right: 50%;
    bottom: 10px;
    transform: translateX(50%);
  }
  .scan {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .border {
      position: relative;
    }
    .reader {
      width: 40vh;
    }
    .borderRadio {
      width: 25px;
      height: 25px;
      border-radius: 3px;
      border: 4px solid #fff;
    }
    .left-top {
      position: absolute;
      top: 0;
      left: 0;
      border-bottom: none;
      border-right: none;
    }
    .right-top {
      position: absolute;
      top: 0;
      right: 0;
      border-bottom: none;
      border-left: none;
    }
    .right-bottom {
      position: absolute;
      bottom: 0;
      right: 0;
      border-top: none;
      border-left: none;
    }
    .left-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      border-top: none;
      border-right: none;
    }
  }
}
</style>
