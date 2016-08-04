class ParticleSystem {
  constructor(selector, width, height) {
    this.width=width;
    this.height=height;
    this.canvas =
      d3.select(selector)
          .attr('width', width)
          .attr('height', height)
          .node().getContext('2d');
    this.particles = [];

    this.x_transform =
      d3.scaleLinear()
        .domain([0, width])
        .range([0, width]);

    this.y_transform =
      d3.scaleLinear()
        .domain([0, height])
        .range([height, 0]);
  }

  createParticles(num){
    for(var i = 0; i < num; i++)
      this.particles.push(this.createParticle())
  }

  drawParticles() {
    this.canvas.fillStyle = "rgba(0, 0, 0, 0.94)";
    var prev = this.canvas.globalCompositeOperation;
    this.canvas.globalCompositeOperation = "destination-in";
    this.canvas.fillRect(0, 0, this.width, this.height);
    this.canvas.globalCompositeOperation = prev;

    this.canvas.beginPath();
    var i = -1, cx, cy;
    while (++i < this.particles.length) {
      var d = this.particles[i];
      if (d.prev_x == undefined)
        continue
      this.canvas.beginPath();
        var cx = this.x_transform( d.prev_x );
        var cy = this.y_transform( d.prev_y );
        this.canvas.moveTo(cx, cy);
        var new_cx = this.x_transform( d.x );
        var new_cy = this.y_transform( d.y );
        this.canvas.lineTo(new_cx, new_cy);
      this.canvas.stroke();
    }
  };
  updateParticles(){
    for(var i=0; i < this.particles.length; i++){
      if (this.particles[i].age > this.particles[i].lifespan)
        this.particles[i] = this.createParticle();
      this.particles[i].age ++;

      this.particles[i].prev_x = this.particles[i].x;
      this.particles[i].prev_y = this.particles[i].y;

      this.particles[i] = this.updateParticle(this.particles[i]);
    }
  }


  start() {
    var self = this;
    function step(){
      self.updateParticles();
      self.drawParticles();
    }
    this.timer = d3.timer(step);
  }
}
