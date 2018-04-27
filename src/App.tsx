import * as React from 'react';

import './App.css';

import CompanyDetailView from "./CompanyDetailView";
import CompanyTreeView from "./CompanyTreeView";
import {sampleData} from "./sample";
import {IDict, IUnit, UnitID} from "./types";
import {getRandomInt} from "./util";



interface IAppState {
    units: IDict<IUnit>,
    selected: IUnit
}

class App extends React.Component<{}, IAppState> {
    public state: IAppState;

    public constructor(props: {}) {
        super(props);

        this.state = {units: sampleData, selected: sampleData['-1']};

        this.selectUnit = this.selectUnit.bind(this);
        this.handleUnitCreate = this.handleUnitCreate.bind(this);
    }

    public selectUnit(unit: IUnit, event: Event) : void {
        this.setState({...this.state, selected: unit});
    }

    public render() {
        return (
            <div className={'row'}>
                <div className={'col col-12 col-md-8'}>
                    <CompanyTreeView units={this.state.units} rootID={-1} onUnitClicked={this.selectUnit}/>
                </div>
                <div className={'col col-12 col-md-4'}>
                    <CompanyDetailView units={this.state.units} unit={this.state.selected} onUnitCreate={this.handleUnitCreate}/>
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
    }
}

export default App;
