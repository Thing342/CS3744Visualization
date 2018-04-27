import * as React from 'react';

import CompanyAddForm, {ICompanyAddFormResult} from "./CompanyAddForm";
import {IDict, IUnit, UnitID} from "./types";

export interface ICompanyDetailViewProps {
    unit: IUnit,
    units: IDict<IUnit>,
    onUnitCreate: (newunit: IUnit, superunitId: UnitID) => void
}

function subunitListItem(subunit: IUnit) {
    return (
        <li key={subunit.id}>{subunit.name}</li>
    )
}

function CompanyDetailView({unit, units, onUnitCreate}: ICompanyDetailViewProps) {
    function onCompanyAdd(res: ICompanyAddFormResult) {
        const newcompany: IUnit = {
            id: -999,
            name: res.companyName,
            subunitIDs: []
        };

        onUnitCreate(newcompany, unit.id);
    }

    const subunits = unit.subunitIDs.map(x => units[x]);

    if(unit) {
        return (
            <div>
                <h3 className="display-4">{unit.name}</h3>
                <hr/>
                <h6>Subunits:</h6>
                <ul>
                    {subunits.map(subunitListItem)}
                </ul>
                <h6>Add Subunit:</h6>
                <CompanyAddForm onSubmit={onCompanyAdd}/>
                <a href="#" className="btn btn-primary">View company page</a>
            </div>
        )
    } else {
        return (
            <span>Loading...</span>
        )
    }
}

export default CompanyDetailView;