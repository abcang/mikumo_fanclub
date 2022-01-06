import "../css/style.scss"

$(function() {
  var socket = io();

  var jrumbleOption = {
    x: 1,
    y: 1,
    rotation: 2,
    speed: 50
  };

  function Character(name) {
    this.timeout = null;
    this.count = 0;
    this.msg_selector = '.' + name + ' .msg';
    this.count_selector = '.' + name + ' .count';
    this.button_selector = '.' + name + ' button';

    $(this.msg_selector).jrumble(jrumbleOption);
    $(this.count_selector).jrumble(jrumbleOption);

    $(this.button_selector).on('click', function() {
      socket.emit('love', { type: name });
    });
  }

  Character.prototype.setCount = function(count) {
    this.count = count;
    $(this.count_selector).text(count);
  };

  Character.prototype.increment = function() {
    this.setCount(this.count + 1);
    if (!this.timeout) {
      $(this.msg_selector)
        .stop()
        .animate({ opacity: 1 }, 0)
        .trigger('startRumble');
      $(this.count_selector).trigger('startRumble');
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout((function() {
      $(this.msg_selector)
        .animate({ opacity: 0 }, 1000)
        .trigger('stopRumble');
      $(this.count_selector).trigger('stopRumble');
      this.timeout = null;
    }).bind(this), 1000);
  };

  var conoha = new Character('conoha');
  var anzu = new Character('anzu');

  socket.on('init', function(data) {
    conoha.setCount(data.conoha);
    anzu.setCount(data.anzu);
  });

  socket.on('love', function(data) {
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

  socket.on('visitor', function(data) {
    $('.visitor-count').text(data.count);
  });

  // eslint-disable-next-line no-console
  console.log('あなたの愛はわかりますが、一度に100以上送るのはやめましょう。');
});

