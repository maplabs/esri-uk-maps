//Code based on sample at https://bl.ocks.org/mbostock/3757125

var width = 150,
height = 150;

var projection = d3.geo.orthographic()
.scale(75)
.translate([width / 2, height / 2])
.clipAngle(90)
.precision(.1);

var path = d3.geo.path()
.projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#overview").append("svg")
.attr("width", width)
.attr("height", height);

svg.append("defs").append("path")
.datum({type: "Sphere"})
.attr("id", "sphere")
.attr("d", path);

svg.append("use")
.attr("class", "fill")
.attr("xlink:href", "#sphere");

d3.json("assets/world-50m.json", function(error, world) {
if (error) throw error;

svg.insert("path", ".graticule")
  .datum(topojson.feature(world, world.objects.land))
  .attr("class", "land")
  .attr("d", path);

svg.insert("path", ".graticule")
  .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
  .attr("class", "boundary")
  .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

function refresh() {
    svg.selectAll(".land").attr("d", path);
  }

  function panTo(where){
      d3.select("#overview").transition()
      .duration(500)
      .tween("rotate", function() {
        var p = where,
            r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function (t) {
          projection.rotate(r(t));
          svg.selectAll(".land").attr("d", path);

        }
})
}