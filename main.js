let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 60;
canvas.height = window.innerHeight * 0.6;
let context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);
let restore_array = [];
let start_index = -1;
let stroke_color = "black";
let stroke_width = "2";
let is_drawing = false;
let whatbutton = 0; // 0 - normalny pisak, 1 - linia
var prevStartX = 0;
var prevStartY = 0;
var prevWidth = 0;
var prevHeight = 0;

function change_color(element) {
  stroke_color = element.style.background;
}

function change_width(element) {
  stroke_width = element.innerHTML;
}

function start(event) {
  console.log(getX(event), getY(event));
  zapis = context.getImageData(0, 0, canvas.width, canvas.height);
  is_drawing = true;
  startX = parseInt(getX(event));
  startY = parseInt(getY(event));
  switch (whatbutton) {
    case 0:
      context.beginPath();
      context.moveTo(getX(event), getY(event));
      break;
  }
  event.preventDefault();
}

function draw(event) {
  if (is_drawing) {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = stroke_color;
    context.lineWidth = stroke_width;
    switch (whatbutton) {
      case 0:
        context.lineTo(getX(event), getY(event));
        context.stroke();
        break;
      case 1:
        mouseX = parseInt(getX(event));
        mouseY = parseInt(getY(event));
        context.lineCap = "butt";
        context.lineJoin = "miter";
        var height = mouseY - startY;
        var width = mouseX - startX;
        console.log(height, width);
        if (document.getElementById("iffor").checked) {
          if (height * width < 0) {
            height = -width;
          } else {
            height = width;
          }
        }
        context.putImageData(zapis, 0, 0);
        context.strokeRect(startX, startY, width, height);
        if (document.getElementById("iffilled").checked) {
          context.fillRect(startX, startY, width, height);
          context.fillStyle = stroke_color;
        }
        prevStartX = startX;
        prevStartY = startY;
        prevWidth = width;
        prevHeight = height;
        break;
      case 2:
        context.putImageData(zapis, 0, 0);
        let x = getX(event);
        let y = getY(event);
        let radius = getDistance(startX, startY, x, y);
        context.beginPath();
        if (document.getElementById("iffor").checked) {
          context.arc(startX, startY, radius, 0, 2 * Math.PI);
        } else {
          context.moveTo(startX, startY + (y - startY) / 2);
          context.bezierCurveTo(
            startX,
            startY,
            x,
            startY,
            x,
            startY + (y - startY) / 2
          );
          context.bezierCurveTo(
            x,
            y,
            startX,
            y,
            startX,
            startY + (y - startY) / 2
          );
        }
        if (document.getElementById("iffilled").checked) {
          context.fill();
          context.fillStyle = stroke_color;
        }
        context.stroke();
        break;
      case 3:
        context.putImageData(zapis, 0, 0);
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(getX(event), getY(event));
        context.stroke();
        break;
      case 4:
        context.putImageData(zapis, 0, 0);
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(getX(event), startY);
        context.stroke();
        break;
      case 5:
        context.putImageData(zapis, 0, 0);
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX, getY(event));
        context.stroke();
        break;
    }
  }
  event.preventDefault();
}

function stop(event) {
  if (is_drawing) {
    switch (whatbutton) {
      case 0:
        context.stroke();
        context.closePath();
        break;
      case 1:
        context.strokeRect(prevStartX, prevStartY, prevWidth, prevHeight);
        break;
      case 2:
        context.stroke();
        break;
    }
    is_drawing = false;
  }
  event.preventDefault();
  if (event.type != "mouseout") {
    restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
    start_index += 1;
  }
}

function getX(event) {
  if (event.pageX == undefined) {
    return event.targetTouches[0].pageX - canvas.offsetLeft;
  } else {
    return event.pageX - canvas.offsetLeft;
  }
}

function getY(event) {
  if (event.pageY == undefined) {
    return event.targetTouches[0].pageY - canvas.offsetTop;
  } else {
    return event.pageY - canvas.offsetTop;
  }
}

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function Restore() {
  if (start_index <= 0) {
    Clear();
  } else {
    start_index += -1;
    restore_array.pop();
    context.putImageData(restore_array[start_index], 0, 0);
    console.log(restore_array);
  }
}

function Clear() {
  context.fillStyle = "white";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  restore_array = [];
  start_index = -1;
}

function Save() {
  const link = document.createElement("a");
  link.download = "download.png";
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

function getDistance(p1X, p1Y, p2X, p2Y) {
  return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2));
}
