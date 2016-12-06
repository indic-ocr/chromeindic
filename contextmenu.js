// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The onClicked callback function.

var languages= {
    "bengali":"ben",
    "english":"eng",
    "gujarati":"guj",
    "hindi":"hin",
    "kannada":"kan",
    "malayalam":"mal",
    "oriya":"ori",
    "punjabi":"pan",
    "tamil":"tam",
    "telugu":"tel"

}

var ocrengine = "scribo";

var inverted = false;
var from_lang = "ben";
var to_lang = "ben";

function onClickHandler(info, tab) {

    if(info.menuItemId == "scribo" && info.checked )
        ocrengine = "scribo";

    if(info.menuItemId == "tesseract" && info.checked )
        ocrengine = "tesseract";

    if(info.menuItemId == "light_on_dark" && info.checked )
        inverted = true;
    else if(info.menuItemId == "light_on_dark" && !info.checked )
        inverted= false;
    else if(info.menuItemId.startsWith("s_") && info.checked )
    {
        from_lang = info.menuItemId.substring(2);
    }
    else if(info.menuItemId.startsWith("t_") && info.checked )
    {
        to_lang = info.menuItemId.substring(2);
    }
    else{
        console.log(" other command");
    }
    //   console.log(inverted + " " + from_lang + " " + to_lang);
    //    console.log("item " + info.menuItemId + " was clicked");
    //  console.log("info: " + JSON.stringify(info));
    //    console.log("tab: " + JSON.stringify(tab));

};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {

    var langs =Object.getOwnPropertyNames(languages).sort(); 
    // Create a parent item and two children.
    chrome.contextMenus.create({"title": "Light characters on dark background", "id": "light_on_dark" , "type": "checkbox","contexts":["image","page"]});
    chrome.contextMenus.create({"title": "Source language", "id": "source_lang" , "contexts":["image","page"]});
    chrome.contextMenus.create({"title": "Target language", "id": "target_lang" , "contexts":["image","page"]});
    chrome.contextMenus.create({"title": "Engine", "id": "ocrengine" , "contexts":["image","page"]});

    var i = 0;
    for(i = 0 ; i < langs.length; i++){
        chrome.contextMenus.create({"title": langs[i].toUpperCase(), "type": "radio",
                                    "id": "s_"+languages[langs[i]], "parentId" : "source_lang", "contexts":["image","page"]});
    }
    for(i = 0 ; i < langs.length; i++){
        chrome.contextMenus.create({"title": langs[i].toUpperCase(), "type": "radio",
                                    "id": "t_"+languages[langs[i]], "parentId" : "target_lang", "contexts":["image","page"]});
    }

    chrome.contextMenus.create({"title": "Scribo", "type": "radio",
                                "id": "scribo", "parentId" : "ocrengine", "contexts":["image","page"]});
    chrome.contextMenus.create({"title": "Tesseract", "type": "radio",
                                "id": "tesseract", "parentId" : "ocrengine", "contexts":["image","page"]});

});