var maxRadius = 35;
var rScale = d3.scaleSqrt().domain([0, 210]).range([0, maxRadius]);
var popup;

function layout(data) {
  var cellSize = 80, numCols = 10;
  data.forEach(function(d) {
    d.layout = {};
    var i = d.Year - 1900;

    var col = i % numCols;
    d.layout.x = col * cellSize + 0.5 * cellSize;

    var row = Math.floor(i / numCols);
    d.layout.y = row * cellSize + 0.5 * cellSize;

    d.layout.entrantsRadius = rScale(d.Entrants);
    d.layout.finishersRadius = rScale(d.Finishers);
  });
}

function popupTemplate(d) {
  var year = +d.Year;
  var distance = +d["Total distance (km)"];
  var entrants = +d.Entrants;
  var finishers = +d.Finishers;
  var winner = d.Winner;
  var nationality = d["Winner's Nationality"];

  var html = '';
  html += '<table><tbody>';
  html += '<tr><td>Year</td><td>' + year + '</td></tr>';
  html += '<tr><td>Total distance</td><td>' + distance + 'km</td></tr>';
  html += '<tr><td>Entrants</td><td>' + entrants + '</td></tr>';
  html += '<tr><td>Finishers</td><td>' + finishers + '</td></tr>';
  html += '<tr><td>Winner</td><td>' + winner + '</td></tr>';
  html += '<tr><td>Nationality</td><td>' + nationality + '</td></tr>';
  html += '</tbody></table>';
  return html;
}

function updateChart(data) {
  layout(data);

  d3.select('svg g.chart g.entrants')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) {
      return d.layout.x;
    })
    .attr('cy', function(d) {
      return d.layout.y;
    })
    .attr('r', function(d) {
      return d.layout.entrantsRadius;
    })
    .style('fill', 'none')
    .style('stroke', '#aaa')
    .style('stroke-dasharray', '1 1');

  d3.select('svg g.chart g.finishers')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) {
      return d.layout.x;
    })
    .attr('cy', function(d) {
      return d.layout.y;
    })
    .attr('r', function(d) {
      return d.layout.finishersRadius;
    })
    .style('fill', '#aaa')
    .on('mousemove', function(d) {
      popup.point(d3.event.clientX, d3.event.clientY);
      popup.html(popupTemplate(d));
      popup.draw();
    })
    .on('mouseout', function() {
      popup.hide();
    });
}

function dataIsReady(data) {
  updateChart(data);
  popup = Popup();
}

d3.csv('data/tour_de_france.csv')
  .then(dataIsReady);
