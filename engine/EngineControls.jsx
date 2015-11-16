EngineControls = React.createClass({
    propTypes: {
        // This component gets the engine to display through a React prop.
        // We can use propTypes to indicate it is required
        engine: React.PropTypes.object.isRequired
    },

    startupEngine() {
        Meteor.call('startupEngine', this.props.engine);
    },

    shutdownEngine() {
        Meteor.call('shutdownEngine', this.props.engine);
    },

    deleteThisEngine() {
        Meteor.call('deleteEngine', this.props.engine._id);
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
