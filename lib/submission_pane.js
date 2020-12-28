function displaySubmissionResult(emptyInit = false) {
    const currentJudgeStatus = acquireJudgeStatus(); 
    let componentJudgeStatus = (() => {
	self = document.createElement("div");
	self.id = "judge_status";
	const status = currentJudgeStatus;
	self.appendChild(
	    (() => {
		let x = document.createElement("h5");
		x.id = "status_heading";
		if (emptyInit == true) {
		    x.innerText = "Run or Submit";
		    x.style.color = "Gray";
		    return x;
		}
		x.innerText = status;
		if (status == "Accepted") {
		    x.style.color = "green";
		}
		else {
		    x.style.color = "red";
		}
		return x;
	    })()
	);

	if (emptyInit == false && status == "Accepted") {
	    self.appendChild(
		(() => {
		    let x = document.createElement("h5");
		    x.id = "status_details_heading";
		    x.innerText = acquireAcceptedDetails();
		    
		    return x;
		})()
	    );
	}
	self.style.padding = "10px";
	return self;
    })();

    let componentErrorMsg = (() => {
	self = document.createElement("div");
	self.id = "error_msg";

	self.appendChild(
	    (() => {
	    	let x = document.createElement("h5");
		x.id = "error_heading";
	    	x.innerText = "Error Message";
	    	return x;
	    })()
	);
	
	self.appendChild(
	    (() => {
	    	var textarea = document.createElement("textarea");
	    	textarea.id = "error_textbox";
	    	textarea.innerHTML = acquireErrorMsg();
		textarea.style.width = "100%";
		stylizeImmutableTextArea(textarea);
		textarea.style.color = "red";
	    	return textarea;
	    })()
	);
	self.style.padding = "10px";
	if (emptyInit == true) {
	    DEBUG("empty init. hide error pane");
	    self.style.display = "none";
	    return self;
	}
	if (currentJudgeStatus != "Compile Error" && currentJudgeStatus != "Runtime Error") {
	    self.style.display = "none";
	    DEBUG(currentJudgeStatus);
	    // return null;		    
	}
	return self;
    })();


    let componentInput = (() => {
	let x = document.createElement("div");
	const headers = ["Input", "Output", "Expected"]
	const headersGetter = [acquireInput, acquireOutput, acquireExpected];
	headers.forEach((s, i) => {
	    x.appendChild(
		(() => {
		    let tblock = document.createElement("div");
		    tblock.setAttribute("class", "fieldBlock");
		    let tblockTitle = document.createElement("h5");
		    tblockTitle.innerHTML = s;
		    tblockTitle.style.color = COLOR_H5;
		    tblock.appendChild(tblockTitle);
		    tblock.appendChild(
			(() => {
			    let textarea = document.createElement("textarea");
			    textarea.innerHTML = headersGetter[i]();
			    textarea.style.width = "100%";
			    textarea.style.height = "80px";
			    stylizeImmutableTextArea(textarea);
			    if (s == "Input") textarea.id = "input_textarea";
			    if (s == "Output") textarea.id = "output_textarea";
			    if (s == "Expected") textarea.id = "expected_textarea";
			    if (s == "Input") textarea.readOnly = false;
			    return textarea;
			})()
		    );

		    return tblock;
		})()
	    );
	});
	if (emptyInit == false && currentJudgeStatus == "Accepted") {
	    x.style.display = "none";
	}
	x.id = "case_table";
	x.style.width = "100%";
	return x;
    })();


    let componentStdOut = (() => {
	self = document.createElement("div");
	self.id = "stdout";

	self.appendChild(
	    (() => {
		let x = document.createElement("h5");
		x.innerText = "Debug Print";
		x.id = "debug_heading";
		x.style.color = COLOR_H5;
		return x;
	    })()
	);
	
	self.appendChild(
	    (() => {
		var textarea = document.createElement("textarea");
		textarea.id = "stdout_textbox";
		if (currentJudgeStatus == "Runtime Error" || currentJudgeStatus == "Time Limit Exceeded") {
		    textarea.innerHTML = acquireErrorStdOut();
		}
		else {
		    textarea.innerHTML = acquireStdOut();
		}
		stylizeImmutableTextArea(textarea);
		return textarea;
	    })()
	);

	self.style.padding = "10px";
	
	if (emptyInit == true) {
	    self.style.display = "none";
	    DEBUG("empty init. hide msg pane");
	    return self;
	}
    
	if (currentJudgeStatus == "Accepted") {
	    self.style.display = "none";
	}
	if (currentJudgeStatus == "Compile Error") {
	    self.style.display = "none";
	}

	return self;
    })();


    DEBUG("emtpy: " + emptyInit);
    
    jQuery(function() {
	var NewDialog = $((() => {
	    self = document.createElement("div");
	    self.id = "spane";
	    safeAppend(self, componentJudgeStatus);
	    safeAppend(self, componentInput);
	    safeAppend(self, componentErrorMsg);
	    safeAppend(self, componentStdOut);
	    return self;
	})());

	NewDialog.dialog({
	    modal: false,
	    id: "JQspane",
	    dialogClass : "foo",
	    height: (() => {
		if (emptyInit == true) {
		    return 300;
		}
		if (currentJudgeStatus == "Accepted") {
		    return 200;
		}
		else {
		    return 600;
		}
	    })(),
	    width: (() => {
		if (currentJudgeStatus == "Accepted") {
		    return 800;
		}
		else {
		    return 600;
		}
	    })(),
	    closeOnEscape: false,
	    title: "Submission Result",
	    open: function() {
		$("#judge_status").css({"width": "100%"});
		$("#error_textbox").css({"height": "400px"});
		$("#stdout_textbox").css({"height": "400px", "width": "99%"});		
	    },
	    show: false,
	    hide: false,
	    close: function () {

	    },
	    buttons: [
		{text: "Run", click: function() {runTestCase()}},
		{text: "Submit", click: async function() {
		    document.querySelector('.submit__2ISl').click(); // action
		    killSubmissionPane();
		    drawSubmissionPane();
		}},
		{text: "Cancel", click: function() {$(this).dialog("close")}}
	    ]
	});

	NewDialog.dialog("open");
    });
}

DEBUG("[loaded] submission_pane.js");
