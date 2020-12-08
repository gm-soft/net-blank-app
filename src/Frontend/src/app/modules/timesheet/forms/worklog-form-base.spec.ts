import { WorklogFormBase } from './worklog-form-base';
import { FormControl } from '@angular/forms';

class WorklogFormMock extends WorklogFormBase {
  constructor(
    private readonly projectIdInternal: number | null,
    private readonly nonProjectActivityIdInternal: number | null
  ) {
    super({
      title: new FormControl('Ololo'),
      dateOfWork: new FormControl(new Date(Date.now()))
    });
  }

  protected projectId(): number | null {
    return this.projectIdInternal;
  }

  protected title(): string {
    return 'ololo';
  }

  protected minutes(): number {
    return 120;
  }

  protected nonProjectActivityId(): number | null {
    return this.nonProjectActivityIdInternal;
  }

  protected dateOfWork(): Date {
    return new Date(Date.now());
  }
}

describe('SpentTimeForm', () => {
  it('.record() should throw error if projectId and nonProjectActivityId are null', () => {
    expect(() => new WorklogFormMock(null, null).record()).toThrow();
  });

  it('.record() should throw error if projectId and nonProjectActivityId are not null', () => {
    expect(() => new WorklogFormMock(1, 1).record()).toThrow();
  });

  it('.record() should not throw error if projectId is null and nonProjectActivityId is not null', () => {
    const result = new WorklogFormMock(null, 1).record();
    expect(result.projectId).toBe(null);
    expect(result.nonProjectActivityId).toBe(1);
  });

  it('.record() should not throw error if projectId is not null and nonProjectActivityId is null', () => {
    const result = new WorklogFormMock(1, null).record();
    expect(result.nonProjectActivityId).toBe(null);
    expect(result.projectId).toBe(1);
  });
});
