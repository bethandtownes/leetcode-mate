const SIDE_PANEL_WIDTH = "400px";
const LOCATOR_CONSOLE_BUTTON = "custom-testcase__2ah7";
const LOCATOR_CONSOLE_PANE = "result__1UhQ";
const LOCATOR_TESTCASE_EDITOR = " ace_editor ace-github testcase-editor__3Tbb"

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

function testcaseEditor() { 
    return document.getElementsByClassName(LOCATOR_TESTCASE_EDITOR)[0]   
}


function consoleButton() {
    return document.getElementsByClassName(LOCATOR_CONSOLE_BUTTON)[0];
}



function consolePane() {
    return document.getElementsByClassName(LOCATOR_CONSOLE_PANE)[0];
}

function maskConsolePane() {
    consolePane().style.height = "0px"
}

function unmaskConsolePane() {
    consolePane().style.height = "inherit";
}


function runDefaultTestCase() {
    const consolePaneAlreadyOpened = testcaseEditor() != undefined;
    if (consolePaneAlreadyOpened == false) {
	maskConsolePane();	
	consoleButton().click();
    }
    setTimeout(() => {
	document.getElementById("input_textarea").value = acquireDefaultTestCase()
	setTimeout(() => {runTestCase()}, 100);
	if (consolePaneAlreadyOpened == false) {
	    consoleButton().click();
	    setTimeout(() => {
		unmaskConsolePane();	
	    }, 500);
	}

    }, 100);
    

}



