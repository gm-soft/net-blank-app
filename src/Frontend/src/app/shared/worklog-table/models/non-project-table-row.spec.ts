import { NonProjectTableRow } from './non-project-table-row';
import { TableCell } from './table-cell';
import { TimeRecordsCollection } from './time-records-collection';

describe('ProjectTableRow', () => {
  const target = (title: string): NonProjectTableRow => {
    return new NonProjectTableRow(title, [new TableCell(new Date(), new TimeRecordsCollection([]), false)]);
  };

  it('should fail if null as title was passed', () => {
    expect(
      () => new NonProjectTableRow(null, [new TableCell(new Date(), new TimeRecordsCollection([]), false)])
    ).toThrow();
  });

  it('should fail if null as cells was passed', () => {
    expect(() => new NonProjectTableRow('Title', null)).toThrow();
  });

  it('should fail if empty array as cells was passed', () => {
    expect(() => new NonProjectTableRow('Title', [])).toThrow();
  });

  it('.cellTitle should return title without project mention if project instance was not passed', () => {
    expect(target('2020-04-22').cellTitle).toBe('Non-project activity');
  });
});
