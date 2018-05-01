import * as React from "react";
import {dictMap, IAlert, IDict} from "./types";
import {getRandomInt} from "./util";

export interface IAlertBoxViewState  {
    undismissed: IDict<IAlert>
}

/**
 * Displays a dismissible list of IAlerts.
 * @author Wes Jordan, Copyright 2018.
 *
 * Props:
 *  - none
 * State:
 *  - undismissed: The alerts collection; a dictionary mapping a unique but arbitrary ID to an IAlert.
 */
class AlertBoxView extends React.Component<{}, IAlertBoxViewState> {
    public constructor(props: {}) {
        super(props);

        this.state = {undismissed: []};

        this.renderAlert = this.renderAlert.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    /**
     * Handle dismiss button press by closing affected event
     * @param {number} key - The ID of the button to close
     */
    public onDismiss(key: number) {
        const newState = {...this.state};
        delete newState.undismissed[key];

        this.setState(newState);
    }

    /**
     * Push a new IAlert into the alerts queue. Assigns the alert an arbitrary ID and updates state.
     * @param {IAlert} alert - The IAlert to push.
     */
    public pushAlert(alert: IAlert) {
        const newKey = getRandomInt(10000); // Assign ID
        const undismissed = {...this.state.undismissed};
        undismissed[newKey] = alert;

        this.setState({undismissed});
    }

    /**
     * Renders the component.
     * @return JSX
     */
    public render() {
        return (
            <div className={'mb-4'}>
                {dictMap(this.state.undismissed, this.renderAlert)}
            </div>
        )
    }

    /**
     * Render a single alert.
     * @param {number} key - the key for the alert
     * @param {IAlert} alert - the alert to render
     * @returns {any} - JSX
     */
    public renderAlert(key: number, alert: IAlert) {
        const classname = "alert alert-dismissable " + alert.level;
        const dismiss = () => this.onDismiss(key);

        let links = null;
        if(alert.linkText && alert.linkURL) {
            links = (
                <p className="mb-0"><a className={'alert-link'} href={alert.linkURL}>{alert.linkText}</a></p>
            )
        } else if (alert.linkText) {
            links = (
                <p className="mb-0">{alert.linkText}</p>
            )
        }

        return (
            <div className={classname} role={'alert'} key={key}>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={dismiss}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <p>{alert.message}</p>
                {(links) ? <hr/> : null}
                {links}
            </div>
        )
    }
}

export default AlertBoxView
