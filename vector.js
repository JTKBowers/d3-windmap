class Vector {
  constructor(elements) {
    this.elements = elements;
  }

  // No operator overloading in javascript :'(
  add(other) {
    if (!(other instanceof Vector))
      throw new Error("Cannot add to non-vector");
    if (this.elements.length != other.elements.length){
      console.log(this.elements, other.elements)
      throw new Error("Vector sizes do not match");
    }
    return new Vector(
      this.elements.map(function(x,i) {
        return x + other.elements[i];
      })
    );
  }
  mul_scalar(k) {
    return new Vector(
      this.elements.map(function(x) {
        return k*x;
      })
    );
  }

  euclidian_dist(other){
    if (!(other instanceof Vector))
      throw new Error("Cannot compute Euclidian distance from non-vector");
    var d = this.elements.map(function(x,i) {
      return x - other.elements[i];
    });
    var d2 = d.map(function(x) {
      return x*x;
    });
    var sq_dist = d2.reduce(function(a, b) { return a + b; }, 0);

    return Math.sqrt(sq_dist);
  }
  proj(projection){
    return new Vector(projection(this.elements))
  }
}

function euclidian_dist(a,b){
  return a.euclidian_dist(b);
}

function radialVector(mag, angle){
  var radian_angle = Math.PI*angle/180;
  var x = mag*Math.sin(radian_angle);
  var y = mag*Math.cos(radian_angle);
  return new Vector([x,y])
}
//
// a = new Vector([1,1])
// b = new Vector([2,2])
// b = new Vector([3,3,3])
//
// console.log(a.add(b))
// console.log(a.add(c))
// console.log(a.add(3))
