/* 
  Maria Luisa Costa Pinto - marialuisaufmg@gmail.com
  Tarefa de Desenvolvimento - Paiva Piovesan
  Junho 2015
 */

var project = angular.module('cashFlow', []);

project.controller('operationsController', function($scope) {

  $scope.arrayOperations = [];
  
  // Inicializa as variaveis
  $scope.dateOperation = '2015-06-01';
  $scope.typeOperation = "Receita";
  $scope.valueOperation = 0;
  $scope.total = 0;
  $scope.previousValue = 0;

  // Funcao q adiciona um novo lancamento do caixa da empresa
  $scope.addOperation = function() {
    
    // Se o tipo for 'Despesa', converte o valor para negativo
    if($scope.typeOperation == "Despesa")
      $scope.valueOperation = $scope.valueOperation - (2 * $scope.valueOperation);

    // calculo
    $scope.total += $scope.valueOperation;

    // Dois valores sao inseridos no array dos lançamentos feitos: o valor do lançamento anterior e o valor atual
    // Para que na mesma data o saldo da empresa passe de um valor para outro
    $scope.arrayOperations.push({ dateString: $scope.dateOperation, type: $scope.typeOperation, valuec: $scope.valueOperation, total: $scope.previousValue, show: false });
    $scope.arrayOperations.push({ dateString: $scope.dateOperation, type: $scope.typeOperation, valuec: $scope.valueOperation, total: $scope.total, show: true });

    $scope.previousValue = $scope.total;
    $scope.dateOperation = '2015-06-01';
    $scope.typeOperation = "Receita";
    $scope.valueOperation = 0;
  };

  // Desenho do grafico usando d3js
  $scope.drawGraphic = function(array) {

    // Propriedades do Grafico
    var line = d3.svg.line()
      .x(function(d) { console.log(d.date); return x(d.date); })
      .y(function(d) { return y(d.total); });
    var svg = d3.select("body .graphic")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Converte as strings para formato Date
    array.forEach(function(d) {
      d.date = parseDate(d.dateString);
      d.total = +d.total;
    });

    // Define o dominio das coordenadas x e y 
    x.domain(d3.extent(array, function(d) { return d.date; }));
    y.domain(d3.extent(array, function(d) { return d.total; }));

    // 
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "12px")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .style("font-size", "12px")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .style("font-size", "12px")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Valor ($)");
    svg.append("path")
        .datum(array)
        .attr("class", "line")
        .attr("d", line);
  };

  // Funcao para apagar o grafico
  $scope.exit =  function() {      
    d3.select("svg").remove();
  };

  // Atualiza o grafico, apaga o anterior e desenha novamente
  $scope.update = function(array){
    $scope.exit();
    $scope.drawGraphic(array);
  };

  // Funcao para limpar o array com os laçamentos
  $scope.clearOperations = function(){
    $scope.arrayOperations = [];
    $scope.total = 0;
    $scope.previousValue = 0;
  };

  // Propriedades do Grafico
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  var x = d3.time.scale()
      .range([0, width]);
  var y = d3.scale.linear()
      .range([height, 0]);

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  var customTimeFormat = d3.time.format("%b %d");

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(customTimeFormat)
    .ticks(7)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
});

