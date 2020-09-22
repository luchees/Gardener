getLatestData(0);
getLatestData(1);
getLatestData(2);
getLatestData(3);
getLatestDht(1);
getLatestLight();

var value=3;

var canvasChart;
$(document).ready(function () {
    drawDhtLightChart(120);
         var values = [10,60,120,460,1440,4320,10080]; 
        var input = document.getElementById("minRange");
        
    console.log(value);
        for (var val in values)
        {
           var option= document.createElement('option');
            option.innerHTML=values[val];
            input.appendChild(option);
        }
        input.selectedIndex=value;
    
    setInterval(function () {
       getLatestData(0);
        getLatestData(1);
        getLatestData(2);
        getLatestData(3);
        getLatestDht(1);
        getLatestLight();
        
    }, 15000);

    $(".first").click(function(event) { 
        console.log("updating pot chart");
        drawLineChart(event.target.id,values[value]);    
        input.onchange  = function () {
            console.log("updating pot chart");
            drawLineChart(event.target.id,input.options[input.selectedIndex].value);
      }
    });
    $("#clicktemp").click(function(event) { 
        console.log("updating temp chart");
        drawTempChart(input.options[input.selectedIndex].value);   
        input.onchange  = function () {
            console.log("updating temp chart");
            drawTempChart(input.options[input.selectedIndex].value);
      }
    });
    $("#clickhum").click(function(event) { 
        console.log("updating humidity chart");
        drawHumChart(input.options[input.selectedIndex].value);    
        input.onchange  = function () {
            console.log("updating humidity chart");
            drawHumChart(input.options[input.selectedIndex].value);
      }
    });
    $("#clicklight").click(function(event) { 
        console.log("updating light chart");
       drawLightChart(input.options[input.selectedIndex].value);   
        input.onchange  = function () {
            console.log("updating light chart");
            drawLightChart(input.options[input.selectedIndex].value);
      }
    });    

});



function getLatestData(potId) {
    var request = new XMLHttpRequest();
    var url="http://192.168.0.178:8080";
    request.open('GET', url+'/pots/latest?potid='+potId+'&minutes=1', true);

    request.onload = function () {
        var data =JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data = data[data.length-1]
            var soilHum=data.soilTemp;
        } else {
          console.log('error')
        }
        var el=document.getElementById('pot'+potId)
        colorHumElem(el.parentElement,soilHum);
        el.innerHTML = soilHum+'%';
        console.log(soilHum);
    }
    // Send request
    request.send();   
}

function getLatestDht(minutes) {

    var request = new XMLHttpRequest();
    var url="http://192.168.0.178:8080";
    request.open('GET', url+'/dht/latest?minutes='+minutes, true);

    request.onload = function () {
        var data =JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
             console.log(data);
            data = data[data.length-1]
           
           temp= data.temp;
            hum= data.humidity;
            
        } else {
          console.log('error')
        }
       
        var el=document.getElementById('temp')
        var hue = getHue(temp);
        el.parentElement.style.backgroundColor= 'hsl(' + [hue, '100%', '50%'] + ')';
        el.innerHTML = temp+'°C';
        
        var el2=document.getElementById('humidity')
        colorHumElem(el2.parentElement,hum);
        el2.innerHTML = hum+'%';
    }
    request.send()
}


function getLatestLight() {

    var request = new XMLHttpRequest();
var url="http://192.168.0.178:8080";
    request.open('GET', url+'/light/latest?minutes=1', true);

    request.onload = function () {
        var data =JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data = data[data.length-1]
            var light=data.light;
            
        } else {
          console.log('error')
        }
    
        var el=document.getElementById('light');

      
        el.parentElement.style.backgroundColor= getColorLight(light);
        

        el.innerHTML = light+' Lum';

        console.log("licht"+light)
    }
    // Send request
    request.send()
}


function colorHumElem(element,udata) {

    if (udata >= 55) {
      element.style.backgroundColor = '#99C262';
    }
    else if (udata > 35 && udata < 55)
    {
     element.style.backgroundColor = '#F8D347';
    }  
    else if (udata <=35)  
    {
      element.style.backgroundColor = '#FF6C60';
    }
  }

function getHue(nowTemp) {
  // following hsl wheel counterclockwise from 0
  // to go clockwise, make maxHsl and minHsl negative 
  // nowTemp = 70;
  var maxHsl = 380; // maxHsl maps to max temp (here: 20deg past 360)
  var minHsl = 170; //  minhsl maps to min temp counter clockwise
  var rngHsl = maxHsl - minHsl; // = 210

  var maxTemp = 115;
  var minTemp = -10;
  var rngTemp = maxTemp - minTemp; // 125
  var degCnt = maxTemp - nowTemp; // 0
  var hslsDeg = rngHsl / rngTemp;  //210 / 125 = 1.68 Hsl-degs to Temp-degs
  var returnHue = (360 - ((degCnt * hslsDeg) - (maxHsl - 360))); 
  return returnHue;  
}

function getColorLight(avglight){
    if (avglight > 100){
        return 'green';
    }
    else {
        return 'red'
    }
}


