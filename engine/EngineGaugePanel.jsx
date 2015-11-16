EngineGaugePanel = React.createClass({
	propTypes: {
		// This component gets the engine to display through a React prop.
        // We can use propTypes to indicate it is required
        engine: React.PropTypes.object.isRequired
	},

	//  Bar class names
    barGoodClassName(active) { return "progress-bar progress-bar-success" + (active ? '' : ' disabled')},
    barWarnClassName(active) { return "progress-bar progress-bar-warning" + (active ? '' : ' disabled')},
    barDangerClassName(active) { return "progress-bar progress-bar-danger" + (active ? '' : ' disabled')},
    barSpecialClassName(active) { return "progress-bar progress-bar-info" + (active ? '' : ' dsiabled')},
    barActiveClassName(active) { return "progress progress-striped" + (active ? ' active' : ' disabled')},

    getProgressClassNameWarnLow(active, value) {
        return value > 25 ? (value > 50 ? this.barGoodClassName(active) : this.barWarnClassName(active)) : this.barDangerClassName(active);
    },

    getProgressClassNameWarnHigh(active, value) {
        return value < 75 ? (value < 50 ? this.barGoodClassName(active) : this.barWarnClassName(active)) : this.barDangerClassName(active);
    },

    getProgressClassNameTemperature(active, value) {
        if(value < 20) {
            return this.barSpecialClassName(active);
        } else if (value < 50) {
            return this.barGoodClassName(active);
        } else if (value < 75) {
            return this.barWarnClassName(active);
        } else {
            return this.barDangerClassName(active);
        }
    },

    render() {
        //  Critical data
        const engineName = this.props.engine.text;
        const online = this.props.engine.online;
        const alarms = this.props.engine.alarms;

        //  Engine values
        var engineFuel = this.props.engine.fuel;
        var engineThrottle = this.props.engine.throttle;
        var engineTemperature = this.props.engine.temperature;
        var engineTemperatureKelvin = (engineTemperature * 3.17).toFixed(2);

        //  Determine bar class names
        const fuelClassName = this.getProgressClassNameWarnLow(online, engineFuel);
        const throttleClassName = this.barActiveClassName(online);
        const temperatureClassName = this.getProgressClassNameTemperature(online, engineTemperature);

        //  Determine alarm indicators
        const alarmIndicator = <i className="mdi mdi-alert"></i>;
        const fuelAlarm =alarms.fuelLow.value ? alarmIndicator : '';
        const throttleAlarm = '';
        const temperatureAlarm = alarms.temperatureHigh.value ? alarmIndicator : '';

        return (
        	<div className="panel-body">
	            <div className="row">
                    <div className="col-md-1" style={{color: '#F0AD4E'}}>{{fuelAlarm}}</div>
	                <div className="col-md-2">Fuel</div>
	                <div className="col-md-8">
	                    <div className="progress">
	                        <div className={fuelClassName} style={{width: engineFuel + '%'}}></div>
	                    </div>
	                </div>
	                <div className="col-md-1">{{engineFuel}}%</div>
	            </div>
	            <div className="row">
                    <div className="col-md-1" style={{color: '#F0AD4E'}}>{{throttleAlarm}}</div>
	                <div className="col-md-2">Throttle</div>
	                <div className="col-md-8">
	                    <div className="progress progress-striped active">
	                        <div className="progress-bar" style={{width: engineThrottle + '%'}}></div>
	                    </div>
	                </div>
	                <div className="col-md-1">{{engineThrottle}}%</div>
	            </div>
	            <div className="row">
                    <div className="col-md-1" style={{color: '#F0AD4E'}}>{{temperatureAlarm}}</div>
	                <div className="col-md-2">Temperature</div>
	                <div className="col-md-8">
	                    <div className="progress">
	                        <div className={temperatureClassName} style={{width: engineTemperature + '%'}}></div>
	                    </div>
	                </div>
	                <div className="col-md-1">{{engineTemperatureKelvin}}K</div>
	            </div>
            </div>
        );
    }
});
