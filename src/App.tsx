import * as React from 'react';

import './App.css';

import AlertBoxView from "./AlertBoxView";
import CompanyDetailView from "./CompanyDetailView";
import CompanyTreeView from "./CompanyTreeView";
import * as backend from "./http";
import {sampleData} from "./sample";
import {AlertType, IDict, IUnit, UnitID, UserLevel} from "./types";
import {getRandomInt} from "./util";


interface IAppState {
    units: IDict<IUnit>,
    selected: IUnit,
}

interface IAppProps {
    backend: string,
    userlevel: UserLevel
}

class App extends React.Component<IAppProps, IAppState> {
    public alertBox: AlertBoxView;

    public constructor(props: IAppProps) {
        super(props);

        this.state = {units: sampleData, selected: sampleData['-1']};

        this.selectUnit = this.selectUnit.bind(this);
        this.handleUnitCreate = this.handleUnitCreate.bind(this);
        this.handleUnitDelete = this.handleUnitDelete.bind(this);
    }

    public selectUnit(unit: IUnit, event: Event): void {
        this.setState({...this.state, selected: unit});
    }

    public componentDidMount() {
        this.fetchInitial();
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
                            userlevel={this.props.userlevel}
                            backend={this.props.backend}
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

    private async fetchInitial() {
        const dict = await backend.read(this.props.backend);

        console.log(dict);

        this.setState({
            selected: dict[-1],
            units: dict
        })
    }
}

export default App;
