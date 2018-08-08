$(document).ready(function(){
	var delay;
	var editor = CodeMirror.fromTextArea(document.getElementsByClassName("codemirror-textarea")[0], {
	lineNumbers : true,
	matchBrackets : true,
	mode : "text/x-go",
	onChange: function() {
	         clearTimeout(delay);
	         delay = setTimeout(updateRez, 300);
	       }
	});
	function updateRez() {
		// Android.contOut(editor.getValue());
	}
	function setContent(content) {
		editor.setValue(decodeURIComponent(content));
	} 
	delay = setTimeout(updateRez, 300);
});