const COLOR_TEXTAREA = "rgba(112, 106, 106, 0.2)";
const COLOR_H5 = "black";
const COLOR_TEXTAREA_FONT = "black";
const COLOR_JQ_DIALOG_PANE = "#1e1e1e";
const FONT_TEXTAREA = "monaco, monospace";
const FONTSIZE_TEXTAREA = "10pt";

const DEBUG_MODE = true;

function DEBUG(s) {
    if (DEBUG_MODE == true) {
	if (typeof(s) == "object") {
	    console.log("[DEBUG] ")
	    console.log(s);
	    return;
	}
	    
	console.log("[DEBUG]: " + s);
    }
}


function make_slug(s) {
    return s.trim().toLowerCase().replace(/ /g, '-');
}

async function acquireQuestionID(slug) {
    var cache = chrome.runtime.getURL("/assets/cache.json");
    // console.log(cache);
    DEBUG("loading question_id from slug")
    return fetch(cache,
	  {method: "GET",
	   credentials: 'same-origin'}
	 ).then(res => {
	     return res.json();
	 }).then(res => {
	     DEBUG(res);
	     return res[slug].question_id;
	 });
}


async function acquireTaskInfo() {
    const info = document.getElementsByClassName("css-v3d350")[0].innerText.split('.');
    const slug = make_slug(info[1]);
    const id = await acquireQuestionID(slug);
    return {
	question_id : id,
	question_title_slug: slug
    };
}


function acquireProgrammingLanguage() {
    return "cpp";
}

function acquireTestInput() {
    return document.getElementById("input_textarea").value;
}

function acquireCsrftoken() {
    try {
	return document.cookie.split(';').map(x => x.trim()).filter(x => x.startsWith("csrf"))[0].split('=')[1];
    }
    catch {
	alert("no csrftoken");
	return "NULLSTRING";
    }
}

function acquireJudgeStatus() {
    try {
	return document.getElementsByClassName("ant-table-tbody")[0].rows[0].getElementsByClassName("status-column__3SUg")[0].textContent.trim();
    }
    catch (e) {
	return "NULL";
    }
}

function acquireStdOut() {
    try {
	return document.getElementsByClassName("css-1ubm0bb-Value e5i1odf2")[1].innerHTML.replace(/<br\s*[\/]?>/gi, "\n");;
    }
    catch (e) {
	return "N/A";
    }
}

function acquireErrorStdOut() {
    try {
	return document.getElementsByClassName("css-1cphi2h-Value e5i1odf2")[0].innerHTML.replace(/<br\s*[\/]?>/gi, "\n");
    }
    catch (e) {
	return "N/A";
    }
}

function acquireInput() {
    try {
	return document.getElementsByClassName("css-1ubm0bb-Value e5i1odf2")[0].innerHTML.replace(/<br\s*[\/]?>/gi, "\n");;
    }
    catch (e) {
	return "";
    }
}

function acquireOutput() {
    try {
	let i = document.getElementsByClassName("css-1ubm0bb-Value e5i1odf2").length == 3 ? 1 : 2;
	return document.getElementsByClassName("css-1ubm0bb-Value e5i1odf2")[i].innerHTML.replace(/<br\s*[\/]?>/gi, "\n");;
    }
    catch (e) {
	return "";
    }
}

function acquireExpected() {
    try {
	let i = document.getElementsByClassName("css-1ubm0bb-Value e5i1odf2").length == 3 ? 2 : 3;
	return document.getElementsByClassName("css-1ubm0bb-Value e5i1odf2")[i].innerHTML.replace(/<br\s*[\/]?>/gi, "\n");;
    }
    catch (e) {
	return "";
    }
}

function acquireErrorMsg() {
    try {
	return document.getElementsByClassName("css-7defjo-Error e5i1odf4")[0].textContent;
    }
    catch (e) {
	return "N/A";
    }
}

function acquireAcceptedDetails() {
    try {
	let detail = document.getElementsByClassName("data__HC-i");
	return "Runtime: " + detail[0].textContent + " (" + detail[1].textContent + ") "
	    + "  Memory: " + detail[2].textContent + " (" + detail[3].textContent + ")"; 
    }
    catch (e) {
	return "";
    }
}

function valueOr(x, y) {
    if (x != undefined) {
	return x;
    }
    else {
	return y;
    }
}


function safeAppend(parent, element) {
    if (element == null) {
	return;
    }
    else {
	parent.appendChild(element);
    }
}

function currentStatus() {
    var promise = new Promise(function(resolve, reject) {
	setTimeout(function() {
	    let a = document.getElementsByClassName('custom-testcase__2ah7')[0];
	    if (a != undefined) {
		resolve(a.textContent);
	    }
	    else {
		resolve("juding");
	    }
	}, 500)
    });
    return promise;
}


function ensureString(s) {
    if (typeof(s) == "string") {
	return s;
    }
    else {
	try {
	    return s.join('\n');
	}
	catch (e) {
	    return null;
	}
    }
}

function stylizeImmutableTextArea(textarea) {
    textarea.style.fontSize = FONTSIZE_TEXTAREA;
    textarea.style.resize = "none";
    textarea.readOnly = true;
    textarea.style.backgroundColor = COLOR_TEXTAREA;
    textarea.style.fontFamily = FONT_TEXTAREA;
    textarea.style.color = COLOR_TEXTAREA_FONT;
}

function injectJSListener() {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('pageScript.js');
    console.log(s.src);
    (document.head || document.documentElement).appendChild(s);
    DEBUG("[status] pagescript injected");
}


DEBUG("[loaded] util.js");
