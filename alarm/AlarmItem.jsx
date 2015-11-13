AlarmItem = React.createClass({
    acknowledgeAlarm() {
    	var alarmName = this.props.alarm.name;
    	//	Get all alarm data on engine
    	var alarms = Engines.findOne(this.props.engineId).alarms;

    	//	Update local alarm
    	this.props.alarm.value = false; 

    	//	Update data for alarm in collection
    	if(alarms[alarmName]) {
    		alarms[alarmName].value = false;
    	}

    	//	Update collection
    	Engines.update(this.props.engineId, {
    		$set: {
    			alarms: alarms
    		}
    	});
        console.log('ALARM', alarmName, 'ACKNOWLEDGED');
    },

    render() {
        return <button type="button" className="btn btn-primary btn-xs" onClick={this.acknowledgeAlarm}>{this.props.alarm.msg}</button>
    }
});