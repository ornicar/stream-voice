const abbrs = [
  ['atm', "at the moment"],
  ['idk', "i don't know"],
  ['wtf', "what the fuck"],
  ['tysub ', "thank you so much for the sub"],
  ['gtg', "I've got to go"],
  ['asap', "as soon as possible"],
  ['ty', "thank you"],
  ['ofc', "of course"],
  ['ikr', "i know right"],
  ['np', "no problem"],
  ['pita', "pain in the arse"],
  ['imo', "in my opinion"],
  ['iirc', "if I remember correctly"],
  ['nvm', "nevermind"],
  ['af', "as fuck"],
  ['cba', "can't be arsed"],
  ['wip', "work in progress"],
  ['ianal', "I am not a lawyer"]
];
const presets = [
  ['dust', "Another bug bites the dust!"],
  ['next', "Lets move on to the next bug."],
  ['deploy', "Deploying to lichess.dev"],
  ['deployed', "lichess.dev has been updated."],
  ['hello', "Hello and welcome to the stream. I'm coding lichess v2."],
  ['brb', "I will be right back."],
  ['mic', "Microphone check. 1 2 1 2"],
  ['setup', "I run neo vim. In alacritty. In i3. In ArchLinux. On a Dell XPS15. My dotfiles: github.com/ornicar/dotfiles"],
  ['tournament', " Please join the tournament! Link in the stream chat."],
  ['song', "The current song is displayed at the bottom of the screen."],
  ['when', "Lichess v2 will be released on May 7th!"],
  ['lang', "Lichess backend is mostly made of Scala, with some Rust and PHP services. The data lives in MongoDB and ElasticSearch. Frontend is mostly Typescript/Snabbdom and Sass."]
];

onload = () => {

  function say(txt) {
    if (txt === "info") {
      document.getElementById("info").style.display = "block";
    } else {
      const voice = speechSynthesis.getVoices().filter(voice => voice.name == 'Google UK English Male')[0];
      const msg = new SpeechSynthesisUtterance(txt.replace(/(LUL)/, ''));
      msg.voice = voice;
      speechSynthesis.speak(msg);
      document.querySelector('.last').textContent = txt;
    }
  }

  document.querySelector('input').onkeypress = (e) => {
    if (e.keyCode == '13') {

      let orig = e.target.value;
      let txt = orig.trim();

      if (!txt) return;

      abbrs.forEach(r => {
        txt = txt.replace(new RegExp(`\\b${r[0]}\\b`, 'g'), r[1]);
      });
      presets.forEach(p => {
        if (txt == p[0]) txt = p[1];
      });

      if (txt && orig[0] != '!') say(txt); // don't say twitch commands out loud

      if (
        orig != 'mic' && // don't post mic checks
        orig[0] != ' ' // don't posts messages starting with a space
      ) {
        setTimeout(function() {
          fetch(`${url}:${port}/speak?message=${encodeURI(txt)}`);
        }, 1000);
      }

      e.target.value = '';
    }
  }
}
