station_locations = {
  7:  ["Ashburton", new Vector([171.748567, -43.908381])],
  2:  ["Riccarton Road", new Vector([172.591819, -43.530427,])],
  1:  ["St Albans", new Vector([172.627465, -43.505181])],
  3:  ["Woolston", new Vector([172.679046, -43.547375])],
  9:  ["Geraldine", new Vector([171.243735, -44.091185])],
  4:  ["Kaiapoi", new Vector([172.656958, -43.383032])],
  6:  ["Lincoln", new Vector([172.484249, -43.640087])],
  5:  ["Rangiora", new Vector([172.595725, -43.303356])],
  10: ["Timaru Anzac Square", new Vector([171.248786, -44.404181])],
  54: ["Timaru Grey Rd", new Vector([171.245892, -44.396785])],
  11: ["Washdyke", new Vector([171.238404, -44.352443])],
  12: ["Waimate Stadium", new Vector([171.0481, -44.7326])]
}

// Indexed by station id, each item is [wind_speed, wind_heading]
wind_values = {
  1: radialVector(0.784569442272186, 335.652709960938),
  3: radialVector(0.958400011062622, 57.2641792297363),
  4: radialVector(0.589577794075012, 324.511596679688),
  5: radialVector(1.1092221736908, 307.592193603516),
  7: radialVector(1.66927766799927, 320.040985107422),
  9: radialVector(1.06966662406921, 327.871704101563),
  10: radialVector(0.846388936042786, 0.212917700409889),
  11: radialVector(1.20268070697784, 312.515411376953)
}

function createWind(canvasSelector, mapProj){
  var width = 1500;
  var nominalHeight = 1160;

  var height = getHeight();
  if (height < nominalHeight)
    width *= height/nominalHeight;

  function createWindParticle(){
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      prev_x: undefined,
      prev_y: undefined,
      lifespan: Math.random() * 200,
      age: 0
    };
  }

  // IDW
  var locations = [];
  var values = [];

  for (var station_id in wind_values) {
    if (wind_values.hasOwnProperty(station_id)) {
      var projected_location = station_locations[station_id][1].proj(mapProj);
      projected_location.elements[1] = height - projected_location.elements[1]; //flip y coords to convert from svg space to canvas space.
      locations.push(projected_location);
      values.push(wind_values[station_id]);
    }
  }

  function updateParticle(particle){
    var pos = new Vector([particle.x, particle.y])
    vel = IDW(pos, locations, values, euclidian_dist);

    particle.x += vel.elements[0];
    particle.y += vel.elements[1];

    return particle;
  }
  // Particle system
  var particles = new ParticleSystem(canvasSelector, width,height);
  particles.createParticle = createWindParticle;
  particles.updateParticle = updateParticle;
  particles.createParticles(2000);
  // particles.updateParticles();
  particles.start();
}
