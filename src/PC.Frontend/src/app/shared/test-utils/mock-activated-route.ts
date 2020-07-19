import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivatedRouteMock {
  parent: any;
  params: any;
  snapshot = {
    fragment: ''
  };
  public paramMap = of(
    convertToParamMap({
      testId: 'abc123',
      anotherId: 'd31e8b48-7309-4c83-9884-4142efdf7271',
      id: '1'
    })
  );
}
