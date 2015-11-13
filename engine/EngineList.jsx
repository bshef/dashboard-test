// EngineList component - represents the component containing all Engine subcomponents
EngineList = React.createClass({
    //  This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    //  Loads items from the Engines collection and puts them on this.data.engines
    getMeteorData() {
        return {
            engines: Engines.find({}).fetch()
        }
    },

    renderEngines() {
        return this.data.engines.map((engine) => {
            return <Engine key={engine._id} engine={engine} />;
        });
    },

    getRandomPercentInteger() {
        return Math.floor((Math.random() * 100) + 1);
    },

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        var text = React.findDOMNode(this.refs.textInput).value.trim();

        //  Initialize engine data
        var engineData = {
            text: text,
            online: true,
            fuel: this.getRandomPercentInteger(),
            fuelLowValue: 25,
            throttle: this.getRandomPercentInteger(),
            temperature: this.getRandomPercentInteger(),
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
            createdAt: new Date() // current time
        };

        //  Initalize alarm condition(s)
        engineData.alarms.fuelLow.value = engineData.fuel < engineData.fuelLowValue;
        engineData.alarms.temperatureHigh.value = engineData.temperature > engineData.temperatureHighValue;

        //  Add engine data to collection
        Engines.insert(engineData);

        // Clear form
        React.findDOMNode(this.refs.textInput).value = "";
    },

    render() {
        return (
            <div className="container" style={{width: '100%'}}>
                <div className="row">
                    <div className="col-md-8">
                        <h2>Engines</h2>
                    </div>
                    <div className="col-md-4">
                        <form className="new-engine" onSubmit={this.handleSubmit} >
                            <input
                                type="text"
                                ref="textInput"
                                placeholder="Type to add new engines"
                                style={{width: '100%'}} />
                        </form>
                    </div>
                </div>

                <div className="row">
                    
                </div>

                <div className="row">
                    {this.renderEngines()}
                </div>
            </div>
        );
    }
});