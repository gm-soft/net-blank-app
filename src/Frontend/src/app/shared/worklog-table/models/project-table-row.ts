import { TableCell } from './table-cell';
import Assertion from '@shared/validation/assertion';
import { Project } from '@models/project';
import { ITableRow } from '../interfaces/i-table-row';
import { MinutesValue } from '@shared/value-objects';

export class ProjectTableRow implements ITableRow {
  readonly cellTitle: string;
  readonly totalCells: MinutesValue;

  constructor(
    public readonly title: string,
    public readonly cells: Array<TableCell>,
    private readonly project: Project
  ) {
    Assertion.notNull(title, 'title');
    Assertion.notNullOrEmpty(cells, 'cells');
    Assertion.notNull(project, 'project');

    this.cellTitle = `Project '${this.project.fullName}'`;
    this.totalCells = new MinutesValue(
      this.cells.map(x => x.minutes).reduce((a, b) => a + b, 0),
      true
    );
  }
}
