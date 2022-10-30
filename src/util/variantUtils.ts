import {
    getProteinPositionFromProteinChange,
    Mutation,
} from 'cbioportal-utils';
import { VariantAnnotationSummary } from 'genome-nexus-ts-api-client';
import { RevisedProteinEffectRecord } from '../component/variantPage/biologicalFunction/ReVUE';
import { getTranscriptConsequenceSummary } from './AnnotationSummaryUtil';

export function variantToMutation(
    data: VariantAnnotationSummary | undefined,
    revisedProteinEffectRecord?: RevisedProteinEffectRecord | undefined,
    transcript?: string
): Mutation[] {
    let mutations = [];
    let mutation: Mutation;
    const transcriptConsequence = getTranscriptConsequenceSummary(
        data,
        transcript
    );
    if (data && transcriptConsequence) {
        mutation = {
            gene: {
                hugoGeneSymbol: transcriptConsequence.hugoGeneSymbol,
                entrezGeneId: Number(transcriptConsequence.entrezGeneId),
            },
            chromosome: data.genomicLocation.chromosome,
            startPosition: data.genomicLocation.start,
            endPosition: data.genomicLocation.end,
            referenceAllele: data.genomicLocation.referenceAllele,
            variantAllele: data.genomicLocation.variantAllele,
            proteinChange:
                revisedProteinEffectRecord?.revisedProteinEffect ||
                transcriptConsequence.hgvspShort,
            proteinPosStart: transcriptConsequence.proteinPosition?.start
                ? transcriptConsequence.proteinPosition.start
                : getProteinPosStart(transcriptConsequence.hgvspShort),
            proteinPosEnd: transcriptConsequence.proteinPosition
                ? transcriptConsequence.proteinPosition.end
                : undefined,
            mutationType: transcriptConsequence.variantClassification,
        };
        mutations.push(mutation);
    }
    return mutations;
}

export function getProteinPosStart(proteinChange: string | undefined) {
    const proteinPosition = getProteinPositionFromProteinChange(proteinChange);
    return proteinPosition ? proteinPosition.start : -1;
}

export function variantToGenomicLocationString(
    data: VariantAnnotationSummary | undefined
) {
    const genomicLocation = data?.genomicLocation;
    return genomicLocation
        ? `${genomicLocation.chromosome},${genomicLocation.start},${genomicLocation.end},${genomicLocation.referenceAllele},${genomicLocation.variantAllele}`
        : '';
}
