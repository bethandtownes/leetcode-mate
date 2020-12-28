function showCaseTable() {
    document.getElementById("case_table").style.display = "block";
}

function killSubmissionPane() {
    try {
	$("#spane").dialog("destroy");
	DEBUG("spane destroyed");
    }
    catch (e) {

	DEBUG("spane doesn't exist");
    }
}

function updateStdOutPane(s) {
    if (s == undefined || s == null || s.length == 0) {
	document.getElementById("stdout").style.display = "none";
	document.getElementById("stdout_textbox").value = "";
    }
    else {
	document.getElementById("stdout").style.display = "block";
	document.getElementById("stdout_textbox").value = s;
    }
}

function updateErrorMessagePane(s) {
    if (s == undefined || s == null || s.length == 0) {
	document.getElementById("error_msg").style.display = "none";
	document.getElementById("error_textbox").value = "";
    }
    else {
	document.getElementById("error_msg").style.display = "block";
	document.getElementById("error_textbox").value = s;
    }
}



function updateSubmissionPaneTitle(s) {
    document.getElementsByClassName("ui-dialog-title")[0].innerHTML = s;
}

function updateSubmissionPaneJudgeStatus(testRunData) {
    const output = testRunData.code_answer;
    const expected = testRunData.expected_code_answer;
    if (expected != undefined && output.join('\n') == expected.join('\n')) {
	document.getElementById("status_heading").innerHTML = "Test OK";
	document.getElementById("status_heading").style.color = "green";
    }
    else {
	document.getElementById("status_heading").innerHTML = "Didn't pass";
	if (testRunData.status_msg == "Accepted") {
	    document.getElementById("status_heading").innerHTML += " (Compiled OK)";
	}
	else {
	    document.getElementById("status_heading").innerHTML += " (" + testRunData.status_msg + ")";
	}
	document.getElementById("status_heading").style.color = "red";
    }
}

function updateSubmissionPaneOutputAndExpected(output, expected) {
    document.getElementById("output_textarea").value = valueOr(output, "");
    document.getElementById("expected_textarea").value = valueOr(expected, "");
}


function resizeSubmissionPane() {
    if (document.getElementById("error_msg").style.display == "none" && document.getElementById("stdout").style.display == "none") {
	$(document).ready(function(){
	    var d = $("#spane").dialog();
	    d.dialog("option", "height", 300);
	});
    }
    else {
	$(document).ready(function(){
	    var d = $("#spane").dialog();
	    d.dialog("option", "height", 800);
	});
    }
}

function updateSubmissionPaneAfterTest(testRunData) {
    updateSubmissionPaneTitle("Test Run Result")
    updateSubmissionPaneOutputAndExpected(testRunData.code_answer, testRunData.expected_code_answer);
    updateSubmissionPaneJudgeStatus(testRunData);
    status_msg = testRunData.status_msg;
    if (status_msg == "Compile Error") {
	updateStdOutPane(null);
	updateErrorMessagePane(testRunData.full_compile_error);
    }
    else if (status_msg == "Runtime Error") {
	updateErrorMessagePane(testRunData.full_runtime_error);
	updateStdOutPane(ensureString(testRunData.code_output));
    }
    else {
	updateErrorMessagePane(null);
	updateStdOutPane(ensureString(testRunData.code_output));
    }
    resizeSubmissionPane();
}

function showSubmissionPane() {
    let d = $("#spane");
    if (d == null) {
	displaySubmissionResult(true);
    }
    else if (d.dialog("isOpen")) {
	return;
    }
    else {
	d.dialog("open");
    }
}

function toggleSubmissionPane(d) {
    if (d.dialog("isOpen") == true) {
	d.dialog("close");
	DEBUG("close spane");
    }
    else {
	d.dialog("open");
	DEBUG("open dialog");
    }
}


async function drawSubmissionPane() {
    (async function loop() {
	for (let i = 0; i < 30; i++) {
	    const status = await currentStatus();
	    DEBUG("try: " + i + ", " + status);
	    if (status == "Console ") {
		displaySubmissionResult(false);
		break;
	    }
	}
    })();
    return;
}
    

function toggleOrCreateSubmissionDialog() {
    if (document.getElementById("spane") == undefined) {
	DEBUG("no spaned found, create an empty one");
	displaySubmissionResult(true);
    }
    else {
	let submissionResultPane = $("#spane");
	toggleSubmissionPane(submissionResultPane);
    }
}


DEBUG("[loaded] submission_pane_updater.js");


