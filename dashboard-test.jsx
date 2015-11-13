//
//  VARIALBES
//

Engines = new Mongo.Collection("engines");

//
//  CLIENT
//
if (Meteor.isClient) {
    //  This code is executed on the client only

    Meteor.startup(function () {
        // Use Meteor.startup to render the component after the page is ready
        // React.render(<App />, document.getElementById("render-target"));
        React.render(<EngineList />, document.getElementById("engine-render-target"));
    });
}


// 
//  SERVER
//
if (Meteor.isServer) {
    Meteor.startup(function () {
        console.log(timestamp(), '\t', 'Server running.');

        //  Decrease fuel
        Meteor.setInterval(runEngines, 1 * 1000);
    });    
}

function runEngines() {
    var engines = Engines.find({}).fetch();
    for(var i in engines) {
        var engine = engines[i];
        calculateFuel(engine);
        calculateTemperature(engine);
        checkForAlarms(engine);
    }
}

function checkForAlarms(engine) {
    if(engine.online) {
        var engineId = engine._id;
        var fuelAlarm = engine.fuel < engine.fuelLowValue;
        if(engine.alarms.fuelLow.value != fuelAlarm) {
            setAlarm(engine, 'fuelLow', fuelAlarm);
        }
        

        var tempAlarm = engine.temperature > engine.temperatureHighValue;
        if(engine.alarms.temperatureHigh.value != tempAlarm) {
            setAlarm(engine, 'temperatureHigh', tempAlarm);
        }        
    }    
}

function setAlarm(engine, alarmName, value) {
    var engineId = engine._id;
    //  Get all alarm data on engine
    var alarms = Engines.findOne(engineId).alarms;

    //  Update data for alarm in collection
    if(alarms[alarmName]) {
        alarms[alarmName].value = value;
    }

    //  Update collection
    Engines.update(engineId, {
        $set: {
            alarms: alarms
        }
    });
    console.log('ENGINE', engine.text, 'ALARM', alarms[alarmName].msg, 'set to', value);
}

function clearAllAlarms(engineId) {
    Engines.update(engineId, {
        $set: {
            alarms: {
                fuelLow: {
                    name: 'fuelLow',
                    msg: 'LOW FUEL',
                    value: false
                },
                temperatureHigh: {
                    name: 'temperatureHigh',
                    msg: 'HIGH TEMPERATURE',
                    value: false
                }
            },
        }
    });
}

function calculateTemperature(engine) {
    var previousTemp = engine.temperature;
    if(engine.online) {
        //  Heat up
        var currentTemp = previousTemp + (engine.throttle/50);
        console.log('Engine', engine.text, 'temperature increased by', (engine.throttle/50), 'from', previousTemp, 'to', currentTemp);
        if(currentTemp > 100) {
            console.log('ENGINE', engine.text, 'overheated. SHUTTING DOWN.');
            autoShutdownEngine(engine);
        } else {
            Engines.update(engine._id, {
                $set: {
                    temperature: currentTemp
                }
            });
        }
    } else {
        //  Cooldown
        var currentTemp = previousTemp - 0.1;
        console.log('Engine', engine.text, 'temperature decreased by', 'from', previousTemp, 'to', currentTemp);
        if(currentTemp > 0) {
            Engines.update(engine._id, {
                $set: {
                    temperature: currentTemp
                }
            });
        }
    }
}

function calculateFuel(engine) {
    if(engine.online) {
        var currentFuel = engine.fuel;
        var fuelRemaining = Math.floor(currentFuel - (engine.throttle/20));
        if(fuelRemaining < 0) {
            Engines.update(engine._id, {
                $set: {
                    fuel: 0
                }
            });
            console.log('ENGINE', engine.text, 'is out of fuel. SHUTTING DOWN.');
            autoShutdownEngine(engine);
        } else {
            Engines.update(engine._id, {
                $set: {
                    fuel: fuelRemaining
                }
            });
        }
    }
}

function autoShutdownEngine(engine) {    
    Engines.update(engine._id, {
        $set: {
            throttle: 0
        }
    });
    Engines.update(engine._id, {
        $set: {
            online: false
        }
    });
    clearAllAlarms(engine._id);
}

//
//  COMMON
//

//  Return a UTC Timestamp string
function timestamp() {
    return '[' + (new Date()).toUTCString() + ']';
}
