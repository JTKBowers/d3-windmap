var width = 1500;
var nominalHeight = 1160;

var height = getHeight();//svg.node().getBBox()["height"];
if (height < nominalHeight)
  width *= height/nominalHeight;

var canvas =
  d3.select('canvas#wind')
      .attr('width', width)
      .attr('height', height)
      .node().getContext('2d');

function createParticle(){
  return {
    x: Math.random() * width*0.8,
    y: Math.random() * height,
    prev_x: undefined,
    prev_y: undefined,
    lifespan: Math.random() * 200,
    age: 0
  };
}
var particles =
  d3.range(2000).map(function(d, i) {
    return createParticle();
  });

var x =
  d3.scaleLinear()
    .domain([0, width])
    .range([0, width]);

var y =
  d3.scaleLinear()
    .domain([0, height])
    .range([height, 0]);


/* PLOT */

function drawParticles() {
  canvas.fillStyle = "rgba(0, 0, 0, 0.97)";
  var prev = canvas.globalCompositeOperation;
  canvas.globalCompositeOperation = "destination-in";
  canvas.fillRect(0, 0, width, height);
  canvas.globalCompositeOperation = prev;
  // canvas.clearRect(0, 0, width, height);
  canvas.beginPath();
  var i = -1, cx, cy;
  while (++i < particles.length) {

    d = particles[i];
    if (d.prev_x == undefined)
      continue
    canvas.beginPath();
      cx = x( d.prev_x );
      cy = y( d.prev_y );
      canvas.moveTo(cx, cy);
      new_cx = x( d.x );
      new_cy = y( d.y );
      canvas.lineTo(new_cx, new_cy);
    canvas.stroke();
    // canvas.arc(cx, cy, d.r, 0, 2 * Math.PI);
  }
  canvas.fill();
};
function updateParticles(){
  for(var i=0; i < particles.length; i++){
    var particle = particles[i];
    if (particle.age > particle.lifespan)
      particles[i] = createParticle();
    particles[i].age ++;
    particles[i].prev_x = particles[i].x;
    particles[i].prev_y = particles[i].y;

    particles[i].x += .7;
    // particles[i].x += Math.random();
    // particles[i].y += Math.random()-0.5;
  }
}
drawParticles();

d3.timer(function() {
  updateParticles();
  drawParticles();
});
