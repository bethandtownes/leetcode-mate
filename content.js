injectJSListener();

document.addEventListener('keydown', async function onEvent(e) {
    e = e || window.e;
    if (e.key == "Escape") {
	DEBUG("escape pressed");
	toggleOrCreateSubmissionDialog();
    }
    if (e.ctrlKey && e.keyCode === 13) {
	document.querySelector('.submit__2ISl').click(); // action
	killSubmissionPane();
	drawSubmissionPane();
	// (async function loop() {
	//     for (let i = 0; i < 30; i++) {
	//     	const status = await currentStatus();
	//     	DEBUG("try: " + i + ", " + status);
	// 	if (status == "Console ") {
	// 	    displaySubmissionResult(false);
	// 	    break;
	// 	}
	//     }
	// })();
    }

    if (e.altKey && e.key == "Enter") {
	DEBUG("[command] runtest");
	if (document.getElementById("spane") == undefined) {
	    DEBUG("no spane found, create an empty one");
	    displaySubmissionResult(true);
	}
	else {
	    runTestCase();
	    showSubmissionPane();
	}
    }
});


DEBUG("[loaded] content.js");
