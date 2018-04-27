import * as React from 'react';
import Tree from 'react-d3-tree';

import {constructTree, dictSize, IDict, ITreeNode, IUnit, UnitID} from "./types";

export interface ICompanyTreeViewProps {
    units: IDict<IUnit>,
    rootID: UnitID,
    onUnitClicked: (node: IUnit, event: Event) => void;
}

export interface ICompanyTreeViewState {
    translate: { x: number, y: number };
    treeSize: number
}

const containerStyles = {
    height: '600px',
    width: '100%',
};

const factor = 225;

const sep = {
    nonSiblings: 0.4,
    siblings: 0.25,
};

class CompanyTreeView extends React.Component<ICompanyTreeViewProps, ICompanyTreeViewState> {
    public static getDerivedStateFromProps(nextProps: ICompanyTreeViewProps, prevState: ICompanyTreeViewState): ICompanyTreeViewState {
        return {
            ...prevState,
            treeSize: dictSize(nextProps.units)
        }
    }


    private treeContainer: HTMLDivElement | null;

    public constructor(props: ICompanyTreeViewProps) {
        super(props);
        this.state = {translate: {x: 0, y: 0}, treeSize: dictSize(props.units)};

        this.onUnitClicked = this.onUnitClicked.bind(this);
    }

    public onUnitClicked(node: ITreeNode, event: Event) {
        if (node) {
            const id: string = node.attributes.id;
            this.props.onUnitClicked(this.props.units[id], event);
        }
    }

    public componentDidMount() {
        if (this.treeContainer) {
            const dimensions = this.treeContainer.getBoundingClientRect();

            this.setState({
                ...this.state,
                translate: {
                    x: 100,
                    y: (dimensions.height + factor) / 2
                },
            })
        }
    }

    public shouldComponentUpdate(nextProps: ICompanyTreeViewProps, nextState: ICompanyTreeViewState): boolean {
        return (dictSize(nextProps.units) !== this.state.treeSize) || (nextState.translate !== this.state.translate)
    }

    public render() {
        const data = [constructTree(this.props.units, this.props.rootID)];

        return (
            <div className="border rounded" style={containerStyles} ref={tc => (this.treeContainer = tc)}>
                <Tree data={data}
                      separation={sep}
                      translate={this.state.translate}
                      initialDepth={1}
                      zoom={0.75}
                      onClick={this.onUnitClicked}
                      depthFactor={factor}/>
            </div>
        )
    }
}

export default CompanyTreeView;