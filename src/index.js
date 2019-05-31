import Vue from 'vue';

const app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    cameras: [],
    now_camera: 1
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)'
    },
    selectCamera: function (camera) {
      var vm = this
      vm.now_camera == 1 ? vm.now_camera = -1 : vm.now_camera = 1
      vm.activeCameraId = camera.id
      vm.scanner.start(camera)
      vm.scanner.video.style.transform = `scaleX(${vm.now_camera})`
    }
  },
  mounted() {
    var vm = this
    // 開啟一個新的掃描
    // 宣告變數scanner，在html<video>標籤id為preview的地方開啟相機預覽。
    // Notice:這邊注意一定要用<video>的標籤才能使用，詳情請看他的github API的部分解釋。
    vm.scanner = new Instascan.Scanner({
      video: document.getElementById('preview')
    })
    // 調整鏡頭左右顛倒
    vm.scanner.video.style.transform = `scaleX(${vm.now_camera})`
    // IOS 必須加上playsinline
    vm.scanner.video.setAttribute("playsinline", true)

    //開始偵聽掃描事件，若有偵聽到印出內容。
    vm.scanner.addListener('scan', function (content) {
      alert('畫面即將跳轉至'+content)
      location.href = content
    })

    Instascan.Camera.getCameras().then(function (cameras) {
      //取得設備的相機數目
      vm.cameras = cameras
      if (cameras.length > 0) {
        vm.scanner.start(cameras[0])
      } else {
        alert("Sorry, No camera was detected in your device!")
      }
    }).catch(function (e) {
      console.error(e)
    })
  }
})
