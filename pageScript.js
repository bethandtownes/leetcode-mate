
console.log("[status]: page_script fired")

// document.addEventListener('keydown', async function onEvent(e) {
//     // e = e || window.e;
//     // if (e.key == "Escape") {
//     // 	DEBUG("escape pressed");
//     // 	toggleOrCreateSubmissionDialog();
//     // }
//     // if (e.ctrlKey && e.keyCode === 13) {
//     // 	document.querySelector('.submit__2ISl').click(); // action
//     // 	killSubmissionPane();
//     // 	(async function loop() {
//     // 	    for (let i = 0; i < 20; i++) {
//     // 	    	const status = await currentStatus();
//     // 	    	DEBUG("try: " + i + ", " + status);
//     // 		if (status == "Console ") {
//     // 		    displaySubmissionResult(false);
//     // 		    break;
//     // 		}
//     // 	    }
//     // 	})();
//     // }

//     if (e.ctrlKey && e.key == "'") {
// 	console.log("[server command] runtest");
//     }
// });

window.addEventListener("EDITOR_GRAB", function test() {
    console.log("[status]: event listener [EDITOR GRAB] injected");
    window.postMessage({action: 'EDITOR_VALUE', payout: document.querySelector(".CodeMirror").CodeMirror.getValue()});
});


