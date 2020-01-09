import * as React from 'react';
import classNames from 'classnames';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import { Table } from 'react-bootstrap';

import tooltipStyles from './styles/siftTooltip.module.scss';
import functionalImpactColor from './styles/functionalImpactTooltip.module.scss';
import functionalGroupsStyle from '../functionalGroups.module.scss';

// Most of this component comes from cBioPortal-frontend

export interface ISiftProps {
    siftPrediction: string; // deleterious, deleterious_low_confidence, tolerated, tolerated_low_confidence
    siftScore: number;
}

export default class Sift extends React.Component<ISiftProps, {}> {
    static SIFT_URL: string = 'http://sift.bii.a-star.edu.sg/';

    constructor(props: ISiftProps) {
        super(props);
        this.siftData = this.siftData.bind(this);
    }

    public static siftText() {
        return (
            <div style={{ width: 450, height: 88 }}>
                <a
                    href={Sift.SIFT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    SIFT
                </a>{' '}
                predicts whether an amino acid substitution affects protein
                function based on sequence homology and the physical properties
                of amino acids. SIFT can be applied to naturally occurring
                nonsynonymous polymorphisms and laboratory-induced missense
                mutations.
            </div>
        );
    }

    public siftData() {
        const impact = this.props.siftPrediction ? (
            <div>
                <table className={tooltipStyles['sift-tooltip-table']}>
                    {(this.props.siftScore || this.props.siftScore === 0) && (
                        <tbody>
                            <tr>
                                <td>Score</td>
                                <td>
                                    <b>{this.props.siftScore.toFixed(2)}</b>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
                <span>
                    Please refer to the score range{' '}
                    <a
                        href="https://useast.ensembl.org/info/genome/variation/prediction/protein_function.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        here
                    </a>
                    .
                </span>
            </div>
        ) : null;

        return (
            <div>
                {impact}
                <br />
            </div>
        );
    }

    public siftTooltip(tooltipTrigger: JSX.Element) {
        return (
            <DefaultTooltip
                placement="top"
                overlay={
                    <div>
                        {Sift.siftText()}
                        {this.siftData()}
                        {Sift.siftTooltipTable()}
                    </div>
                }
            >
                {tooltipTrigger}
            </DefaultTooltip>
        );
    }

    public static siftTooltipTable() {
        return (
            <div>
                <Table table-border-top striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Legend</th>
                            <th>
                                <span
                                    style={{ display: 'inline-block' }}
                                    title="SIFT"
                                >
                                    <img
                                        height={14}
                                        src={require('./styles/siftFunnel.png')}
                                        alt="SIFT"
                                    />
                                    &nbsp;Qualitative prediction
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>
                                    <i
                                        className={classNames(
                                            functionalImpactColor['high'],
                                            'fa fa-circle'
                                        )}
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            </td>
                            <td>
                                <b>deleterious</b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>
                                    <i
                                        className={classNames(
                                            functionalImpactColor['low'],
                                            'fa fa-circle'
                                        )}
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            </td>
                            <td>
                                <b>deleterious_low_confidence</b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>
                                    <i
                                        className={classNames(
                                            functionalImpactColor['neutral'],
                                            'fa fa-circle'
                                        )}
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            </td>
                            <td>
                                <b>tolerated_low_confidence</b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>
                                    <i
                                        className={classNames(
                                            functionalImpactColor['neutral'],
                                            'fa fa-circle'
                                        )}
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            </td>
                            <td>
                                <b>tolerated</b>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    public render() {
        let siftContent: JSX.Element = <span />;
        const dataSource = (
            <span>
                SIFT&nbsp;<i className="fas fa-external-link-alt"></i>
            </span>
        );

        if (this.props.siftPrediction && this.props.siftPrediction.length > 0) {
            siftContent = <span>{this.props.siftPrediction}</span>;
        } else {
            siftContent = <span>N/A</span>;
        }

        return (
            <span className={functionalGroupsStyle['functional-group']}>
                <div className={functionalGroupsStyle['data-source']}>
                    <a
                        href={Sift.SIFT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {this.siftTooltip(
                            <a
                                href={Sift.SIFT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {dataSource}
                            </a>
                        )}
                    </a>
                </div>
                <div>
                    {this.siftTooltip(
                        <span className={functionalGroupsStyle['data-with-link']}>
                            <a
                                href={Sift.SIFT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {siftContent}
                            </a>
                        </span>
                    )}
                </div>
            </span>
        );
    }
}
