 var baseUrl="http://192.168.0.178:8080";
var chart;

$(document).ready(function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    chart = new Chart(ctx , {
        type: "line",
        data: [], 
      });
    Chart.scaleService.updateScaleDefaults('linear', {
    ticks: {
        min: 0
    }
});
});

function drawLineChart(potId,minutes) {

  // Add a helper to format timestamp data
  Date.prototype.formatMMDDhhmm = function() {
      return (this.getMonth() +
      "/"  + this.getUTCDay() +
      " " +  this.getHours() +
      ":" +  this.getMinutes());
  }
   
  var jsonData = $.ajax({
    url: baseUrl+'/pots/latest?potid='+potId+'&minutes='+minutes,
    dataType: 'json',
  }).done(function (results) {

    // Split timestamp and data into separate arrays
    var labels = [], data=[];
    results.forEach(function(packet) {
      //labels.push(new Date (packet.timestamp).getDate()+" "+ new Date(packet.timestamp).getHours()+":"
    //      + new Date(packet.timestamp).getMinutes());
        
        labels.push(new Date (packet.timestamp).toLocaleString());
        data.push({
          t: new Date (packet.timestamp),
          y: parseFloat(packet.soilTemp).toFixed(2)
        });
      //data.push(new Date (packet.timestamp).toLocaleString(),parseFloat(packet.soilTemp).toFixed(2));
    });

    // Create the chart.js data structure using 'labels' and 'data'
    var soilHumData = {
      labels : labels,
      datasets : [{
          label: 'Soil Humidity pot'+potId,
      fill: false,
      backgroundColor: 'blue',
        borderColor: 'blue',
    
      lineTension: 0,  
          data                  : data
      }]
    };
      
    

    chart.data = soilHumData;

      
    chart.update();

  });
}

function drawDhtLightChart(minutes) {
   
  var jsonData = $.ajax({
    url: baseUrl+'/dht/latest?minutes='+minutes,
    dataType: 'json',
  }).done(function (results) {

    // Split timestamp and data into separate arrays
    var labels = [], datatemp=[], datahum= [];
    results.forEach(function(packet) {
      //labels.push(new Date (packet.timestamp).getDate()+" "+ new Date(packet.timestamp).getHours()+":"
    //      + new Date(packet.timestamp).getMinutes());
        
        labels.push(new Date (packet.timestamp).toLocaleString());
        datatemp.push({
          t: new Date (packet.timestamp),
          y: parseFloat(packet.temp).toFixed(2)
        });
        datahum.push({
          t: new Date (packet.timestamp),
          y: parseFloat(packet.humidity).toFixed(2)
        });
      //data.push(new Date (packet.timestamp).toLocaleString(),parseFloat(packet.soilTemp).toFixed(2));
    });
    $.ajax({
        url: baseUrl+'/light/latest?minutes='+minutes,
        dataType: 'json',
    }).done(function (results) {
        var labels = [], datalight=[];
        results.forEach(function(packet) {

            labels.push(new Date (packet.timestamp).toLocaleString());
            datalight.push({
              t: new Date (packet.timestamp),
              y: parseFloat(packet.light).toFixed(2)
            });   

        });
        var dhtData = {
          labels : labels,
          datasets : [{
              label: 'Temperature',
          fill: false,
          backgroundColor: 'red',
            borderColor: 'red',

          lineTension: 0,  
              data                  : datatemp
          },
            {
              label: 'Humidity',
          fill: false,
          backgroundColor: 'blue',
            borderColor: 'blue',

          lineTension: 0,  
              data                  : datahum
          },
            {
              label: 'Light',
          fill: false,
          backgroundColor: 'yellow',
            borderColor: 'yellow',

          lineTension: 0,  
              data                  : datalight
          }]
        };



        chart.data = dhtData;


        chart.update();
    })
  });
}

function drawTempChart(minutes) {
   
  var jsonData = $.ajax({
    url: baseUrl+'/dht/latest?minutes='+minutes,
    dataType: 'json',
  }).done(function (results) {


    var labels = [], datatemp=[];
    results.forEach(function(packet) {
  
        labels.push(new Date (packet.timestamp).toLocaleString());
        datatemp.push({
          t: new Date (packet.timestamp),
          y: parseFloat(packet.temp).toFixed(2)
        });
       });
    
        var dhtData = {
          labels : labels,
          datasets : [{
              label: 'Temperature',
          fill: false,
          backgroundColor: 'red',
            borderColor: 'red',

          lineTension: 0,  
              data                  : datatemp
          }]
        };
        chart.data = dhtData;
        chart.update();
    });
 
}

function drawHumChart(minutes) {
   
  var jsonData = $.ajax({
    url: baseUrl+'/dht/latest?minutes='+minutes,
    dataType: 'json',
  }).done(function (results) {


    var labels = [], datahum=[];
    results.forEach(function(packet) {
  
        labels.push(new Date (packet.timestamp).toLocaleString());
        datahum.push({
          t: new Date (packet.timestamp),
          y: parseFloat(packet.humidity).toFixed(2)
        });
       });
    
        var dhtData = {
          labels : labels,
          datasets : [{
              label: 'Humidity',
          fill: false,
          backgroundColor: 'red',
            borderColor: 'red',

          lineTension: 0,  
              data                  : datahum
          }]
        };
        chart.data = dhtData;
        chart.update();
    });
 
}

function drawLightChart(minutes) {
   
  var jsonData = $.ajax({
        url: baseUrl+'/light/latest?minutes='+minutes,
        dataType: 'json',
    }).done(function (results) {
        var labels = [], datalight=[];
        results.forEach(function(packet) {

            labels.push(new Date (packet.timestamp).toLocaleString());
            datalight.push({
              t: new Date (packet.timestamp),
              y: parseFloat(packet.light).toFixed(2)
            });   

        });
        var dhtData = {
          labels : labels,
          datasets : [{
            label: 'Light',
            fill: false,
            backgroundColor: 'yellow',
            borderColor: 'yellow',
            lineTension: 0,  
            data : datalight
          }]
        };



        chart.data = dhtData;


        chart.update();
    });
}



