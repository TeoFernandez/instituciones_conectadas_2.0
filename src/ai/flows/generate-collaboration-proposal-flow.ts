'use server';
/**
 * @fileOverview An AI-powered tool that helps institutions identify synergies
 * and automatically drafts collaboration proposals based on the organization's focus.
 *
 * - generateCollaborationProposal - A function that generates a collaboration proposal.
 * - GenerateCollaborationProposalInput - The input type for the generateCollaborationProposal function.
 * - GenerateCollaborationProposalOutput - The return type for the generateCollaborationProposal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCollaborationProposalInputSchema = z.object({
  institutionName: z.string().describe("The name of the institution seeking collaboration."),
  institutionFocus: z.string().describe("A detailed description of the institution's primary focus, mission, and activities."),
  targetAudience: z.string().describe("The primary demographic or group the institution serves (e.g., 'children in underserved neighborhoods', 'youth interested in sports')."),
  desiredCollaborationType: z.string().optional().describe("Optional: The type of collaboration desired (e.g., 'event co-hosting', 'resource sharing', 'educational workshops')."),
});
export type GenerateCollaborationProposalInput = z.infer<typeof GenerateCollaborationProposalInputSchema>;

const GenerateCollaborationProposalOutputSchema = z.object({
  proposalTitle: z.string().describe("A catchy and professional title for the collaboration proposal."),
  introduction: z.string().describe("An introductory paragraph setting the stage for the proposed collaboration."),
  collaborationOpportunities: z.array(z.string()).describe("A list of specific, actionable ideas for collaboration with other network members."),
  mutualBenefits: z.string().describe("A paragraph explaining the mutual benefits for all parties involved in the collaboration."),
  nextSteps: z.array(z.string()).describe("Suggested next steps to move the collaboration forward."),
});
export type GenerateCollaborationProposalOutput = z.infer<typeof GenerateCollaborationProposalOutputSchema>;

export async function generateCollaborationProposal(input: GenerateCollaborationProposalInput): Promise<GenerateCollaborationProposalOutput> {
  return generateCollaborationProposalFlow(input);
}

const proposalPrompt = ai.definePrompt({
  name: 'generateCollaborationProposalPrompt',
  input: { schema: GenerateCollaborationProposalInputSchema },
  output: { schema: GenerateCollaborationProposalOutputSchema },
  prompt: `You are an AI assistant specialized in drafting collaboration proposals for community organizations.
Your goal is to help '${'{{{institutionName}}}'}' identify potential synergies with other network members and create a compelling draft proposal.

Institution Name: {{{institutionName}}}
Institution Focus: {{{institutionFocus}}}
Target Audience: {{{targetAudience}}}
{{#if desiredCollaborationType}}Desired Collaboration Type: {{{desiredCollaborationType}}}{{/if}}

Based on the above information, generate a collaboration proposal that includes:
1. A professional and engaging 'proposalTitle'.
2. A concise 'introduction' to the collaboration.
3. A list of specific 'collaborationOpportunities' that leverage the institution's focus and target audience, considering general community needs and common activities among network members (e.g., local sports clubs, churches, community centers).
4. A 'mutualBenefits' section explaining how the collaboration would be advantageous for all participating organizations and the community.
5. A list of clear 'nextSteps' for initiating and developing the partnership.

Ensure the tone is collaborative, optimistic, and focused on community impact, particularly for children and youth, aligning with the values of organizations like polideportivos, churches, and social organizations in a neighborhood context.`,
});

const generateCollaborationProposalFlow = ai.defineFlow(
  {
    name: 'generateCollaborationProposalFlow',
    inputSchema: GenerateCollaborationProposalInputSchema,
    outputSchema: GenerateCollaborationProposalOutputSchema,
  },
  async (input) => {
    const { output } = await proposalPrompt(input);
    return output!;
  }
);
