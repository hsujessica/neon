let activeColor = document.getElementById('activeColor');
let colors = document.getElementsByClassName('color');

chrome.storage.sync.get('color', function (data) {
  activeColor.style.backgroundColor = data.color;
  activeColor.setAttribute('value', data.color);
});

let btnDiv = document.getElementById('color-btns');

const palette = ['#ffff22', '#ccff00', '#39ff14', '#a8ff00', '#11ffee', '#32ffcc', '#f89902', '#57c1ff', '#ff4492'];

function constructOptions(palette) {
  for (let color of palette) {
    let button = document.createElement('button');
    button.className = 'color';
    button.style.backgroundColor = color;
    button.value = color;
    button.addEventListener('click', function (event) {
      let newColor = event.target.value;
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code:
              `let style = document.createElement('style');
              document.head.appendChild(style);
              style.sheet.insertRule("::selection {background-color: ${color}}")
              function getHighlightedText () {
                let text = '';
                if (window.getSelection()) {
                  text = window.getSelection().toString();
                }
                console.log(text)
                return text;
              }
              document.addEventListener('selectionchange', function () {
                  let text = getHighlightedText();
                  console.log(text);
              });
              `
            }
        );
      });
      chrome.storage.sync.set({color: color}, function () {
        activeColor.setAttribute('value', color);
        activeColor.style.backgroundColor = color;
      });
    });
    btnDiv.appendChild(button);
  }
}

constructOptions(palette);

// function switchColor () {

// }
