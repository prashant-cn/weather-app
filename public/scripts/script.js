//Accordions JS
const accordionFunction = () => {
  var acc = document.getElementsByClassName("accordion")
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}

//Get Next 7 days
function GetDates(startDate, daysToAdd) {
  var aryDates = [];

  for(var i = 0; i <= daysToAdd; i++) {
      var currentDate = new Date();
      currentDate.setDate(startDate.getDate() + i);
      aryDates.push(DayAsString(currentDate.getDay()));
  }
  return aryDates;
}
function DayAsString(dayIndex) {
  var weekdays = new Array(7);
  weekdays[0] = "Sunday";
  weekdays[1] = "Monday";
  weekdays[2] = "Tuesday";
  weekdays[3] = "Wednesday";
  weekdays[4] = "Thursday";
  weekdays[5] = "Friday";
  weekdays[6] = "Saturday";
  
  return weekdays[dayIndex];
}
function getDay(index){
  var startDate = new Date();
  var aryDates = GetDates(startDate, 7);
  return aryDates[index];
}

//Get Hour from UNIX time stamp - Expire in 2038 due to 32 bit workflow
const getHours = (unixTimestamp, minute) => {
  var date = new Date(unixTimestamp * 1000)
  if(minute){
    return date.toLocaleString('en-IN', {hour: '2-digit', minute: '2-digit'})
  }
  return date.toLocaleString('en-IN', {hour: '2-digit'})
}

//round off every number on the page
const roundOff = () => {
  var inputs = Array()
  var inputs = document.getElementsByClassName('roundOff')
      for(let i=0; i<inputs.length;i++){
          var getNum = inputs[i].innerHTML
          var putNum = Math.round(getNum)
          inputs[i].innerHTML = putNum
      }
}

//getweather request
const getWeather = (location, typeOfLocation) => {
  putResult1.textContent = 'Loding...'
  putResult2.textContent = ''
  dailyDataTemplate.textContent = ''

  fetch('/weather?address=' + location).then((response) =>{
    response.json().then((data) => {
        if(data.error){
            return putResult1.textContent = data.error
        }
        console.log(data)
        putResult1.textContent = data.location
        putResult2.innerHTML = `
        <div class="weeklySummary">${data.weeklySummary}</div>

        <div class="currentDetails">
        <div class="details">
        <div><span class="label">Humidity:</span> <span class="roundOff">${data.humidity*100}</span>%</div>
        <div><span class="label">Wind:</span> <span class="roundOff">${data.windSpeed}</span> kmph</div>
        <div><span class="label">Rain Probability:</span> ${data.rainProbability} %</div>
        <div><span class="label">Visibility:</span> <span class="roundOff">${data.visibility}</span>+ km</div>
        </div>

        <div class="overviewContainer">
        <div class="overview">
        <div>
        <span class="main">${Math.round(data.temperature)}&#x00B0; ${data.currentlySummary}</span>
        <span>Feels Like: <span class="roundOff">${data.feelsLike}</span>&#x00B0 Low: <span class="roundOff">${data.temperatureLow}</span>&#x00B0 High: <span class="roundOff">${data.temperatureHigh}</span>&#x00B0</span>
        </div>
        </div>
        <div class="overview summaryText">
        ${data.dailySummary}
        </div>
        </div>

        </div>`

        //Daily data rendering
        const dailyData = (item, index) => {
          if(index < 1) return
          dailyDataTemplate.innerHTML += `
            <button class="accordion">${getDay(index)}</button>
            <div class="panel">
            <div class="summaryText futureDaySummary">${item.summary}</div>
            <div class="dailyDetail">
            <div>
            <span class="temp"><span class="roundOff">${item.temperatureMin}</span>&#x00B0;</span><span class="time">${getHours(item.temperatureMinTime)}</span>
            &rarr;
            <span class="temp"><span class="roundOff">${item.temperatureMax}</span>&#x00B0;</span><span class="time">${getHours(item.temperatureMaxTime)}</span>
            </div>
            <div><span>Rain: </span><span class="rainIntensityValue">${(item.precipIntensity*24).toFixed(2)}mm/d</span></div>
            <div><span class="unicodes">&#x2600;</span>
            <span>Rise: </span><span class="riseAndShine">${getHours(item.sunriseTime, 'minute')}</span>
            <span>Set: </span><span class="riseAndShine">${getHours(item.sunsetTime, 'minute')}</span></div>
            </div>
            </div>`
        }
        data.dailyData.forEach(dailyData)
        accordionFunction() //call acccordion function
        roundOff()
        
    })
  })
}



const weatherForm = document.querySelector('form')
const searchTerm = document.querySelector('input')
const currentLocation = document.querySelector('#currentLocation')
const putResult1 = document.querySelector('#result-1')
const putResult2 = document.querySelector('#result-2')
const dailyDataTemplate = document.getElementById("dailyDataTemplatePlaceholder")

//Input Location Weather
weatherForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const location = searchTerm.value

    getWeather(location, 'address')

})

//Current Location Weather
currentLocation.addEventListener('click', (event) => {
    searchTerm.value = ''
    if(!navigator.geolocation){
        return alert('Your browser dosenot support GeoLocation')
    }
    navigator.geolocation.getCurrentPosition((position) => {  
    getWeather(`${position.coords.longitude},${position.coords.latitude}`, 'longlat') //order of cordinates is based on MapBox Api
    })
})
