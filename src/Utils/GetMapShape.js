import * as d3GeoProjection from "d3-geo-projection";
import * as d3 from "d3";
import * as topojson from "topojson";

const GetMapShape = (mapData, proj, scale, position, identifier, shapeKey) => {
  let projection = "sphere";
  switch (proj) {
    case "Mercator":
      projection = d3.geoMercator();
      break;
    case "Robinson":
      projection = d3GeoProjection.geoRobinson();
      break;
    case "Gall-Peter":
      projection = d3GeoProjection.geoCylindricalEqualArea.parallel(45);
      break;
    case "Winkel-Tripel":
      projection = d3GeoProjection.geoWinkel3();
      break;
    case "Equirectangular":
      projection = d3.geoEquirectangular();
      break;
    case "Natural Earth1":
      projection = d3.geoNaturalEarth1();
      break;
    case "AlbersUSA":
      projection = d3.geoAlbersUsa();
      break;
    default:
      projection = "sphere";
      break;
  }
  let features = topojson.feature(mapData, mapData.objects[shapeKey]).features;
  if (!proj) {
    let countries = features.map((d, i) => d[identifier]);
    let obj1 = {};
    for (let i = 0; i < countries.length; i++) {
      obj1[countries[i]] = features[i];
    }
    let names1 = Object.keys(obj1);
    let geoData1 = [];
    for (let i = 0; i < names1.length; i++) {
      geoData1.push({
        code: names1[i],
        vertices: obj1[names1[i]],
      });
    }
    return geoData1;
  } else {
    let obj = {};
    let projection_scale = projection
      .scale(scale)
      .translate([position[0], position[1]]);
    let path = d3.geoPath().projection(projection_scale);
    let featureNew = [];
    features.forEach((d, i) => {
      if (!path(d)) console.warn(`Path doesn't exist in ${d}`);
      else featureNew.push(d);
    });
    let countries = featureNew.map((d, i) => d[identifier]);
    // eslint-disable-next-line
    let coords = featureNew.map((d, i) => {
      if (path(d)) {
        let coordInd = path(d).split("M");
        coordInd.shift();
        return coordInd;
      }
    });
    let coords1 = coords.map((d, i) => {
      let coordsTemp = d.map((c, j) => {
        let coordInd = c.split("L");
        return coordInd;
      });
      return coordsTemp;
    });
    let coords2 = coords1.map((d, i) => {
      let coordsTemp = d.map((c, j) => {
        let g = c.map((x, y) => {
          let h = x.split(",");
          if (h[1].indexOf("Z") >= 0) {
            h[1] = h[1].replace("Z", "");
          }
          h[0] = parseFloat(h[0]);
          h[1] = -1 * parseFloat(h[1]);
          return h;
        });
        g.push(g[0]);
        return g;
      });
      return coordsTemp;
    });

    for (let i = 0; i < countries.length; i++) {
      obj[countries[i]] = coords2[i];
    }
    let names = Object.keys(obj);
    let geoData = [];
    for (let i = 0; i < names.length; i++) {
      for (let k = 0; k < obj[names[i]].length; k++) {
        geoData.push({
          code: names[i],
          vertices: `${obj[names[i]][k][0][0]} ${obj[names[i]][k][0][1]}`,
        });
        for (let j = 1; j < obj[names[i]][k].length; j++) {
          geoData[geoData.length - 1].vertices = `${
            geoData[geoData.length - 1].vertices
          }, ${obj[names[i]][k][j][0]} ${obj[names[i]][k][j][1]}`;
        }
      }
    }
    return geoData;
  }
};

export default GetMapShape;
