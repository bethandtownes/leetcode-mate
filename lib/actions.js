const SIDE_PANEL_WIDTH = "400px";

function toggleSidePanel() {
    if (document.getElementsByClassName("side-tools-wrapper__1TS9") == undefined) {
	return;
    }
    let curFlexValue = document.getElementsByClassName("side-tools-wrapper__1TS9")[0].style.flex.split(' ');
    if (curFlexValue[2] == "0px") {
	curFlexValue[2] = SIDE_PANEL_WIDTH;
    }
    else {
	curFlexValue[2] = "0px";
    }
    document.getElementsByClassName("side-tools-wrapper__1TS9")[0].style.flex = curFlexValue.join(' ');
    return;
}


function toggleProblemPanel() {
    if (document.getElementsByClassName("question-picker-mask__396x hide__3nyv")[0] == undefined) {
	document.getElementsByClassName("question-picker-mask__396x show__3zYv")[0].click();
    }
    else {
	document.getElementsByClassName("picker-menu-handler__34CD css-6iyx43")[0].click();
    }
}
