let activeColor = document.getElementById('active-color');
// let colors = document.getElementsByClassName('color');
let btnDiv = document.getElementById('color-btns');
const palette = ['#ffff22', '#ccff00', '#39ff14', '#a8ff00', '#11ffee', '#32ffcc', '#f89902', '#57c1ff', '#ff4492'];

//comment out to start with no activeColor displayed.
chrome.storage.sync.get('color', function (data) {
  activeColor.style.backgroundColor = data.color;
  activeColor.setAttribute('value', data.color);
});

function constructOptions (palette) {
  for (let color of palette) {
    let button = document.createElement('button');
    button.className = 'color';
    button.style.backgroundColor = color;
    button.value = color;
    button.addEventListener('click', switchColor);
    btnDiv.appendChild(button);
  }
}
constructOptions(palette);

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function (tabs) {
  chrome.tabs.executeScript({
    file: "./highlight.js",
    allFrames: true
  });
});

function switchColor(event) {
  let newColor = event.target.value;
  chrome.storage.sync.set({color: newColor}, function () {
    activeColor.setAttribute('value', newColor);
    activeColor.style.backgroundColor = newColor;
  });
  let style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule(`::selection {background-color: ${activeColor}}`);
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.executeScript({
      file: "./highlight.js",
      allFrames: true
    });
  });
}

