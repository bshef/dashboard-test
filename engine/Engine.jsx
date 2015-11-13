Engine = React.createClass({
    propTypes: {
        // This component gets the engine to display through a React prop.
        // We can use propTypes to indicate it is required
        engine: React.PropTypes.object.isRequired
    },

    areAlarmsActive(engine) {
        var active = false;
        for(var i in engine.alarms) {
            active |= engine.alarms[i].value;
        }
        return active;
    },

    getActiveAlarms(engine) {
        var alarms = [];
        for(var i in engine.alarms) {
            if(engine.alarms[i].value) {
                alarms.push(engine.alarms[i]);
            }
        }

        return alarms;
    },

    renderAlarms() {
        if(this.props.engine.online) {
            return <AlarmGroup key={this.props.engine._id} alarms={this.getActiveAlarms(this.props.engine)} engine={this.props.engine} />
        }        
    },

    renderGauges() {
        return <EngineGaugePanel key={this.props.engine._id} engine={this.props.engine} />        
    },

    renderControls() {
        return <EngineControls key={this.props.engine._id} engine={this.props.engine} />
    },

    render() {
        //  Critical data
        const engineName = this.props.engine.text;
        const online = this.props.engine.online;
        const alarmsActive = this.areAlarmsActive(this.props.engine);
        const alarms = this.getActiveAlarms(this.props.engine);
        const engineClassName = online ? (alarmsActive ? "panel panel-warning" : "panel panel-success") : "panel panel-default";

        return (
            <div className="row">
                <div className="col-md-12">              
                    <div className={engineClassName}>
                        <div className="panel-heading">
                            <div className="row">
                                <div className="col-md-6">
                                    <h2 className="panel-title"><strong>Engine {engineName}</strong></h2>
                                </div>
                                <div className="col-md-6" style={{textAlign: 'right'}}>
                                    {this.renderAlarms()}
                                </div>              
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-9">
                                    {this.renderGauges()}
                                </div>
                                <div className="col-md-3">
                                    {this.renderControls()}                   
                                </div>
                            </div>                                          
                        </div>
                    </div>
                </div>                
            </div>
        );
    }
});