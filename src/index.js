import React from 'react';
import ReactDOM from 'react-dom';
import { Alert,
    Button,
    Col,
    Container,
    Form,
    Row,
    Table,
 } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';


class ValidatorForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            checks: null
        };

        this.updateFile = this.updateFile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateFile(newFile) {
        this.setState({selectedFile: newFile, checks: null });
    }

    handleSubmit(event) {

        // Build and send request
        let data = new FormData();
        data.append('file', this.state.selectedFile);
        fetch('http://localhost:8080/validate', { method: 'POST', body: data })
            .then(response => response.json())
            .then(data => {
                this.setState({selectedFile: this.state.selectedFile, checks: data.checks});
            });
    }

    render() {
        return (
            <Container>
                <h1>FSKX Validator</h1>
                
                <Row className="mb-3">
                    <Col>
                        <Form>
                            <FileSelect updateForm={this.updateFile} />
                        </Form>
                    </Col>
                    <Col>
                        <Button
                            variant="primary"
                            onClick={this.handleSubmit}>Validate</Button>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <ResultsTable checks={this.state.checks} />
                </Row>
                
            </Container>
        )
    }
}

class FileSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let files = event.target.files;
        if (files.length === 1) {
            this.setState({selectedFile: files[0].name}); // Update state
            this.props.updateForm(files[0]);
        }
    }

    render() {
        return (
            <Form.File
                id="modelFileInput"
                label={this.state.selectedFile }
                placeholder="Select an FSKX file to validate"
                custom
                onChange={this.handleChange}>
            </Form.File>
        );
    }
}

class ResultsTable extends React.Component {

    render() {
        console.log(this.props.checks);

        let combineArchiveError;
        let structureError;
        let codeError;

        if (this.props && this.props.checks) {
            if (this.props.checks[0]) combineArchiveError = this.props.checks[0].error;
            if (this.props.checks[1]) structureError = this.props.checks[1].error;
            if (this.props.checks[2]) codeError = this.props.checks[2].error;
        }

        return (
            <Table className="table-bordered">
            <thead>
                <tr>
                    <th>Check</th>
                    <th>Results</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">CombineArchive check</th>
                    <CheckCell error={combineArchiveError} />
                </tr>
                <tr>
                    <th scope="row">Structure check</th>
                    <CheckCell error={structureError} />
                </tr>
                <tr>
                    <th scope="row">Code check</th>
                    <CheckCell error={codeError} />
                </tr>
            </tbody>
            </Table>
        );
    }
}

class CheckCell extends React.Component {

    render() {
        return (
            <td>
                {this.props.error &&
                    <Alert variant='danger'>
                        {this.props.error}
                    </Alert>
                }
            </td>
        );
    }
}

ReactDOM.render(
    <ValidatorForm />,
    document.getElementById('root')
);
