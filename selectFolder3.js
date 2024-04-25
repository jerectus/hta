function selectFolder(path) {
    function removeElement(el) {
        el.parentNode.removeChild(el);
    }
    function createElement(tagName, className, textContent, value) {
        var el = document.createElement(tagName);
        if (className !== void(0)) el.className = className;
        if (textContent !== void(0)) el.textContent = textContent;
        if (value !== void(0)) el.value = value;
        return el;
    }
    function createItem(value, text, stat, cursor) {
        var li = createElement("li");
        var openClose = createElement("a", "open-close", stat, value);
        li.appendChild(openClose);
        li.appendChild(document.createTextNode(" "));
        var folder = createElement("a", "folder" + (cursor ? " cursor" : ""), text || value, value);
        li.appendChild(folder);
        return li;
    }
    function openFolder(item) {
        var el = item.firstChild;
        if (el.textContent != "[-]") {
            var ul = el.parentNode.querySelector("ul");
            var child = null;
            var childPath = null;
            if (ul) {
                child = ul.firstChild;
                if (child) {
                    childPath = child.firstChild.value;
                }
            } else {
                ul = document.createElement("ul");
            }
            if (el.value == "") {
                ios.forEach(io.drives, function (drive) {
                    if (drive.rootFolder == childPath) {
                        ul.appendChild(child);
                    } else {
                        ul.appendChild(createItem(drive.rootFolder, drive.rootFolder, "[+]"));
                    }
                });
            } else {
                var folder = io.getFolder(el.value);
                ios.forEach(folder.subFolders, function (subFolder) {
                    if (subFolder.path == childPath) {
                        ul.appendChild(child);
                    } else {
                        ul.appendChild(createItem(subFolder.path, subFolder.name, "[+]"));
                    }
                });
            }
            el.textContent = "[-]";
            el.parentNode.appendChild(ul);
    }
    }
    function closeFolder(item) {
        var ul = item.querySelector("ul");
        if (ul) {
            ul.innerHTML = "";
        }
        var el = item.firstChild;
        el.textContent = "[+]";
        if (!popup.querySelector(".cursor")) {
            item.querySelector(".folder").classList.add("cursor");
        }
    }
    var popup = document.createElement("div");
    popup.className = "select-folder-popup";
    popup.style.top = (path.offsetTop + path.clientHeight) + "px";
    popup.style.minWidth = (path.clientWidth - 20) + "px";
    popup.style.maxHeight = "400px";
    var child = null;
    for (var folder = io.getFolder(path.value); folder != null; folder = folder.parentFolder) {
        var li = createItem(folder.path, folder.name, "[+]", child == null);
        if (child) {
            li.appendChild(child);
        }
        var ul = document.createElement("ul");
        ul.appendChild(li);
        child = ul;
    }
    var li = createItem("", "PC", "[+]", child == null);
    li.appendChild(child);
    var ul = document.createElement("ul");
    ul.appendChild(li);
    popup.appendChild(ul);
    popup.addEventListener("blur", function (event) {
        removeElement(popup);
    });
    popup.addEventListener("click", function (event) {
        var el = event.target;
        if (el.classList.contains("open-close")) {
            if (el.textContent != "[-]") {
                openFolder(el.parentNode);
            } else {
                closeFolder(el.parentNode);
            }
        } else if (el.classList.contains("folder")) {
            path.value = el.value;
            path.focus();
        }
    });
    popup.addEventListener("keydown", function (event) {
        if (event.keyCode == 38 || event.keyCode == 40) {
            var a = popup.getElementsByClassName("folder");
            for (var i = 0; i < a.length; i++) {
                if (a[i].classList.contains("cursor")) {
                    var j = i + (event.keyCode == 38 ? -1 : 1);
                    if (j >= 0 && j < a.length) {
                        a[i].classList.remove("cursor")
                        a[j].classList.add("cursor");
                        var el = a[j];
                        if (el.offsetTop + el.offsetHeight > popup.scrollTop + popup.clientHeight) {
                            popup.scrollTop += (el.offsetTop + el.offsetHeight) - (popup.scrollTop + popup.clientHeight);
                        } else if (el.offsetTop < popup.scrollTop) {
                            popup.scrollTop += el.offsetTop - popup.scrollTop;
                        }
                    }
                    break;
                }
            }
            event.stopPropagation();
            event.preventDefault();
        } else if (event.keyCode == 37) {
            var cursor = popup.querySelector(".cursor");
            if (cursor) {
                closeFolder(cursor.parentNode);
            }
        } else if (event.keyCode == 39) {
            var cursor = popup.querySelector(".cursor");
            if (cursor) {
                openFolder(cursor.parentNode);
            }
        } else if (event.keyCode == 13) {
            var cursor = popup.querySelector(".cursor");
            if (cursor) {
                path.value = cursor.value;
                path.focus();
            }
        }
    });
    path.parentNode.insertBefore(popup, path);
    popup.focus();
}
