const icons = {
  play: '&#xe619;',
  pause: '&#xe618;',
  fullscreen: '&#xe7a6;',
  sound: '&#xe662;',
  mute: '&#xe606;'
};

class VideoPlayer {
  constructor(playerElement) {
    this.moving = false;
    this.$audio = document.querySelector(playerElement);
    this.$videoContainer = document.querySelector('.video-container');
    this.$audio.autoplay = true;
    this.$audio.loop = true;
    this.$audio.volume = 0.5;

    this.$controller = document.querySelector('.video-container .controller');
    this.$playButton = this.$controller.querySelector('.play-button');
    this.$progressBox = this.$controller.querySelector('.progress-box .progress-box__shadow');
    this.$progress = this.$controller.querySelector('.progress-bar');
    this.$soundBar = this.$controller.querySelector('.sound-bar');
    this.$fullscreenButton = this.$controller.querySelector('.fullscreen');
    this.$pin = this.$progress.querySelector('.progress-bar__circle');
    this.statusClock = '';
    this.bindEvent();
  }

  play(url) {
    this.$audio.src = url;
  }

  pause() {
    this.$audio.pause();
  }

  updateStatus() {
    let min = Math.floor(this.$audio.currentTime / 60);
    let sec = Math.floor(this.$audio.currentTime % 60);
    sec = sec > 10 ? "" + sec : "0" + sec;
    this.$controller.querySelector(".current-time").innerHTML = "0" + min + ":" + sec;
    let percent = this.$audio.currentTime / this.$audio.duration;
    this.$controller.querySelector(".progress-bar__current").style.width = percent * 100 + '%';
    this.$controller.querySelector(".progress-bar__circle").style.left = percent * 100 + '%';
  }

  bindEvent() {
    const _this = this;
    this.$playButton.addEventListener('click', () => {
      const icon = this.$playButton.querySelector('.iconfont');
      if (icon.classList.contains('play')) {
        icon.classList.remove('play');
        icon.innerHTML = icons.pause;
        this.$audio.play();
      } else {
        icon.classList.add('play');
        icon.innerHTML = icons.play;
        this.$audio.pause();
      }
    });
    this.$progress.addEventListener('click', event => {
      const barWidth = parseFloat(window.getComputedStyle(this.$progress).width);
      let percent = event.offsetX / barWidth;
      this.$audio.currentTime = this.$audio.duration * percent;
      const pin = this.$progress.querySelector('.progress-bar__circle');
      const bar = this.$progress.querySelector('.progress-bar__current');
      pin.style.left = event.offsetX + 'px';
      bar.style.width = event.offsetX + 'px';
    });
    this.$audio.addEventListener('play', () => {
      clearInterval(this.statusClock);
      this.statusClock = setInterval(function () {
        _this.updateStatus();
      }, 1000);
    });
    this.$audio.addEventListener("pause", function () {
      clearInterval(this.statusClock);
    });
    this.$soundBar.addEventListener('click', event => {
      const barWidth = parseFloat(window.getComputedStyle(this.$soundBar).width);
      this.$audio.volume = event.offsetX / barWidth;
      const pin = this.$soundBar.querySelector('.sound-bar__circle');
      const bar = this.$soundBar.querySelector('.sound-bar__current');
      pin.style.left = event.offsetX + 'px';
      bar.style.width = event.offsetX + 'px';
    });
    this.$fullscreenButton.addEventListener('click', () => {
      if (this.$fullscreenButton.classList.contains('open')) {
        this.$fullscreenButton.classList.remove('open');
        this.$videoContainer.classList.remove('open');
      } else {
        this.$fullscreenButton.classList.add('open');
        this.$videoContainer.classList.add('open');
        this.$audio.requestFullscreen();
      }
    });
    this.$pin.addEventListener('mousedown', () => {
      this.moving = true;
      this.$progressBox.style.display = 'block'
    });
    this.$progressBox.addEventListener('mousemove', event => {
      event.stopPropagation();
      if (this.moving) {
        clearInterval(this.moveClock);
        const barWidth = parseFloat(window.getComputedStyle(this.$progress).width);
        let percent = event.offsetX / barWidth;
        this.$audio.currentTime = this.$audio.duration * percent;
        const pin = this.$progress.querySelector('.progress-bar__circle');
        const bar = this.$progress.querySelector('.progress-bar__current');
        pin.style.left = event.offsetX + 'px';
        bar.style.width = event.offsetX + 'px';

      }
    });
    document.addEventListener('mouseup', () => {
      this.moving = false
      this.$progressBox.style.display = 'none'
    })
  }
}
