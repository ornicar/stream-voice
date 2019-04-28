const abbrs = [
  ['atm', "at the moment"],
  ['idk', "i don't know"],
  ['wtf', "what the fuck"],
  ['tysub ', "thank you so much for the sub"],
  ['brb', "be right back"],
  ['gtg', "I've got to go"],
  ['asap', "as soon as possible"],
  ['ty', "thank you"],
  ['ofc', "of course"],
  ['ikr', "i know right"],
  ['np', "no problem"],
  ['pita', "pain in the arse"],
  ['nvm', "nevermind"],
  ['af', "as fuck"],
  ['cba', "i can't be arsed"],
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
  ['setup', "I run neo vim. in alacritty. in i3. in archlinux"],
  ['tournament', "Please join the tournament! Link in the stream chat."],
  ['song', "The current song is displayed at the bottom of the screen."],
  ['when', "Lichess v2 will be released when it's ready. I don't know when that will happen. Could be 2 weeks, or 2 months."]
];

onload = () => {

  function say(txt) {
    if (txt === "info") {
      document.getElementById("info").style.display = "block";
    } else {
      fetch(`${url}:${port}/speak?message=${encodeURI(txt)}`);
      const voice = speechSynthesis.getVoices().filter(voice => voice.name == 'Google UK English Male')[0];
      const msg = new SpeechSynthesisUtterance(txt);
      msg.voice = voice;
      speechSynthesis.speak(msg);
      document.querySelector('.last').textContent = txt;
    }
  }

  document.querySelector('input').onkeypress = (e) => {
    if (e.keyCode == '13') {
      let txt = e.target.value;
      abbrs.forEach(r => {
        txt = txt.replace(new RegExp(`\\b${r[0]}\\b`, 'g'), r[1]);
      });
      presets.forEach(p => {
        if (txt == p[0]) txt = p[1];
      });
      if (txt) say(txt);
      e.target.value = '';
    }
  }
}