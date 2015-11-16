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
        console.log(timestamp(), '\t', 'CLIENT running.');
    });

    //  Subscribe to Engines data
    Meteor.subscribe('engines');

    //  Define templates
    Template.engines.helpers({
        EngineList() {
            return EngineList;
        }
    });

    //  Initialize Engines
    var engines = Engines.find().fetch();
    if(engines.length <= 0) {
        console.log(engines);
        var names = ['A', 'B', 'C'];
        for(var i in names) {
            createEngine();
        }
    }
}


//
//  SERVER
//
if (Meteor.isServer) {
    Meteor.startup(function () {
        console.log(timestamp(), '\t', 'SERVER running.');
    });

    //  Publish Engines data
    Meteor.publish('engines', function() {
        return Engines.find();
    });

    //  Meteor methods
    Meteor.methods({
        'createEngine': function(engineName) {
            createEngine(engineName);
        },
        'deleteEngine': function(engineId) {
            deleteEngine(engineId);
        },
        'startupEngine': function(engine) {
            startupEngine(engine);
        },
        'shutdownEngine': function(engine) {
            shutdownEngine(engine);
        }
    });

    //  Run Engines
    Meteor.setInterval(runEngines, 0.5 * 1000);
}

//  ENGINE SYSTEMS

function createEngine(engineName) {
    var date = new Date();
    var name = engineName ? engineName.toUpperCase() : date.toISOString();
    //  Initialize engine data
    var engineData = {
        text: name,
        online: true,
        fuel: getRandomPercentInteger(),
        fuelLowValue: 25,
        throttle: getRandomPercentInteger(),
        temperature: getRandomPercentInteger(),
        temperatureHighValue: 75,
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
        createdAt: date
    };

    //  Initalize alarm condition(s)
    engineData.alarms.fuelLow.value = engineData.fuel < engineData.fuelLowValue;
    engineData.alarms.temperatureHigh.value = engineData.temperature > engineData.temperatureHighValue;

    //  Add engine data to collection
    Engines.insert(engineData);
}

function deleteEngine(engineId) {
    Engines.remove(engineId);
}

function startupEngine(engine) {
    //  Set the online property to TRUE
    Engines.update(engine._id, {
        $set: {online: true}
    });
    //  Set the fuel to a random value if it was 0
    if(engine.fuel <= 0) {
        Engines.update(engine._id, {
            $set: {fuel: getRandomPercentInteger()}
        });
    }
    //  Set the throttle to a random value
    Engines.update(engine._id, {
        $set: {throttle: getRandomPercentInteger()}
    });
    console.log('ENGINE', engine.text, 'ENGINE START');
}

function shutdownEngine(engine) {
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
    console.log('ENGINE', engine.text, 'ENGINE SHUTDOWN');
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
            setEngineAlarm(engine, 'fuelLow', fuelAlarm);
        }


        var tempAlarm = engine.temperature > engine.temperatureHighValue;
        if(engine.alarms.temperatureHigh.value != tempAlarm) {
            setEngineAlarm(engine, 'temperatureHigh', tempAlarm);
        }
    }
}

function setEngineAlarm(engine, alarmName, value) {
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

function clearAllEngineAlarms(engineId) {
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
    var engineCooldownRate = 0.25;
    var engineHeatFactor = 60;

    var previousTemp = engine.temperature;
    if(engine.online) {
        //  Heat up
        var increase = engine.throttle/engineHeatFactor;
        var currentTemp = previousTemp + increase;
        // console.log('Engine', engine.text, 'temperature increased by', increase, 'from', previousTemp, 'to', currentTemp);
        if(currentTemp > 100) {
            console.log('ENGINE', engine.text, 'overheated. SHUTTING DOWN.');
            shutdownEngine(engine);
        } else {
            Engines.update(engine._id, {
                $set: {
                    temperature: currentTemp
                }
            });
        }
    } else {
        //  Cooldown
        var currentTemp = previousTemp - engineCooldownRate;
        // console.log('Engine', engine.text, 'temperature decreased by', engineCooldownRate, 'from', previousTemp, 'to', currentTemp);
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
        var fuelUseFactor = 50;
        var decrease = engine.throttle/fuelUseFactor;

        var currentFuel = engine.fuel;
        var fuelRemaining = Math.floor(currentFuel - decrease);
        if(fuelRemaining < 0) {
            Engines.update(engine._id, {
                $set: {
                    fuel: 0
                }
            });
            console.log('ENGINE', engine.text, 'is out of fuel. SHUTTING DOWN.');
            shutdownEngine(engine);
        } else {
            Engines.update(engine._id, {
                $set: {
                    fuel: fuelRemaining
                }
            });
        }
    }
}

//
//  COMMON
//

//  Return a UTC Timestamp string
function timestamp() {
    return '[' + (new Date()).toUTCString() + ']';
}

//  Return a random integer between 1 and 100
function getRandomPercentInteger() {
    return Math.floor((Math.random() * 100) + 1);
}
