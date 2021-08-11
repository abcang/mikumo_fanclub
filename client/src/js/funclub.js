import "../css/style.scss"

$(function() {
  FastClick.attach(document.body);

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


// contributed by がおさん(@gaogao_9)
/* eslint-disable */
function MikumoCPSCounterClass() {
  var cnt = [];
  var ele = $('.count');
  var name = $('.name').map(function(i, e) { return $(e).text().match(/[^\s]+/)[0]; });
  var PAD = function(text, num) {
    for (var i = num; i--;) text = '0' + text;
    return text.slice(-num);
  };

  for (var i = ele.length; i--;) cnt.push([]);

  var self = this;
  var LOOP = function(text, flag, date) {
    text = [];
    flag = false;
    date = new Date();
    ele.each(function(i, e) {
      cnt[i].unshift($(e).text() - 0);
      if (cnt[i].length < 2) {
        flag = true;
        return;
      } if (cnt[i].length > 5) {
        cnt[i].length = 5;
      }
      text[i] = name[i] + 'の秒間カウント：' + ~~(self.getCurrentCPS(i)) + '回';
    });
    if (!flag) {
      text = text.join(',');
      text = '[' + PAD(date.getHours(), 2) + ':' + PAD(date.getMinutes(), 2) + ':' + PAD(date.getSeconds(), 2) + ']' + text;
      if (self.isShowLog) console.log(text);
    }
  };

  var timerId = null;
  self.isShowLog = true;
  self.start = function() {
    if (timerId != null) return;
    timerId = setInterval(LOOP, 1000);
  };
  self.stop = function() {
    if (timerId == null) return;
    clearInterval(timerId);
    timerId = null;
  };
  self.getTimerId = function() { return timerId; };
  self.getCurrentCPS = function(i) {
    if (timerId == null) return 1;
    if (!isNaN(i) && i !== null) {
      if (!cnt[i] || cnt[i].length == 1) return -1;
      return (cnt[i][0] - cnt[i][cnt[i].length - 1]) / (cnt[i].length - 1);
    }
    return cnt.map(function(e, i) {
      if (e.length < 2) return -1;
      return (e[0] - e[e.length - 1]) / (e.length - 1);
    });
  };
}

var mikumo;

$(function() {
  mikumo = new MikumoCPSCounterClass();
});

/* eslint-enable */

// example
// mikumo.isShowLog = false; //計測中にコンソールにログを吐くかを指定します(bool型)。デフォルトはtrueです。
// mikumo.start(); //計測を開始します
// mikumo.getTimerId(); //ループに使うタイマーidを参照します(読み取り専用)
// mikumo.getCurrentCPS(); //現在のCPS(Click Per Second)を表示します(引数なし:二人共,引数0:このはちゃんのみ,引数1:あんずちゃんのみ)
// mikumo.stop(); //計測をやめます
