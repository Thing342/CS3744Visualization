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

class CompanyAddForm extends React.Component<ICompanyAddFormProps, ICompanyAddFormState> {
    public constructor(props: ICompanyAddFormProps) {
        super(props);

        this.state = { formcontent: "", isvalid: false };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public handleChange(event: React.FormEvent<HTMLInputElement>) {
        if(event.target) {
            const val: string = event.currentTarget.value;
            this.setState({formcontent: val, isvalid: /\S/.test(val)})
        }
    }

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