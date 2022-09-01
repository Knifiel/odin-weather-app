const APIkey = '6ca3dfe826d462d0b8e460e844d7d899'

class CachedAPICall{
    constructor(call, response){
    this.call = call
    this.responseData = response
    this.time = Math.floor((Number(new Date().getTime())/1000)/60)
    }
}

const recentAPIcalls = []

setInterval(checkDuplicates, 60000)

function checkDuplicates(){
    const currentTime = Math.floor((Number(new Date().getTime())/1000)/60)
recentAPIcalls.forEach((element, index) => {
    if(currentTime - element.time > 10){
        recentAPIcalls.splice(index, 1)
    }
})
}


function stringifyCall(call){
    let tempCall = call
    if(tempCall instanceof Object === true){
        tempCall = JSON.stringify(tempCall)
    }
    return tempCall
}

function checkCache(call){
    console.log('Checking for data in cache:')
    console.log(call)
    return recentAPIcalls.some((element) => element.call === stringifyCall(call))
}

function addToCache(call, data){
    const cachedCall = new CachedAPICall(stringifyCall(call), JSON.stringify(data))
    recentAPIcalls.push(cachedCall)
}

function getCachedData(call){
    const cachedCall = recentAPIcalls.find(element => element.call === stringifyCall(call))
    return JSON.parse(cachedCall.responseData)
}

export const API = {
    getCitiesList: async (city) => getCitiesList(city),
    getWeatherData: async (coords) => getWeatherData(coords)
}

const getCitiesList = async (city) => {
    try {
    if(!checkCache(city)){
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIkey}`, {mode: "cors"})
    if(response.status == 200){
        const responseData = await response.json()
        addToCache(city, responseData)
        return responseData
    } else {
    throw 'Invalid request'
    }
    } else{
        return getCachedData(city)
    }
    } catch (err) {
        console.error("Error:" + err);
        throw err
    }
}

const getWeatherData = async (call) => {
    try{
        if(!checkCache(call, new Date())){
        const response = await fetch(`https://api.openweathermap.org/data/2.5/${call.type}?lat=${call.lat}&lon=${call.lon}&appid=${APIkey}&units=metric`)
        const weatherData = await response.json()
        addToCache(call, weatherData)
        return weatherData
        } else {
            return getCachedData(call)
        }
    } catch (err){
        console.log(err)
    }
    
}