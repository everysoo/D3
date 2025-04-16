var maxRadius = 35;
var rScale = d3.scaleSqrt().domain([0, 210]).range([0, maxRadius]);
var popup;

var colorScale={
  "France": '#016FB9',
  "Luxembourg": '#C6E0FF',
  "Belgium": '#555',
  "Italy": '#58BC82',
  "Switzerland": '#D16462',
  "Spain": '#FFC400',
  "Netherlands": '#F86018',
  "USA": '#74B0D8',
  "Ireland Irish": '#FFF',
  "Denmark": '#EBBCBB',
  "Germany": '#FFCE00',
  "Australia": '#013D65',
  "United Kingdom": '#B80C09',
  "Results voided": 'none'
}



// 차트 그리드
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
    d.layout.winnerColor = colorScale[d["Winner's Nationality"].trim()];
  });
}

// 마우스 오버 팝업 기능
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

// 차트 렌더링
function updateChart(data) {
  layout(data);                             // layout 함수 불러옴

  // entrants
  d3.select('svg g.chart g.entrants')       // html 태그 연결
    .selectAll('circle')                    // 가상의 circle 생성
    .data(data)                             // data 연결
    .join('circle')                         // data-circle 연결
    .attr('cx', function(d) {
      return d.layout.x;                    // 원의 x 배치
    })
    .attr('cy', function(d) {
      return d.layout.y;                    // 원의 y 배치
    })
    .attr('r', function(d) {
      return d.layout.entrantsRadius;       // 반지름 설정
    })
    .style('fill', 'none')
    .style('stroke', '#aaa')
    .style('stroke-dasharray', '1 1');

  // finishers
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
      popup.point(d3.event.clientX, d3.event.clientY);      // 커서 감시
      popup.html(popupTemplate(d));                         // html화
      popup.draw();                                         // 렌더링
    })
    .on('mouseout', function() {
      popup.hide();
    });

  d3.select('svg g.chart g.winners')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d){
      return d.layout.x;
    })
    .attr('cy', function(d){
      return d.layout.y;
    })
    .attr('r', 5)
    .style('pointer-events', 'none')
    .style('fill', function(d){
      return d.layout.winnerColor;
    })
}

// 콜백
function dataIsReady(data) {
  updateChart(data);
  popup = Popup();
}

d3.csv('data/tour_de_france.csv')
  .then(dataIsReady);
