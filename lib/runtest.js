var opts = {
    lines: 13, // The number of lines to draw
    length: 38, // The length of each line
    width: 17, // The line thickness
    radius: 15, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: "rgba(138, 121, 121, 0.78)", // CSS color or array of color
    fadeColor: 'transparent', // CSS color or array of colors
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: 'spinner', // The CSS class to assign to the spinner
    position: 'absolute', // Element positioning
};


async function getEditorValue(waitTime = 200, attempt = 1) {
    if (attempt > 3) {
	DEBUG("maxout 3 attempts, no value accquired");
	return null;
    }
    async function makeAttempt() {
	let result = null;
	function handleEditorValue(event) {
	    if(event.data.action === 'EDITOR_VALUE') {
		result = event.data.payout;
	    }
	}
	window.addEventListener("message", handleEditorValue, false);

	let event = new CustomEvent('EDITOR_GRAB');
	window.dispatchEvent(event);
	var promise = new Promise((resolve, fail) => {
	    setTimeout(() => {
		DEBUG("received value and remove listener");
		window.removeEventListener("message", handleEditorValue, false);
		DEBUG("eventListener[message, handleEditorvalue] removed");
		resolve(result);
	    }, waitTime)
	});
	return promise;
    }
    const a = await makeAttempt();
    if (a == null) {
	DEBUG("NULL received");
	return getEditorValue(waitTime + 200, attempt + 1);
    }
    else {
	return a;
    }
}

async function currentRunStatus(id) {
   requestURL = "https://leetcode.com/submissions/detail/" + id + "/check";
   var curst = fetch(requestURL, {
       method: "GET",
       credentials: 'same-origin'
   }).then(res => { return res.json()}).then(res => { return res;}); 
   return curst;
}


async function getSubmissionDetail(id) {
    DEBUG("get submission detail:" + id);
    requestURL = "https://leetcode.com/submissions/detail/" + id + "/check";
    for (let i = 0; i < 20; ++i) {
	const curst = await currentRunStatus(id);
	DEBUG(curst);
	if (curst['state'] == "SUCCESS") {
            return curst; 
            break;
	}
    }
    return null;
}

async function runTestCase() {
    DEBUG("Run test case");
    if (document.getElementById("case_table").style.display == "none") {
	try {
	    $("#spane").dialog("destroy");
	    DEBUG("spane destroyed");
	}
	catch (e) {
	    DEBUG("spane doesn't exist");
	}
	displaySubmissionResult(true);
	return;
    }
    if (acquireTestInput().length == 0) {
	DEBUG("[corner case]: no test input, don't send result")
	return;
    }
    DEBUG("acqure INFO");
    const INFO = await acquireTaskInfo();
    DEBUG("INFO:");
    DEBUG(INFO);
    var target = document.getElementById('status_heading');
    var spinner = new Spin.Spinner(opts).spin(target);
    const data = {
	data_input: acquireTestInput(),
	judge_type: "large",
	lang: acquireProgrammingLanguage(),
	question_id: INFO.question_id,
	typed_code: await getEditorValue(), 
    };
    DEBUG("test data");
    DEBUG(data);
    const testURL = "/problems/" + INFO.slug + "/interpret_solution/";
    makeTestRequest(data, testURL).then(res => {
	return res.json();
    }).then( res => {
	return getSubmissionDetail(res['interpret_id']);
    }).then( res => {
	console.log(res);
	updateSubmissionPaneAfterTest(res);

    });
}

async function makeTestRequest(task, testURL) {
    const requestHeader = {
        'authority': 'leetcode.com',
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br', 
        'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
        'content-type': 'application/json',
        'origin': 'https://leetcode.com',
        'referer': 'https://leetcode.com/problems/add-two-numbers/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
	'x-csrftoken': acquireCsrftoken()
    };

    return fetch(testURL, { 
        method: "POST",
        headers: requestHeader,
        credentials: 'same-origin',
        body: JSON.stringify(task)
    });

};

async function testMakeRequest() {
    makeTestRequest().then(res => {
	return res.json();
    }).then( res => {
	return getSubmissionDetail(res['interpret_id']);
    }).then( res => {
	console.log(res);
    });
};

DEBUG("[loaded] runtest.js");
