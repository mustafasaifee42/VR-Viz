import * as d3GeoProjection from "d3-geo-projection";
import * as d3 from "d3";

const GetMapCoordinates = (long, lat, proj, scale, position) => {
  let projection;
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
    default:
      projection = d3GeoProjection.geoRobinson();
      break;
  }
  let projection_scale = projection
    .scale(scale)
    .translate([position[0], position[1]]);

  return projection_scale([long, lat]);
};

export default GetMapCoordinates;
