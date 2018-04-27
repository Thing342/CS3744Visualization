import * as React from "react";
import {dictMap, IAlert, IDict} from "./types";
import {getRandomInt} from "./util";

export interface IAlertBoxViewState  {
    undismissed: IDict<IAlert>
}

class AlertBoxView extends React.Component<{}, IAlertBoxViewState> {
    public constructor(props: {}) {
        super(props);

        this.state = {undismissed: []};

        this.renderAlert = this.renderAlert.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    public onDismiss(key: number) {
        const newState = {...this.state};
        delete newState.undismissed[key];

        this.setState(newState);
    }

    public pushAlert(alert: IAlert) {
        const newKey = getRandomInt(10000);
        const undismissed = {...this.state.undismissed};
        undismissed[newKey] = alert;

        this.setState({undismissed});
    }

    public render() {
        return (
            <div className={'mb-4'}>
                {dictMap(this.state.undismissed, this.renderAlert)}
            </div>
        )
    }

    public renderAlert(key: number, alert: IAlert) {
        const classname = "alert alert-dismissable " + alert.level;
        const dismiss = () => this.onDismiss(key);

        return (
            <div className={classname} role={'alert'} key={key}>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={dismiss}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <p>{alert.message}</p>
                <hr/>
                <p className="mb-0"><a className={'alert-link'} href={alert.linkURL}>{alert.linkText}</a></p>
            </div>
        )
    }
}

export default AlertBoxView
