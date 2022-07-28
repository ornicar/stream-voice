const abbrs = [
  ['atm', 'at the moment'],
  ['idk', "i don't know"],
  ['wtf', 'what the fuck'],
  ['wdym', 'what do you mean'],
  ['tysub ', 'thank you so much for the sub '],
  ['gtg', "I've got to go"],
  ['asap', 'as soon as possible'],
  ['ty', 'thank you'],
  ['ofc', 'of course'],
  ['ikr', 'i know right'],
  ['np', 'no problem'],
  ['pita', 'pain in the arse'],
  ['imo', 'in my opinion'],
  ['iirc', 'if I remember correctly'],
  ['nvm', 'nevermind'],
  ['af', 'as fuck'],
  ['cba', "can't be arsed"],
  ['wip', 'work in progress'],
  ['yw', "you're welcome"],
  ['tbh', 'to be honest'],
  ['ftw', 'for the win'],
  ['fsm', 'ornicaFsm'],
  ['caf', 'caffeine level:'],
];
const presets = [
  ['rust', "I'm learning rust. Please share your suggestions and comments about my code!"],
  [
    'lila-http',
    "I'm working on lila-http, a new service written in rust that offloads some traffic away from lila. While learning rust.",
  ],
  ['voice', "Here's my text-to-speach setup with twitch chat integration: https://github.com/ornicar/stream-voice"],
  ['dust', 'Another bug bites the dust!'],
  ['next', 'Lets move on to the next bug.'],
  ['deploy', 'Deploying to lichess.dev'],
  ['deployed', 'lichess.dev has been updated.'],
  ['hello', 'Hello and welcome to the stream.'],
  ['hi', 'Hello and welcome to the stream.'],
  ['brb', 'I will be right back.'],
  ['mic', 'Microphone check. 1 2 1 2'],
  ['setup', 'I run neo vim. In alacritty. In i3. On ArchLinux.'], //. My dotfiles: github.com/ornicar/dotfiles"],
  ['dotfiles', 'My dotfiles: github.com/ornicar/dotfiles'],
  ['tournament', ' Please join the tournament! Link in the stream chat.'],
  ['song', 'The current song is displayed at the bottom of the screen.'],
  ['spotify', "You'll find the tunes on my spotify profile: https://open.spotify.com/user/zapotefeliz"],
  [
    'lang',
    'Lichess backend is mostly made of Scala, with a bit of Rust and python. The data lives in MongoDB and ElasticSearch. Frontend is mostly Typescript/Snabbdom and Sass.',
  ],
  ['source', 'You can get all the Lichess source code at https://lichess.org/source'],
  ['ublock', 'Be safe and use a malware blocker: getublockorigin.com'],
  [
    'bugs',
    'There are a ton of bugs waiting to be found, and I need your help to find them. Please play games on lichess.dev and report the bugs to me!',
  ],
  ['cheers', "Cheers! That's very nice of you."],
  [
    'misc',
    "I'm going through bug reports, pull requests, github issues, and API questions on discord. Doing maintenance and little improvements here and there.",
  ],
  [
    'scala',
    'I chose scala for its decent support for functional programming, and for its strong static typing. Haskell was another option, but the JVM runs great in production, and its ecosystem is richer.',
  ],
  ['costs', 'Lichess is a non-profit association. We publish all our costs for full transparency on lichess.org/costs'],
  ['today', 'Today, we get shit done.'],
  ['colander', 'I am wearing a colander, the religious headgear of the Church of the Flying Spaghetti Monster. Ramen'],
  [
    'workstation',
    'PC specs: custom build, NZXT h210i, Ryzen 3900x, 64GB 3600MHz RAM, Radeon RX580, Kraken X53. Part list: https://pcpartpicker.com/user/thibaultd/saved/qxw2mG Video: https://www.youtube.com/watch?v=QFo3q_mdTTA',
  ],
  ['appeal', 'The only way to appeal a ban is through lichess.org/appeal. Please do not discuss it here.'],
  [
    'archi',
    "Here's the production architecture: https://github.com/lichess-org/lila#production-architecture-as-of-july-2022",
  ],
];

onload = () => {
  let now = "I'm building Lichess.";

  function say(txt) {
    if (txt === 'info') {
      document.getElementById('info').style.display = 'block';
    } else {
      const voices = speechSynthesis.getVoices();
      const voice = speechSynthesis.getVoices().filter(voice => voice.name == 'Google UK English Male')[0];
      // const voice = voices.filter(v => v.name.includes("fran"))[0];
      txt = txt.replace(/(LUL)/, '').replace('leechess', 'lichess').replace('ahah', 'haha');
      const msg = new SpeechSynthesisUtterance(txt);
      msg.voice = voice;
      // msg.pitch = 0.9;
      speechSynthesis.speak(msg);
      document.querySelector('.last').textContent = txt;
    }
  }

  document.querySelector('input').onkeypress = e => {
    if (e.keyCode == '13') {
      let orig = e.target.value;
      let txt = orig.trim();

      if (!txt) return;

      if (txt.startsWith('now: ')) {
        txt = txt.slice(5);
        now = txt;
      } else if (txt == 'now') {
        txt = now;
      }

      abbrs.forEach(r => {
        txt = txt.replace(new RegExp(`\\b${r[0]}\\b`, 'g'), r[1]);
      });
      presets.forEach(p => {
        if (txt == p[0]) txt = p[1];
      });

      if (txt && orig[0] != '!' && orig[0] != '?' && !/https?:/.test(txt)) say(txt); // don't say these out loud

      if (
        orig != 'mic' && // don't post mic checks
        orig[0] != ' ' // don't posts messages starting with a space
      ) {
        setTimeout(function () {
          fetch(`${url}:${port}/speak?message=${encodeURI(txt)}`);
        }, 1000);
      }

      e.target.value = '';
    }
  };
};
