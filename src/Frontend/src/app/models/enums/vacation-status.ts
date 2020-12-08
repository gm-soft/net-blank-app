export enum VacationStatus {
  Undefined = 0,

  /** The vacation was just created by an author. */
  Draft = 1,

  /** Awaiting for reviewers decision. */
  Awaiting = 2,

  /** Approved by reviewers. */
  Approved = 3,

  /** Declined by reviewers. */
  Declined = 4,

  /** Closed by Author/requester of the vacation. */
  Closed = 5
}
