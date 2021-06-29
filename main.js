const allowedHosts = ["gosuslugi.ru", "mos.ru", "emias.info"];
function checkHost(host) {
	for (allowedHost of allowedHosts) {
	  if(host == allowedHost) return true;
	  if (host.endsWith("."+allowedHost)) {
		return true;
	  }
	}
	return false;
}
function onGoodQR(url) {
	showSomeColor('#0f0');
	if(url.protocol == "http:") url.protocol = "https://";
	window.open(url.href, "targetWindow");
}
function onBadQR(url, isStr = false) {
	showSomeColor('#f00');
	if(isStr) {
		alert("QR-код поддельный: содержит текст, а не ссылку");
		return;
	}
	alert("QR-код поддельный: ведёт на "+url.host);
}
function onScanSuccess(decodedText, decodedResult) {
	if(!backgroundIntact) return;
	try {
		url = new URL(decodedText);
	} catch (_) {
		onBadQR(decodedText, true);
		return;
	}
	if(!checkHost(url.host)) {
		onBadQR(url);
		return;
	}
	onGoodQR(url);
}

const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start({ facingMode: "environment" }, {
		fps: 10,
		qrbox: Math.min(getWidth(), getHeight()) * 0.9
	  }, onScanSuccess);
backgroundIntact = true;
function resetBackground() {
	backgroundIntact = true;
	$('body').css('background', 'transparent');
}
function showSomeColor(color) {
	backgroundIntact = false;
	$('body').css('background', color);
	setTimeout(resetBackground, 1000);
}
function getWidth() {
  return Math.max(
	document.body.scrollWidth,
	document.documentElement.scrollWidth,
	document.body.offsetWidth,
	document.documentElement.offsetWidth,
	document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
	document.body.scrollHeight,
	document.documentElement.scrollHeight,
	document.body.offsetHeight,
	document.documentElement.offsetHeight,
	document.documentElement.clientHeight
  );
}
function trimPrefix(str, prefix) {
	if (str.startsWith(prefix)) {
		return str.slice(prefix.length)
	} else {
		return str
	}
}
