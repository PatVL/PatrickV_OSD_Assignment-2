// Wait till the browser is ready to render the game (avoids glitches
function getSize() {
    var reg = new RegExp("(^|&)size=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) {
        return parseInt(unescape(decodeURI(r[2])));
    }
    return 4;
}

function getMode() {
    var reg = new RegExp("(^|&)mode=([^&]*)(&|$)", "i");
    var r = location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(decodeURI(r[2]));
    }
    return "normal";
}
var game;
window.requestAnimationFrame(function() {
    var size = getSize();
    var container = document.getElementById('grid-container');
    var html = '';
    for (var i = 0; i < size; ++i) {
        html += '<div class="grid-row">';
        for (var j = 0; j < size; ++j) {
            html += '<div class="grid-cell"></div>';
        }
        html += '</div>';
    }
    container.innerHTML = html;
    game = new GameManager(size, KeyboardInputManager, HTMLActuator, LocalStorageManager);
    var mode = getMode();
    switch (mode) {
        case "onlyTwo":
            onlyTwo();
            break;
        case "onlyFour":
            onlyFour();
            break;
        default:
            normal();
            break;
    }


});

function random() {
    game.move(Math.floor(Math.random() * 4));
}

function ModeChange(mode) {
    window.location.href = 'index.html?size=' + getSize() + '&mode=' + mode;
}

function SizeChange(size) {
    var size;
    window.location.href = 'index.html?size=' + size + '&mode=' + getMode();
    if (size == 1) {
        var m = document.getElementById("grid-cell");
        m.style.width = "400px";
        m.style.height = "400px";
    }
    if (size == 3) {
        var m = document.getElementById("grid-cell");
        m.style.width = "180px";
        m.style.height = "180px";
    }
}

function RuleChange(add, merge, win) {
    game.addRandomTile = function() {
        if (this.grid.cellsAvailable()) {
            var tile = new Tile(this.grid.randomAvailableCell(), add());
            this.grid.insertTile(tile);
        }
    };
    game.restart();
}

function Add() {
    return Math.random() < 0.9 ? 2 : 4;
}

function Merge(a, b) {
    return a === b;
}

function Win(merged) {
    return merged === 2048;
}

function normal() {
    RuleChange(Add,
        function(a, b) { return a === b; },
        function(merged) { return merged === 2048; });
}

function onlyTwo() {
    RuleChange(function() { return 2; }, Merge, Win);
}

function onlyFour() {
    RuleChange(function() { return 4; }, Merge, Win);
}