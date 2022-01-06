import '../css/style.scss';

const socket = io();

class Character {
  constructor(name) {
    this.timeout = null;
    this.count = 0;
    this.msg_selector = `.${name} .msg`;
    this.count_wrapper_selector = `.${name} .love-count`;
    this.count_selector = `.${name} .count`;
    this.button_selector = `.${name} button`;

    $(this.button_selector).on('click', () => {
      socket.emit('love', { type: name });
    });
  }

  setCount(count) {
    this.count = count;
    $(this.count_selector).text(count);
  }

  increment() {
    this.setCount(this.count + 1);
    if (!this.timeout) {
      $(this.msg_selector).addClass('shake-rumble shake-constant msg-show')
      $(this.count_wrapper_selector).addClass('shake-rumble shake-constant');
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      () => {
        $(this.msg_selector).removeClass('shake-rumble shake-constant msg-show')
        $(this.count_wrapper_selector).removeClass('shake-rumble shake-constant');
        this.timeout = null;
      },
      1000,
    );
  }
}

$(() => {
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
    $('.visitor-count').text(data.count);
  });

  // eslint-disable-next-line no-console
  console.log('あなたの愛はわかりますが、一度に100以上送るのはやめましょう。');
});
