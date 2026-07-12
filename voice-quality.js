(function(){
  var uppercaseStyle=document.createElement('style');
  uppercaseStyle.textContent='body,button,input,a,h1,h2,h3,p,small,span{ text-transform:uppercase }';
  document.head.appendChild(uppercaseStyle);
  if(!/(^|\/)index\.html$/.test(location.pathname)&&!location.pathname.endsWith('/')){
    var homeStyle=document.createElement('style');
    homeStyle.textContent='#global-home-button{position:fixed;right:10px;bottom:10px;z-index:9999;text-decoration:none;background:#ffd166;color:#20304a;border:3px solid #fff;border-radius:16px;padding:9px 13px;font:900 15px system-ui,sans-serif;box-shadow:0 5px 0 #9a7725}';
    document.head.appendChild(homeStyle);
    var homeButton=document.createElement('a');
    homeButton.id='global-home-button';
    homeButton.href='index.html';
    homeButton.textContent='🎡 INICI';
    document.body.appendChild(homeButton);
  }
  function scoreVoice(voice, language){
    var wanted=language.toLowerCase();
    var prefix=wanted.slice(0,2);
    var lang=(voice.lang||'').toLowerCase();
    var name=(voice.name||'').toLowerCase();
    var score=lang===wanted?100:lang.startsWith(prefix)?80:0;
    if(!score)return 0;
    if(prefix==='ca'&&(name.includes('joana')||name.includes('catal')))score+=20;
    if(voice.localService)score+=5;
    return score;
  }
  window.bestGameVoice=function(language){
    return speechSynthesis.getVoices().filter(function(v){return scoreVoice(v,language)>0}).sort(function(a,b){return scoreVoice(b,language)-scoreVoice(a,language)})[0];
  };
  window.sayGameText=function(text,language,next,rate){
    speechSynthesis.cancel();
    if(!speechSynthesis.getVoices().length){
      var spoken=false;
      var retry=function(){if(spoken)return;spoken=true;window.sayGameText(text,language,next,rate)};
      speechSynthesis.addEventListener('voiceschanged',retry,{once:true});
      setTimeout(retry,700);
      return;
    }
    var utterance=new SpeechSynthesisUtterance(text);
    utterance.lang=language;
    var voice=window.bestGameVoice(language);
    if(voice)utterance.voice=voice;
    utterance.rate=rate||.78;
    utterance.pitch=1;
    utterance.volume=1;
    utterance.onend=function(){if(next)next()};
    speechSynthesis.speak(utterance);
  };
})();
