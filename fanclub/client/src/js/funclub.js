import '../css/style.scss';
import domready from 'domready';

const socket = io();

class Character {
  constructor(name) {
    this.timeout = null;
    this.count = 0;
    this.msgElement = document.querySelector(`.${name} .msg`);
    this.countWrapperElement = document.querySelector(`.${name} .love-count`);
    this.countElement = document.querySelector(`.${name} .count`);

    const button = document.querySelector(`.${name} button`);
    button.addEventListener('click', () => {
      socket.emit('love', { type: name });
    });
  }

  setCount(count) {
    this.count = count;
    this.countElement.innerText = count;
  }

  increment() {
    this.setCount(this.count + 1);
    if (!this.timeout) {
      this.msgElement.classList.add('shake-rumble', 'shake-constant', 'msg-show');
      this.countWrapperElement.classList.add('shake-rumble', 'shake-constant');
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        this.msgElement.classList.remove('shake-rumble', 'shake-constant', 'msg-show');
        this.countWrapperElement.classList.remove('shake-rumble', 'shake-constant');
        this.timeout = null;
      },
      1000,
    );
  }
}

domready(() => {
  const visitorCountElement = document.querySelector('.visitor-count');
  const conoha = new Character('conoha');
  const anzu = new Character('anzu');

  socket.on('init', (data) => {
    conoha.setCount(data.conoha);
    anzu.setCount(data.anzu);
  });

  socket.on('love', (data) => {
    switch (data.type) {
      case 'conoha':
        conoha.increment();
        break;

      case 'anzu':
        anzu.increment();
        break;

      default:
        break;
    }
  });

  socket.on('visitor', (data) => {
    visitorCountElement.innerText = data.count;
  });

  // eslint-disable-next-line no-console
  console.log('あなたの愛はわかりますが、一度に100以上送るのはやめましょう。');
});
