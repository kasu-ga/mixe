export type ErrorIssues = Record<string, string[]>;

export class MixeError extends Error {
  readonly issues?: ErrorIssues;

  constructor(message: string, issues?: ErrorIssues) {
    super(message);
    this.issues = issues;
  }
}
