/* not linting third-party code */
/* eslint-disable */
let markup = '';

export default function () {
  if (markup) {
    return markup;
  }

  let dn, lang, tpt, vrsn_style, splash_url, sslcenter_url, seal_url, u1, u2, tbar;
  let pageWidth = global.pageWidth, pageHeight = global.pageHeight, location = global.location;
  global.symcBuySSL = symcBuySSL;
  global.vrsn_splash = vrsn_splash;

  const document = {
    addEventListener: ()=>{},
    captureEvents: false,
    write: (str) => {markup += str}
  }

//dn=location.host || location.hostname;
// BEGIN NORTON CODE
dn="web.boo.st";
lang="en";
tpt="transparent";
vrsn_style="WW";
splash_url="https://trustsealinfo.websecurity.norton.com";
sslcenter_url="https://www.symantec.com/page.jsp?id=ssl-information-center";
seal_url="https://seal.websecurity.norton.com";

u1=splash_url+"/splash?form_file=fdf/splash.fdf&dn="+dn+"&lang="+lang;u2=seal_url+"/getseal?at=0&sealid=1&dn="+dn+"&lang="+lang+"&tpt="+tpt;var u5=sslcenter_url;var sopener;function symcBuySSL(){var win=window.open(u5,'_blank');win.focus();}
function vrsn_splash(){if(sopener&&!sopener.closed){sopener.focus();}else{tbar="location=yes,status=yes,resizable=yes,scrollbars=yes,width=560,height=500";var sw=window.open(u1,'VRSN_Splash',tbar);if(sw){sw.focus();sopener=sw;}}}
var ver=-1;var v_ua=navigator.userAgent.toLowerCase();var re=new RegExp("msie ([0-9]{1,}[\.0-9]{0,})");if(re.exec(v_ua)!==null){ver=parseFloat(RegExp.$1);}
var v_old_ie=(v_ua.indexOf("msie")!=-1);if(v_old_ie){v_old_ie=ver<5;}
function v_mact(e){var s;if(document.addEventListener){s=(e.target.name=="seal");if(s){vrsn_splash();return false;}}else if(document.captureEvents){var tgt=e.target.toString();s=(tgt.indexOf("splash")!=-1);if(s){vrsn_splash();return false;}}
return true;}
function v_mDown(event){if(document.addEventListener){return true;}
event=event||window.event;if(event){if(event.button==1){if(v_old_ie){return true;}
else{vrsn_splash();return false;}}else if(event.button==2){vrsn_splash();return false;}}else{return true;}}
document.write("<img name=\"seal\" src=\""+u2+"\" oncontextmenu=\"return false;\" border=\"0\" usemap=\"#sealmap_medium\" alt=\"\" /> ");document.write("<map name=\"sealmap_medium\" id=\"sealmap_medium\" >");document.write("<area  alt=\"Click to Verify - This site has chosen an SSL Certificate to improve Web site security\" title=\"\" href=\"javascript:vrsn_splash()\" shape=\"rect\" coords=\"0,0,115,58\" tabindex=\"-1\" style=\"outline:none;\" />");document.write("<area  alt=\"Click to Verify - This site has chosen an SSL Certificate to improve Web site security\" title=\"\" href=\"javascript:vrsn_splash()\" shape=\"rect\" coords=\"0,58,63,81\" tabindex=\"-1\" style=\"outline:none;\" />");document.write("<area  alt=\"\" title=\"\" href=\"javascript:symcBuySSL()\" shape=\"rect\" coords=\"63,58,115,81\" style=\"outline:none;\" />");document.write("</map>");if((v_ua.indexOf("msie")!=-1)&&(ver>=7)){var plat=-1;var re=new RegExp("windows nt ([0-9]{1,}[\.0-9]{0,})");if(re.exec(v_ua)!==null){plat=parseFloat(RegExp.$1);}
if((plat>=5.1)&&(plat!=5.2)){document.write("<div style='display:none'>");document.write("<img src='https://extended-validation-ssl.websecurity.symantec.com/dot_clear.gif'/>");document.write("</div>");}}
if(document.addEventListener){document.addEventListener('mouseup',v_mact,true);}
else{if(document.layers){document.captureEvents(Event.MOUSEDOWN);document.onmousedown=v_mact;}}
function v_resized(){if(pageWidth!=innerWidth||pageHeight!=innerHeight){self.history.go(0);}}
if(document.layers){pageWidth=innerWidth;pageHeight=innerHeight;window.onresize=v_resized;}
// END NORTON CODE
  
  global.dn = dn;
  global.lang = lang;
  global.tpt = tpt;
  global.vrsn_style = vrsn_style;
  global.splash_url = splash_url;
  global.sslcenter_url = sslcenter_url;
  global.seal_url = seal_url;
  global.u1 = u1;
  global.u2 = u2;
  global.tbar = tbar;

  return markup;
}