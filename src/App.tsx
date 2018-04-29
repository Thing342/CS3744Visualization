import * as React from 'react';

import './App.css';

import AlertBoxView from "./AlertBoxView";
import CompanyDetailView from "./CompanyDetailView";
import CompanyTreeView from "./CompanyTreeView";
import * as backend from "./http";
import {AlertType, IDict, IUnit, UnitID, UserLevel} from "./types";


interface IAppState {
    units: IDict<IUnit>,
    selected: IUnit | null,
}

interface IAppProps {
    backend: string,
    userlevel: UserLevel
}

class App extends React.Component<IAppProps, IAppState> {
    public alertBox: AlertBoxView;

    public constructor(props: IAppProps) {
        super(props);

        this.state = {units: {}, selected: null};

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

    public async handleUnitCreate(unit: IUnit) {
        /*
        unit.id = getRandomInt(10000);

        const newState = Object.assign({}, this.state);
        newState.units[unit.id] = unit;
        newState.units[superUnitId].subunitIDs.push(unit.id);

        this.setState(newState);
        */
        let dict: IDict<IUnit>;
        let id: UnitID;
        try {
            const res = await backend.create(this.props.backend, unit);
            dict = res.value;
            id = res.resourceID;
        } catch (error) {
            console.error(error);
            alert("Error during update fetch. Check dev console.");
            dict = this.state.units;
            id= -1;
        }

        console.log(dict);

        this.setState({
            selected: dict[id],
            units: dict
        });

        this.alertBox.pushAlert({
            level: AlertType.SUCCESS,
            linkText: "View Unit Page",
            linkURL: this.props.backend + '/companies/' + id,
            message: unit.name + " successfully created."
        })
    }

    public async handleUnitDelete(unit: IUnit) {
        /*
        const newState = Object.assign({}, this.state);
        const parentSubs = newState.units[unit.unitParentID].subunitIDs;

        newState.units[unit.unitParentID].subunitIDs = parentSubs.filter((x: UnitID) => x !== unit.id);
        delete newState.units[unit.id];

        console.log(newState);

        this.setState(newState);
        */

        let dict: IDict<IUnit>;
        try {
            const res = await backend.remove(this.props.backend, unit.id);
            dict = res.value;
        } catch (error) {
            console.error(error);
            alert("Error during update fetch. Check dev console.");
            dict = this.state.units;
        }

        console.log(dict);

        this.setState({
            selected: dict[-1],
            units: dict
        });

        this.alertBox.pushAlert({
            level: AlertType.SUCCESS,
            linkText: "Link",
            linkURL: "#",
            message: unit.name + " successfully deleted."
        })
    }

    private async fetchInitial() {
        let dict: IDict<IUnit>;
        try {
            dict = await backend.read(this.props.backend);
        } catch (error) {
            console.error(error);
            alert("Error during initial fetch. Check dev console.");
            dict = {};
        }

        console.log(dict);

        this.setState({
            selected: dict[-1],
            units: dict
        })
    }
}

export default App;
