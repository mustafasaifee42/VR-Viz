import * as fs from "fs";
function loadFile(file) {
  let data;
  if (typeof window === "undefined") {
    data = fs.readFileSync(file) + "";
  } else {
    data = loadFileAJAX(file);
  }
  return data;
}

function loadFileAJAX(name) {
  let xhr = new XMLHttpRequest(),
    okStatus = document.location.protocol === "file:" ? 0 : 200;
  let d = new Date();
  //We add the current date to avoid caching of request
  //Murder for development
  xhr.open("GET", name + "?" + d.toJSON(), false);
  xhr.send(null);
  return xhr.status === okStatus ? xhr.responseText : null;
}

const ReadPLY = (fileName) => {
  let fileText = loadFile(fileName);

  const lines = fileText.split("\n");
  let startIndex = lines.indexOf("end_header");
  let vertexNo;
  let dataInfoStart, dataInfoEnd;
  let rIndex = 0,
    gIndex = 0,
    bIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("element vertex") !== -1) {
      const arr = lines[i].split(" ");
      vertexNo = parseInt(arr[arr.length - 1], 10);
      dataInfoStart = i;
      break;
    }
  }
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("element face") !== -1) {
      dataInfoEnd = i;
      break;
    }
  }
  for (let i = dataInfoStart; i < dataInfoEnd; i++) {
    if (lines[i].indexOf("red") !== -1) {
      rIndex = i - dataInfoStart;
    }
    if (lines[i].indexOf("green") !== -1) {
      gIndex = i - dataInfoStart;
    }
    if (lines[i].indexOf("blue") !== -1) {
      bIndex = i - dataInfoStart;
    }
  }
  let coordinates = [];
  for (let i = startIndex + 1; i < startIndex + vertexNo + 1; i++) {
    let coordinatesTemp = lines[i].split(" ");
    if (lines[rIndex + dataInfoStart].indexOf("red") !== -1)
      coordinates.push({
        x: parseInt(coordinatesTemp[0], 10),
        y: parseInt(coordinatesTemp[1], 10),
        z: parseInt(coordinatesTemp[2], 10),
        r: parseInt(coordinatesTemp[rIndex], 10),
        g: parseInt(coordinatesTemp[gIndex], 10),
        b: parseInt(coordinatesTemp[bIndex], 10),
      });
    else
      coordinates.push({
        x: parseInt(coordinatesTemp[0], 10),
        y: parseInt(coordinatesTemp[1], 10),
        z: parseInt(coordinatesTemp[2], 10),
      });
  }
  return coordinates;
};

export default ReadPLY;
