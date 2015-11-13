AlarmGroup = React.createClass({
	render() {
		var engineId = this.props.engine._id;
		return (
			<div className="btn-group">
				{this.props.alarms.map(function(alarm) {
					return <AlarmItem key={alarm.name} alarm={alarm} engineId={engineId} />
				})}
			</div>
		);
	}
});