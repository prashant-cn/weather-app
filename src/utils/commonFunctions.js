const request = require('request')

//Get GeoCode Function
const geoCode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=youraccesstoken&limit=1'

    request({url, json: true}, (error, {body} = {}) =>{
        //const {body} = response
        if(error){
            callback('Unable to connect to Map Box API|Network Error', undefined)
        }else if(body.features && body.features.length === 0){
            callback('Unable to find location. Try something else!', undefined)
        }else if(body.message){
            callback('Issue in API URL', undefined)
        }else{
            callback(undefined, {
                location: body.features[0].place_name,
                coordinates: body.features[0].center,
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0]
            })
        }
    })
}

// Get Forecast Function
const getForecast = ({latitude, longitude}, callback) => {
    const url = 'https://api.darksky.net/forecast/yourapikey/'+latitude+','+longitude+'?units=ca&'
    
    request({url, json: true}, (error, {body} = {}) =>{
        if(error){
            callback('Unable to connect to Weather API | Network Error', undefined)
        }else if(body.error){
            callback(body.error, undefined)
        }else{
            callback(undefined, {
                dailySummary: body.daily.data[0].summary,
                currentlySummary: body.currently.summary,
                temperature: body.currently.temperature,
                temperatureLow: body.daily.data[0].temperatureLow,
                temperatureHigh: body.daily.data[0].temperatureHigh,
                feelsLike: body.currently.apparentTemperature,
                rainProbability: body.currently.precipProbability,
                windSpeed: body.currently.windSpeed,
                humidity: body.currently.humidity,
                visibility: body.currently.visibility,
                dailyData: body.daily.data,
                weeklySummary: body.daily.summary,
            })
        }
    })
}

module.exports = {
    geoCode: geoCode,
    getForecast: getForecast
}