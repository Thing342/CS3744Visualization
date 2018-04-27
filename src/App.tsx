import * as React from 'react';

import './App.css';

import AlertBoxView from "./AlertBoxView";
import CompanyDetailView from "./CompanyDetailView";
import CompanyTreeView from "./CompanyTreeView";
import {sampleData} from "./sample";
import {AlertType, IDict, IUnit, UnitID} from "./types";
import {getRandomInt} from "./util";


interface IAppState {
    units: IDict<IUnit>,
    selected: IUnit,
}

class App extends React.Component<{}, IAppState> {
    public alertBox: AlertBoxView;

    public constructor(props: {}) {
        super(props);

        this.state = {units: sampleData, selected: sampleData['-1']};

        this.selectUnit = this.selectUnit.bind(this);
        this.handleUnitCreate = this.handleUnitCreate.bind(this);
        this.handleUnitDelete = this.handleUnitDelete.bind(this);
    }

    public selectUnit(unit: IUnit, event: Event): void {
        this.setState({...this.state, selected: unit});
    }

    public render() {
        return (
            <div>
                <AlertBoxView ref={(x) => (x) ? (this.alertBox = x) : x}/>
                <div className={'row'}>
                    <div className={'col col-12 col-md-8'}>
                        <CompanyTreeView units={this.state.units} rootID={-1} onUnitClicked={this.selectUnit}/>
                    </div>
                    <div className={'col col-12 col-md-4'}>
                        <CompanyDetailView
                            units={this.state.units}
                            unit={this.state.selected}
                            onUnitCreate={this.handleUnitCreate}
                            onUnitDelete={this.handleUnitDelete}
                        />
                    </div>
                </div>
            </div>
        );
    }

    public handleUnitCreate(unit: IUnit, superUnitId: UnitID) {
        // TODO: Replace with proper HTTP logic, until then ...

        unit.id = getRandomInt(10000);

        const newState = Object.assign({}, this.state);
        newState.units[unit.id] = unit;
        newState.units[superUnitId].subunitIDs.push(unit.id);

        this.setState(newState);

        this.alertBox.pushAlert({
            level: AlertType.SUCCESS,
            linkText: "View Unit Page",
            linkURL: "#",
            message: unit.name + " successfully created."
        })
    }

    public handleUnitDelete(unit: IUnit, superUnitId: UnitID) {
        // TODO: Replace with proper HTTP logic, until then ...

        const newState = Object.assign({}, this.state);
        const parentSubs = newState.units[superUnitId].subunitIDs;

        newState.units[superUnitId].subunitIDs = parentSubs.filter((x: UnitID) => x !== unit.id);
        delete newState.units[unit.id];

        console.log(newState);

        this.setState(newState);

        this.alertBox.pushAlert({
            level: AlertType.SUCCESS,
            linkText: "Link",
            linkURL: "#",
            message: unit.name + " successfully deleted."
        })
    }
}

export default App;
