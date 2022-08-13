const https = require('https');

exports.handler = async (event) => {
    let dataString = '';
    
    const response = await new Promise((resolve, reject) => {
        const { queryStringParameters } = event;
        
        if (!queryStringParameters || !queryStringParameters.location) {
            resolve({
                statusCode: 400,
                body: 'Please provide a location!'
            })
        }
        
        const req = https.get(`https://api.weatherapi.com/v1/current.json?key=API_KEY&q=${queryStringParameters.location}&aqi=no`, function(res) {
          res.on('data', chunk => {
            dataString += chunk;
          });
          
          res.on('end', () => {
            let weather = JSON.parse(dataString);
            
            let themeCodeArray = [];
            
            if (weather.current.is_day) {
              themeCodeArray.push('day');
            } else {
              themeCodeArray.push('night');
            }
            
            let weatherCondition;
            
            if (weather.current.condition && weather.current.condition.text) {
              weatherCondition = weather.current.condition.text.toLowerCase();
              
              // Possible weather conditions: https://www.weatherapi.com/docs/weather_conditions.json
            
              if (weatherCondition.includes('sunny')) {
                themeCodeArray.push('sunny');
              } else if (
                weatherCondition.includes('snow') ||
                weatherCondition.includes('blizzard') ||
                weatherCondition.includes('ice')
              ) {
                themeCodeArray.push('snow');
              } else if (
                weatherCondition.includes('rain') ||
                weatherCondition.includes('sleet') ||
                weatherCondition.includes('drizzle') ||
                weatherCondition.includes('thunder') ||
                weatherCondition.includes('sleet')
              ) {
                themeCodeArray.push('rain');
              } else if (
                weatherCondition.includes('cloudy') ||
                weatherCondition.includes('overcast') ||
                weatherCondition.includes('mist') ||
                weatherCondition.includes('fog')
              ) {
                themeCodeArray.push('cloudy');
              }
            }
            
            let themeCodeString = themeCodeArray.join('-');
            
            resolve({
                statusCode: 200,
                body: {
                  location: {
                    name: weather.location.name,
                    region: weather.location.region,
                  },
                  themeCode: themeCodeString
                }
            });
          });
        });
        
        req.on('error', (e) => {
          reject({
              statusCode: 500,
              body: 'Something went wrong!'
          });
        });
    });
    
    return response;
};
