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
    siblings: 0.3,
};

const textLayout = {
    textAnchor: "start",
    transform: "rotate(0 0,0)",
    x: 15,
    y: -10,
};

const shape = {
    shape: 'rect',
    shapeProps: {
        height: '20',
        rx: '5',
        ry: '5',
        width: '20',
        x: '-10',
        y: '-10',
    }
};

/**
 * Container for tree visualization of data.
 * Relies on 'react-d3-tree' package.
 * @author Wes Jordan, Copyright 2018.
 *
 * State:
 *  - translate: the initial location of the root point (default is 0,0)
 *  - treeSize: number of node sin the tree
 * Props:
 *  - units: global unit dictionary
 *  - rootID: ID of the root unit
 *  - onUnitClicked: callback method for when a node is clicked. Supplies a unit object and the HTML event.
 */
class CompanyTreeView extends React.Component<ICompanyTreeViewProps, ICompanyTreeViewState> {
    /**
     * Updates treeSize when props change
     */
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

    /**
     * Called when node is clicked. Dispatches onUnitClicked
     * @param {ITreeNode} node - the clicked node
     * @param {Event} event - HTML event
     */
    public onUnitClicked(node: ITreeNode, event: Event) {
        if (node) {
            const id: string = node.attributes.id;
            this.props.onUnitClicked(this.props.units[id], event);
        }
    }

    /**
     * Centres the tree on inital load.
     */
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

    /**
     * Only update the tree when the number of units changes or the translation updates
     * @param {ICompanyTreeViewProps} nextProps
     * @param {ICompanyTreeViewState} nextState
     * @return {boolean}true if the component should redraw
     */
    public shouldComponentUpdate(nextProps: ICompanyTreeViewProps, nextState: ICompanyTreeViewState): boolean {
        return (dictSize(nextProps.units) !== this.state.treeSize) || (nextState.translate !== this.state.translate)
    }

    /**
     * Renders the component
     */
    public render() {
        const data = [constructTree(this.props.units, this.props.rootID)];

        return (
            <div className="border rounded bg-light" style={containerStyles} ref={tc => (this.treeContainer = tc)}>
                <Tree data={data}
                      separation={sep}
                      translate={this.state.translate}
                      initialDepth={1}
                      zoom={0.75}
                      onClick={this.onUnitClicked}
                      textLayout={textLayout}
                      nodeSvgShape={shape}
                      depthFactor={factor}/>
            </div>
        )
    }
}

export default CompanyTreeView;