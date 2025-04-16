var maxRadius = 20;
var rScale = d3.scaleSqrt().domain([0, 210]).range([0, maxRadius]);

function layout(data){
    var cellSize = 80, numCols = 10;

    data.forEach(function(d){
        d.layout = {};
    
        var i = d.Year - 1900;
        var col = i%numCols;
        d.layout.x = col * cellSize + 0.5 * cellSize;

        var row = Math.floor(i/numCols);
        d.layout.y = row * cellSize + 0.5 * cellSize;

        d.layout.entrantsRadius = rScale(d.Entrants);
        d.layout.finishersRadius = rScale(d.Finishers);

    });

}

function updateChart(data) {
    d3.select('svg g.char g.entrants')
        // join 
        .selectAll('circle')
        .data(data)
        .join('circle')

        // styling + position
        .attr('cx', function(d) {
            return d.layout.x;
            })
        .attr('cy', function(d){
            return d.layout.y;
        })
        .attr('r', function(d) {
        return d.layout.entrantsRadius;
        })
        .style('fill', '#aaa')
        .style('stroke', '#aaa')
        .style('stroke-dasharray', '1 1');

    d3.select('svg g.chart g.finishers')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', function(d){
            return d.layout.x;
        })
        .attr('r', function(d){
            return d.layout.finishersRadius;
        })
        .style('fill', '#aaa');
    }
      
function dataIsReady(data) {
    updateChart(data);
}

d3.csv('data/tour_de_france.csv')
  .then(dataIsReady);
