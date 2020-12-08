import { JobItem } from './job-item';
import { Observable, of } from 'rxjs';
import { JobResult } from '@models/job-result';

describe('JobItem', () => {
  const observableAction = () => of(new JobResult());
  const emptyString = '';

  const caught = (title: string = null, hint: string = null, action: () => Observable<JobResult> = null): boolean => {
    try {
      const target = new JobItem(title, hint, action);
      return true;
    } catch (e) {
      return false;
    }
  };

  it('should throw error when title is null', () => {
    expect(caught(emptyString, emptyString, observableAction)).toBe(true);

    expect(caught(null, emptyString, observableAction)).toBe(false);
    expect(caught(emptyString, null, observableAction)).toBe(false);
    expect(caught(emptyString, emptyString, null)).toBe(false);
    expect(caught(null, null, null)).toBe(false);
  });
});
