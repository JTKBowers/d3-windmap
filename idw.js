function calc_distances(point, locations, dist_fn){
  return locations.map(function(location) {return dist_fn(location,point)})
}


function IDW(point, locations, values, dist_fn){
  if (locations.length != values.length)
    throw new Error("Location and value arrays do not match!")

  var distances = calc_distances(point, locations, dist_fn)

  // If the point is closer than threshold_dist, treat it as if the point is identical.
  var threshold_dist = 1e-3;
  for (var i=0; i < distances.length; i++){
    if (distances[i] < threshold_dist)
      return values[i];
  }

  // Calculate the weights for each point.
  var pow = 1.0;
  var weights = distances.map(function(d) {return 1.0/Math.pow(d, pow);})
  var sum_weights = weights.reduce(function(a, b) { return a + b; }, 0);

  var u = new Vector(zeroedArray(2));

  for (var i=0; i < weights.length; i++){
    var u_i = values[i];
    var w_i = weights[i];
    u = u.add(u_i.mul_scalar(w_i/sum_weights));
  }
  return u;
}
