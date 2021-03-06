// 此處使用的instascan非官方版本，
// 由https://github.com/schmich/instascan/issues/182 的quocthai95 網友所提供
// github 連結：https://github.com/quocthai95/instascan.git
const app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    cameras: [],
    now_camera: 0,
    side: 1
  },
  mounted() {
    var vm = this
    vm.init();
    vm.reverseCamera();
    vm.fixIOS();
    vm.scanEvent();
    vm.getCameras();
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)'
    },
    selectCamera: function (camera, index) {
      var vm = this
      if (vm.now_camera !== index) {
        vm.now_camera = index;
        vm.side == 1 ? vm.side = -1 : vm.side = 1;
        vm.scanner.start(camera);
        vm.reverseCamera(vm.side);
      }
      // vm.activeCameraId = camera.id
    },
    // 開啟一個新的掃描
    // 宣告變數scanner，在html<video>標籤id為preview的地方開啟相機預覽。
    // Notice:這邊注意一定要用<video>的標籤才能使用，詳情請看他的github API的部分解釋。
    init: function() {
      this.scanner = new Instascan.Scanner({
        video: document.getElementById('preview')
      });
    },
    // 調整鏡頭左右顛倒
    reverseCamera: function(side) {
      const vm = this;
      vm.scanner.video.style.transform = `scaleX(${side})`;
    },
    // IOS 必須加上playsinline
    fixIOS: function() {
      this.scanner.video.setAttribute("playsinline", true);
    },
    //開始偵聽掃描事件，若有偵聽到印出內容
    scanEvent: function() {
      this.scanner.addListener('scan', function (content) {
        alert('畫面即將跳轉至\n'+content)
        location.href = content
      })
    },
    //取得設備的相機數目
    getCameras: function() {
      const vm = this;
      Instascan.Camera.getCameras().then(function (cameras) {
        console.log(cameras);
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
  }
})
