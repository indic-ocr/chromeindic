// ctx = document.getElementById("blah").getContext('2d')


// shamelessly lifted off quirksmode
function findPos(obj) {
    var curleft = curtop = 0;

    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);

        return [curleft, curtop];
    }
}

// stolen from stackoverflow
var bubbleDiv;
function IsImageOk(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}



var x = 0;
var y = 0;
var startPageX = 0;
var startPageY = 0;
mouse_down = false;
window.onmousedown = function(e){
    var elpos = findPos(e.target);

    mouse_down = true;
    if(elpos)
    {
        startPageX = e.pageX;
        startPageY = e.pageY;
        var X = e.pageX - elpos[0],
            Y = e.pageY - elpos[1];
        if(e.target.tagName.toLowerCase() == "img" && e.button == 0){
            e.target.ondragstart = function() { return false; };
            if(IsImageOk(e.target)){

                x = X;
                y = Y;

            }
        }

    }



}
window.onmousemove = function(e)
{
    if(e.target.tagName.toLowerCase() == "img"){
        e.target.style.cursor = 'crosshair';
    }
}



window.onmouseup = function(e){

    mouse_down = false;
    var elpos = findPos(e.target);


    if(elpos)
    {
        var X = e.pageX - elpos[0],
            Y = e.pageY - elpos[1];

        if(e.target.tagName.toLowerCase() == "img" && e.button == 0){
            if(IsImageOk(e.target)){

                e.target.style.cursor = 'progress';

                chrome.runtime.sendMessage({
                    url: e.target.src,
                    ocr: {
                        width: X-x,
                        height: Y-y,
                        x: x,
                        y: y
                    }
                }, function(response) {
                    e.target.style.cursor = 'auto';
                    try {
                        var jsonResponse = JSON.parse(response);

                        // Handle non-exception-throwing cases:
                        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
                        // but... JSON.parse(null) returns null, and typeof null === "object", 
                        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
                        if (jsonResponse && typeof jsonResponse === "object") {

                            bubbleDiv.style.display="block"
                            bubbleDiv.style.position = "absolute";
                            bubbleDiv.style.top = e.pageY+'px';
                            bubbleDiv.style.left = e.pageX+'px';
                            bubbleDiv.innerHTML = '<p class="triangle-isosceles left">Recognized text: ' + jsonResponse.recognizedText + '<br><br>English Tranliteration: ' + jsonResponse.englishTransliteration + '<br><br>Target transliteration: ' + jsonResponse.tranliteratedTo +'</p>';
                        }
                    }
                    catch (e) { }
                    console.log("GOT STUFF", response)
                });

            }
        }

    }





}

window.onload = function(){

    bubbleDiv = document.createElement("div");

    bubbleDiv.setAttribute("id","img_container");

    document.body.appendChild(bubbleDiv);

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key == "Escape" || evt.key == "Esc");
        } else {
            isEscape = (evt.keyCode == 27);
        }
        if (isEscape) {
            bubbleDiv.style.display="none";
        }
    };


}

window.ondblclick = function(e){

}

