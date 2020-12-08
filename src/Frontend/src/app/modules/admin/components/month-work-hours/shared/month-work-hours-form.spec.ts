import { MonthWorkHoursForm } from './month-work-hours-form';
import { MonthWorkHours } from '@models/month-work-hours';

describe('MonthWorkHoursForm', () => {
  let component: MonthWorkHoursForm;

  it('holidays should be greater than 0', () => {
    component = new MonthWorkHoursForm();
    component.value.holidays = '1,2,3';
    const model = new MonthWorkHours();

    component.fill(model);

    expect(model.holidays.length).toBeGreaterThan(0);
  });

  it('specialWorkdays should be greater than 0', () => {
    component = new MonthWorkHoursForm();
    component.value.specialWorkdays = '1,2,3';
    const model = new MonthWorkHours();

    component.fill(model);

    expect(model.specialWorkdays.length).toBeGreaterThan(0);
  });

  it('holidays should be empty', () => {
    component = new MonthWorkHoursForm();
    const model = new MonthWorkHours();
    component.fill(model);

    expect(model.holidays).toBe(null);
  });

  it('specialWorkdays should be empty', () => {
    component = new MonthWorkHoursForm();
    const model = new MonthWorkHours();
    component.fill(model);

    expect(model.specialWorkdays).toBe(null);
  });

  it('should update holidays', () => {
    const model = new MonthWorkHours({
      holidays: [1, 2, 3]
    });
    component = new MonthWorkHoursForm(model);
    component.value.holidays = '1,2';

    component.fill(model);

    expect(model.holidays.length).toBe(2);
  });

  it('should update specialWorkdays', () => {
    const model = new MonthWorkHours({
      specialWorkdays: [1, 2, 3]
    });
    component = new MonthWorkHoursForm(model);
    component.value.specialWorkdays = '1,2';

    component.fill(model);

    expect(model.specialWorkdays.length).toBe(2);
  });
});
