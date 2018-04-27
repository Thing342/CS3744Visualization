import * as React from 'react';

import CompanyAddForm, {ICompanyAddFormResult} from "./CompanyAddForm";
import {IDict, IUnit, UnitID} from "./types";

export interface ICompanyDetailViewProps {
    unit: IUnit,
    units: IDict<IUnit>,
    onUnitCreate: (newunit: IUnit, superunitId: UnitID) => void
    onUnitDelete: (unitToDelete: IUnit, superUnitID: UnitID) => void
}

class CompanyDetailView extends React.Component<ICompanyDetailViewProps, {}> {

    public constructor(props: ICompanyDetailViewProps) {
        super(props);

        this.onCompanyAdd = this.onCompanyAdd.bind(this);
        this.onCompanyDelete = this.onCompanyDelete.bind(this);
        this.subunitListItem = this.subunitListItem.bind(this);
    }

    public onCompanyAdd(res: ICompanyAddFormResult): void {
        const newcompany: IUnit = {
            id: -999,
            name: res.companyName,
            subunitIDs: []
        };

        this.props.onUnitCreate(newcompany, this.props.unit.id);
    }

    public onCompanyDelete(id: UnitID): void {
        if(confirm("Really delete this unit?")) {
            this.props.onUnitDelete(this.props.units[id], this.props.unit.id);
        }
    }

    public subunitListItem(subunit: IUnit) {
        const onClick = () => this.onCompanyDelete(subunit.id);
        return (
            <li className={'list-group-item list-group-item-action'} key={subunit.id}>
                {subunit.name}
                <button type="button" className={'close'} aria-label="Close" onClick={onClick}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </li>
        )
    }

    public render() {
        const {unit, units} = this.props;

        const subunits = unit.subunitIDs.map(x => units[x]);

        if(unit) {
            return (
                <div className={'px-4'} style={{maxHeight: '600px', overflow: 'auto'}}>
                    <h3>{unit.name}</h3>
                    <hr/>
                    <a href="#" className="my-2 btn btn-primary">View company page</a>
                    <h4>Subunits:</h4>
                    <ul className={'list-unstyled'}>
                        {subunits.map(this.subunitListItem)}
                    </ul>
                    <h4>Add Subunit:</h4>
                    <CompanyAddForm onSubmit={this.onCompanyAdd}/>
                </div>
            )
        } else {
            return (
                <span>Loading...</span>
            )
        }
    }
}

export default CompanyDetailView;