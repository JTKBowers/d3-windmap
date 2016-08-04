function createMap(selector){
  var width = 1500;
  var nominalHeight = 1160;

  var height = getHeight();//svg.node().getBBox()["height"];
  if (height < nominalHeight)
    width *= height/nominalHeight;

  var svg = d3.select(selector)
      .attr("width", width);

  // d3.json("data/chch-coastline.geojson", function(error, coastline) {

  // Return a promise to provide a map projection appropriate for the map -> screen transform.
  return getJSON("data/chch-coastline.geojson").then(function(coastline) {
    // console.log(coastline);

    var center = d3.geoCentroid(coastline)
    var scale  = 150;
    var offset = [width/2, height/2];
    var projection = d3.geoMercator().scale(scale).center(center)
        .translate(offset);

    // create the path
    var path = d3.geoPath().projection(projection);

    // using the path determine the bounds of the current map and use
    // these to determine better values for the scale and translation
    var bounds  = path.bounds(coastline);
    console.log(bounds);
    var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                      height - (bounds[0][1] + bounds[1][1])/2];

    // new projection
    projection = d3.geoMercator().center(center)
      .scale(scale).translate(offset);
    path = path.projection(projection);


    svg.selectAll("path").data(coastline.features)
      .enter().append("path")
      .attr("d", path)
      .style("stroke-width", "1")
      .style("stroke", "black")
      .style('fill', 'none');

    return projection;
  });
}
