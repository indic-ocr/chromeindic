// Saves options to chrome.storage
function save_options() {
  var server_address = document.getElementById('server_address').value;
 
  chrome.storage.sync.set({
    server_address: server_address
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    server_address: "35.164.84.230:8081"
  }, function(items) {
    document.getElementById('server_address').value = items.server_address;
    
  });
}
function set_defaults(){
    document.getElementById('server_address').value = "35.164.84.230:8081";
    
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('default').addEventListener('click',
    set_defaults);