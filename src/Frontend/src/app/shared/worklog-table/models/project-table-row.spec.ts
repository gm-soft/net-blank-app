import { ProjectTableRow } from './project-table-row';
import { Project } from '@models/project';
import { TableCell } from './table-cell';
import { TimeRecordsCollection } from './time-records-collection';

describe('ProjectTableRow', () => {
  const target = (title: string, project: Project): ProjectTableRow => {
    return new ProjectTableRow(title, [new TableCell(new Date(), new TimeRecordsCollection([]), false)], project);
  };

  it('should fail if null as title was passed', () => {
    expect(
      () => new ProjectTableRow(null, [new TableCell(new Date(), new TimeRecordsCollection([]), false)], new Project())
    ).toThrow();
  });

  it('should fail if null as cells was passed', () => {
    expect(() => new ProjectTableRow('Title', null, new Project())).toThrow();
  });

  it('should fail if empty array as cells was passed', () => {
    expect(() => new ProjectTableRow('Title', [], new Project())).toThrow();
  });

  it('.cellTitle should return title with project mention if project instance was passed', () => {
    expect(target('2020-04-22', new Project({ fullName: 'TCO MRF' })).cellTitle).toEqual(`Project 'TCO MRF'`);
  });
});
