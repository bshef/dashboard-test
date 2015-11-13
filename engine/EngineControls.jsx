EngineControls = React.createClass({
    propTypes: {
        // This component gets the engine to display through a React prop.
        // We can use propTypes to indicate it is required
        engine: React.PropTypes.object.isRequired
    },

    getRandomPercentInteger() {
        return Math.floor((Math.random() * 100) + 1);
    },

    startupEngine() {
        //  Set the online property to TRUE
        Engines.update(this.props.engine._id, {
            $set: {online: true}
        });
        //  Set the fuel to a random value if it was 0
        if(this.props.engine.fuel <= 0) {
            Engines.update(this.props.engine._id, {
                $set: {fuel: this.getRandomPercentInteger()}
            });
        }        
        //  Set the throttle to a random value
        Engines.update(this.props.engine._id, {
            $set: {throttle: this.getRandomPercentInteger()}
        });
        console.log('ENGINE', this.props.engine.text, 'ENGINE START');
    },

    clearAllAlarms(engineId) {
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
    },

    shutdownEngine() {
        //  Set the online property to FALSE
        Engines.update(this.props.engine._id, {
            $set: {online: false}
        });
        //  Set throttle to 0
        Engines.update(this.props.engine._id, {
            $set: {throttle: 0}
        });
        //  Clear alarms
        this.clearAllAlarms(this.props.engine_id);
        console.log('ENGINE', this.props.engine.text, 'ENGINE SHUTDOWN');
    },

    deleteThisEngine() {
        Engines.remove(this.props.engine._id);
    },

    render() {
        //  Critical data
        const engineName = this.props.engine.text;
        const online = this.props.engine.online;
        const buttonWidth = 200;

        //  Determine button class names
        const startButtonClassName = online ? "btn btn-default btn-xs disabled" : "btn btn-success btn-xs";
        const shutdownButtonClassName = online ? "btn btn-danger btn-xs" : "btn btn-default btn-xs disabled";

        //  Determine button labels
        const startButtonLabel = online ? 'ONLINE' : 'START ENGINE';
        const shutdownButtonLabel = online ? 'SHUTDOWN ENGINE' : 'OFFLINE';

        return (
            <div className="panel-body">
                <div className="btn-group">
                    <a href="#" className={startButtonClassName} style={{width: '100%'}} onClick={this.startupEngine}>{startButtonLabel}</a>
                    <a href="#" className={shutdownButtonClassName} style={{width: '100%'}} onClick={this.shutdownEngine}>{shutdownButtonLabel}</a>
                    <a href="#" className="btn btn-default btn-xs" style={{width: '100%'}} onClick={this.deleteThisEngine}>Delete this engine</a>
                </div>            
            </div>
        );
    }
});