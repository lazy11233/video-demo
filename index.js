const player = new VideoPlayer('.shadow .player');
const shadow = document.querySelector('.shadow');
const button = document.querySelector('button');
button.addEventListener('click', () => {
  shadow.classList.remove('hidden');
  player.play('./video.mp4');
});