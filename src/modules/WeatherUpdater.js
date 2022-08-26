class WeatherUpdater {        
    constructor () {
        this.subscribers = []
    }
    
    addSub(sub){
        if(this.subscribers.includes(sub)){
            return
        } else {
            this.subscribers.push(sub)
        }
    }
    removeSub(sub){
        this.subscribers.splice(this.subscribers.indexOf(sub), 1)
    }
    updateWeather(weatherData){
        this.subscribers.forEach((sub) => {sub(weatherData)} )
    }   
}

export const weatherUpdater = new WeatherUpdater()