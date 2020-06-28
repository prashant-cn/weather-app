const path = require('path')
const express = require('express')
const hbs = require('hbs')
const commonFunctions = require('./utils/commonFunctions.js')


const app = express()
const port = process.env.PORT || 3000

//Define paths for Express configs
const basePath = path.join(__dirname, '../public')
const partialsPath = path.join(__dirname, '../views/include')

//setting handelbars templating engine
app.set('view engine', 'hbs') 
hbs.registerPartials(partialsPath)

 //seting base path (top priority is given to the static files from public folder for root)
app.use(express.static(basePath))

// serve hompage from views(handlebar) folder
app.get('', (req, res) => {
    res.render('index', {
        name: 'Prashant Kumar',
        title: 'Home'
    }) //use render to render files from views folder
})

//About page
app.get('/about', (req, res) => {
    res.render('about', {
        name: 'Prashant Kumar',
        title: 'About Me'
    })
})

//Help Page
app.get('/help', (req, res) => {
    console.log(req.query)
    res.render('help', {
        message: `Got any Questions or Suggestions? Connect over `,
        name: 'Prashant Kumar',
        title: 'Help'
    })
})

//weather page
app.get('/weather', (req, res) => {
    const address = req.query.address
    if(address){
        //get geoCode
        commonFunctions.geoCode(address,(geoCodeError, {latitude, longitude, location} = {}) =>{
            // const {latitude, longitude, location} = geoCodeData
            if(geoCodeError){
                res.send({
                    error: geoCodeError
                })
            }else{
                //get Forecast
                commonFunctions.getForecast({latitude, longitude}, (forecastError, weatherData) =>{
                    const { rainProbability, windSpeed} = weatherData //ES6 Destructuring can also be used
                    if(forecastError){
                        res.send({
                            error: forecastError
                        })
                    }else{
                        res.send({
                            provideAddress: address,
                            dailySummary: weatherData.dailySummary,
                            currentlySummary: weatherData.currentlySummary,
                            temperature: weatherData.temperature,
                            temperatureLow: weatherData.temperatureLow,
                            temperatureHigh: weatherData.temperatureHigh,
                            feelsLike: weatherData.feelsLike,
                            location: location,
                            rainProbability,  //ES6 shorthand object syntax. if the property and variable name is same, use this.
                            windSpeed,
                            humidity: weatherData.humidity,
                            visibility: weatherData.visibility,
                            dailyData: weatherData.dailyData, 
                            weeklySummary: weatherData.weeklySummary, 
                        })
                    }
                })
            }
        })

    }else{
        res.send({
            error: 'Please provide an Address.'
        })
    }
    
})

// 404 page for Specific page type
app.get('/help/*', (req, res) => {
    res.render('404', {
        name: 'Prashant Kumar',
        title: 'Help Page Not Found',
        message: '404 | Help Page Not Found'
    })
})

// Generic 404 page
app.get('*', (req, res) => {
    res.render('404', {
        name: 'Prashant Kumar',
        title: '404',
        message: '404 | Page Not Found.'
    })
})

//Start node server
app.listen(port, () => {
    console.log('Server has started on port ' + port)
})