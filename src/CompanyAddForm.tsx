import * as React from "react";

export interface ICompanyAddFormResult {
    companyName: string
}

export interface ICompanyAddFormState {
    formcontent: string,
    isvalid: boolean
}

export interface ICompanyAddFormProps {
    onSubmit: (result: ICompanyAddFormResult) => void
}

/**
 * Form component for adding a subunit.
 * @author Wes Jordan, Copyright 2018.
 *
 * State:
 *  - formcontent: string content of the input element
 *  - isvalid: true if the field is not empty
 * Props:
 *  - onSubmit: callback method triggered on submit, providing the form results.
 * Results:
 *  - companyName: the name of the company to add.
 */
class CompanyAddForm extends React.Component<ICompanyAddFormProps, ICompanyAddFormState> {
    public constructor(props: ICompanyAddFormProps) {
        super(props);

        this.state = { formcontent: "", isvalid: false };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Called when the text in the form field is changed
     * @param {React.FormEvent<HTMLInputElement>} event - Event object
     */
    public handleChange(event: React.FormEvent<HTMLInputElement>) {
        if(event.target) {
            const val: string = event.currentTarget.value;
            this.setState({formcontent: val, isvalid: /\S/.test(val)})
        }
    }

    /**
     * Called when the submit button is pressed, dispatches callback method
     * @param {React.FormEvent<HTMLFormElement>} event - Event object
     */
    public handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (this.state.isvalid) {
            const companyName = this.state.formcontent;
            this.props.onSubmit({companyName});
            this.setState({ formcontent: "", isvalid: false });
        } else {
            alert('Name field cannot be empty!');
        }
    }

    /**
     * Renders component
     */
    public render() {
        return (
            <form onSubmit={this.handleSubmit} className={'my-4'}>
                <label>
                    Name:
                    <input type="text" className={'form-control'} placeholder={'Company Name'}
                           value={this.state.formcontent} onChange={this.handleChange}  />
                </label>
                <input type="submit" className={'btn btn-primary'} value="Submit" />
            </form>
        );
    }
}

export default CompanyAddForm;