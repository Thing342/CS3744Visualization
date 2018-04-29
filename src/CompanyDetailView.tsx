import * as React from 'react';

import CompanyAddForm, {ICompanyAddFormResult} from "./CompanyAddForm";
import {IDict, IUnit, UnitID, UserLevel, USERLEVEL_EDITOR} from "./types";

export interface ICompanyDetailViewProps {
    unit: IUnit | null,
    units: IDict<IUnit>,
    onUnitCreate: (newunit: IUnit) => void
    onUnitDelete: (unitToDelete: IUnit) => void
    userlevel: UserLevel
    backend: string
}

class CompanyDetailView extends React.Component<ICompanyDetailViewProps, {}> {

    public constructor(props: ICompanyDetailViewProps) {
        super(props);

        this.onCompanyAdd = this.onCompanyAdd.bind(this);
        this.onCompanyDelete = this.onCompanyDelete.bind(this);
        this.subunitListItem = this.subunitListItem.bind(this);
    }

    public onCompanyAdd(res: ICompanyAddFormResult): void {
        if(this.props.unit) {
            const newcompany: IUnit = {
                id: -999,
                name: res.companyName,
                subunitIDs: [],
                unitParentID: this.props.unit.id
            };

            this.props.onUnitCreate(newcompany);
        }
    }

    public onCompanyDelete(id: UnitID): void {
        if(confirm("Really delete this unit?")) {
            this.props.onUnitDelete(this.props.units[id]);
        }
    }

    public subunitListItem(subunit: IUnit) {
        const onClick = () => this.onCompanyDelete(subunit.id);
        const button = (this.props.userlevel >= USERLEVEL_EDITOR) ? (
            <button type="button" className={'close'} aria-label="Close" onClick={onClick}>
                <span aria-hidden="true">&times;</span>
            </button>
        ) : (null) ;

        return (
            <li className={'list-group-item list-group-item-action'} key={subunit.id}>
                {subunit.name}
                {button}
            </li>
        )
    }

    public render() {
        const {unit, units} = this.props;

        if(unit) {
            const subunits = unit.subunitIDs.map(x => units[x]);
            const linkURL = this.props.backend + '/companies/' + unit.id;

            return (
                <div className={'px-4'} style={{maxHeight: '600px', overflow: 'auto'}}>
                    <h3>{unit.name}</h3>
                    <hr/>
                    <a href={linkURL} className="my-2 btn btn-primary">View company page</a>
                    <h4>Subunits:</h4>
                    <ul className={'list-unstyled'}>
                        {(subunits.length !== 0) ? subunits.map(this.subunitListItem) : <li>No subunits.</li>}
                    </ul>
                    <h4>Add Subunit:</h4>
                    {(this.props.userlevel >= USERLEVEL_EDITOR) ?
                        <CompanyAddForm onSubmit={this.onCompanyAdd}/>
                        : <i>Log in to edit units.</i>}
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