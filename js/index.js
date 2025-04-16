var maxRadius = 20;
var rScale = d3.scaleSqrt().domain([0, 210]).range([0, maxRadius]);

var popup;

function layout(data){
    // 기본 원 사이즈 & 테이블 열의 갯수
    var cellSize = 80, numCols = 10;

    data.forEach(function(d){
        // layout이라는 배열 객체 생성
        d.layout = {};
        
        // 0, 1, 2, 3, 4 ... 인덱싱
        var i = d.Year - 1900;

        // 0 ~ 9까지의 숫자로 열인덱싱
        var col = i%numCols;

        // 각 연도별 x값 배정 + 간격
        d.layout.x = col * cellSize + 0.5 * cellSize;

        // 0 또는 1로 행인덱싱
        var row = Math.floor(i/numCols);

        // 각 연도별 y값 배정
        d.layout.y = row * cellSize + 0.5 * cellSize;

        // Ent, Fin의 반지름 
        d.layout.entrantsRadius = rScale(d.Entrants);
        d.layout.finishersRadius = rScale(d.Finishers);

    });

}

function popupTemplate(d){
    var year = +d.Year;
    var distance = +d["Total distance (km)"]
    var entrants = +d.Entrants;
    var finishers = +d.Finishers;
    var winner = d.Winner;
    var nationality = d["Winner's Nationality"];

    var html='';
    html += '<table><tbody>';
    html += '<tr><td>Year</td><td>' + year + '</td></tr>';
    html += '<tr><td>Total distance</td><td>' + distance + '</td></tr>';
    html += '<tr><td>Entrants</td><td>' + entrants + '</td></tr>';
    html += '<tr><td>Finishers</td><td>' + finishers + '</td></tr>';
    html += '<tr><td>Winner</td><td>' + winner + '</td></tr>';
    html += '<tr><td>Nationality</td><td>' + nationality + '</td></tr>';
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
        .style('stroke-dasharray', '1 1')

        // pop up
        .on('mousemove', function(d) {})
        .on('mouseout', function() {});

    d3.select('svg g.chart g.finishers')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', function(d){
            return d.layout.x;
        })
        .attr('cy', function(d){
            return d.layout.y
        })
        .attr('r', function(d){
            return d.layout.finishersRadius;
        })
        .style('fill', '#aaa')

        // pop up
        .on('mousemove', function(d) {
            // 마우스 커서의 위치
            popup.point(d3.event.clintX, d3.event.clientY);
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
