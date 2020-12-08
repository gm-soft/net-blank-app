import { ApplicationUser } from '@models/application-user';
import { ProjectRole } from '@models/enums';
import { Participant } from '@models/participant';
import { Percents } from '@shared/constants/percents';
import { ProjectParticipantViewModel } from './project-participant-view-model';

describe('ProjectParticipantViewModel', () => {
  const user = new ApplicationUser();
  const employee = new Participant();
  employee.employeeId = 1;
  employee.employee = user;
  employee.utilization = Percents.Hundred;
  employee.projectRole = ProjectRole.Executor;

  it('should return false if to date is larger than from date', () => {
    employee.to = new Date('05/25/2020');
    employee.from = new Date('05/04/2020');

    const target = new ProjectParticipantViewModel(employee);
    const result = target.checkDate();
    expect(result).toBeFalsy();
  });

  it('should return false if to date is smaller than from date', () => {
    employee.to = new Date('05/03/2020');
    employee.from = new Date('05/24/2020');

    const target = new ProjectParticipantViewModel(employee);
    const result = target.checkDate();
    expect(result).toBeTruthy();
  });
});
