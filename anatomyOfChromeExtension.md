# Manifest

What is a manifest?
A JSON-formatted file that contains metadata of your extension, including, name, version, icons, required permissions.

``` js
  {
    "name": "Example",
    "version": "1.0",
    "description": "My Example Extension",
    "manifest_version": 2
  }

```


# Background Page

Contains the underlying logic for your extension.

# Options Page

Allows user to configure different options for using your extension. These options will be saved in localStorage or chrome.storage sync.

# Override Page

If you are overriding a new tab, bookmarks page, history.

# Popup Page

What opens when you click on the icon.

# Content Script

Script that works with the content loaded in browser. JS and CSS can be added as a script or file, and executes in the context of the page.
Can't call functions that were defined in extension's background page. Need to use message API to communicate. Content script and background are running separate from each other.

```js
"content_scripts": [{
    "css": ["highlight.css"],
    "js": ["highlight.js"],
    "matches": ["https://*"] // when we are on a matching page, load this css and js
  }]
```

# Pages that you can create and show chrome.tabs.create() or window.open()


Chrome APIs
alarms - call something after a certain amount of time
omnibox - register a specific keyword and get keyboard events that follow
idle
storage
bookmarks
tabs/windows
text to speech
webrequest
