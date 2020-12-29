injectJSListener();

document.addEventListener('keydown', async function onEvent(e) {
    e = e || window.e;
    if (e.altKey && e.key == "Escape") {
	DEBUG("alt + escape pressed");
	toggleOrCreateSubmissionDialog();
    }
    if (e.ctrlKey && e.keyCode === 13) {
	document.querySelector('.submit__2ISl').click(); // action
	killSubmissionPane();
	drawSubmissionPane();
    }

    if (e.altKey && e.key == "p") {
	toggleSidePanel();
    }

    if (e.altKey && e.key == "`") {
	toggleProblemPanel();
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
