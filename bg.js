



var server_address;



searchDirection = -1
chrome.storage.sync.get({
    server_address: "35.164.84.230:8081"
}, function(items) {
    server_address = items.server_address;

});
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
     
        var operation = "normal";
        if(inverted)
            operation = "invert";
        if(request.url){
            var img = new Image()
            img.src = request.url;

            img.onload = function(){
                if(request.ocr){
                    var canvas = document.createElement('canvas');
                    canvas.width = request.ocr.width;
                    canvas.height = request.ocr.height;
                    canvas.getContext('2d').drawImage(img, request.ocr.x, request.ocr.y, request.ocr.width, request.ocr.height, 0, 0, request.ocr.width, request.ocr.height);

                    var payload = {
                        filePath: canvas.toDataURL('image/png'),
                        sourcelang: from_lang,
                        tolang:to_lang,
                        operation:operation,
                        engine:ocrengine
                        
                    }
                    console.log(JSON.stringify(payload));
                    var xhr = new XMLHttpRequest()
                    xhr.open('POST', 'http://'+server_address +'/indiastring', true)
                    xhr.onload = function(){
                        console.log(xhr.responseText)
                        sendResponse(xhr.responseText)
                    }
                    xhr.send(JSON.stringify(payload));
                }
                
            }

            return true;
        }
        



    });