import * as React from "react";

export interface ICompanyAddFormResult {
    companyName: string
}

export interface ICompanyAddFormState {
    formcontent: string
}

export interface ICompanyAddFormProps {
    onSubmit: (result: ICompanyAddFormResult) => void
}

class CompanyAddForm extends React.Component<ICompanyAddFormProps, ICompanyAddFormState> {
    public constructor(props: ICompanyAddFormProps) {
        super(props);

        this.state = { formcontent: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public handleChange(event: React.FormEvent<HTMLInputElement>) {
        if(event.target) {
            this.setState({formcontent: event.currentTarget.value})
        }
    }

    public handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const companyName = this.state.formcontent;

        this.props.onSubmit({companyName});
    }

    public render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" className={'form-control'} placeholder={'Company Name'}
                           value={this.state.formcontent} onChange={this.handleChange} />
                </label>
                <input type="submit" className={'btn btn-primary'} value="Submit" />
            </form>
        );
    }
}

export default CompanyAddForm;