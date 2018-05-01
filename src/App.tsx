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

/**
 * Top-level application component for managing layout and internal state.
 * @author Wes Jordan, Copyright 2018.
 *
 * State:
 *  - units: Dictionary mapping unit ID to unit objects
 *  - selected: The currently displayed IUnit.
 * Props:
 *  - backend: String pointing to the API backend
 *  - userlevel: The current user's level
 */
class App extends React.Component<IAppProps, IAppState> {
    public alertBox: AlertBoxView;

    public constructor(props: IAppProps) {
        super(props);

        this.state = {units: {}, selected: null};

        // Bind functions b/c JS is dumb
        this.selectUnit = this.selectUnit.bind(this);
        this.handleUnitCreate = this.handleUnitCreate.bind(this);
        this.handleUnitDelete = this.handleUnitDelete.bind(this);
    }

    /**
     * Handles the CompanyTreeView's onUnitClicked event
     * @param {IUnit} unit - the unit selected
     * @param {Event} event - the event object
     */
    public selectUnit(unit: IUnit, event: Event): void {
        this.setState({...this.state, selected: unit});
    }

    /**
     * Runs initial fetch when component is mounted
     */
    public componentDidMount() {
        this.fetchInitial();
    }

    /**
     * Renders component
     */
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

    /**
     * Asynchronous method to handle adding a unit
     * @param {IUnit} unit - Unit object to upload to server
     */
    public async handleUnitCreate(unit: IUnit) {
        // try http request
        let dict: IDict<IUnit>;
        let id: UnitID;
        try {
            const res = await backend.create(this.props.backend, unit);
            dict = res.value;
            id = res.resourceID;
        } catch (error) {
            console.error(error);
            alert("Error during update fetch. Check dev console.");
            dict = this.state.units; // fall back to old state on failure
            id= -1;
        }

        console.log(dict);

        // update with new state and push new alert
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

    /**
     * Asynchronous method to handle deleting a unit
     * @param {IUnit} unit - Unit object to delete from server
     */
    public async handleUnitDelete(unit: IUnit) {
        // try http request
        let dict: IDict<IUnit>;
        try {
            const res = await backend.remove(this.props.backend, unit.id);
            dict = res.value;
        } catch (error) {
            console.error(error);
            alert("Error during update fetch. Check dev console.");
            dict = this.state.units; // fall back to old state on failure
        }

        console.log(dict);

        // update with new state and push new alert
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

    /**
     * Asynchronous method to run initial data fetch
     */
    private async fetchInitial() {
        // try http request
        let dict: IDict<IUnit>;
        try {
            dict = await backend.read(this.props.backend);
        } catch (error) {
            console.error(error);
            alert("Error during initial fetch. Check dev console.");
            dict = {};
        }

        console.log(dict);

        // Update with new state
        this.setState({
            selected: dict[-1],
            units: dict
        })
    }
}

export default App;
