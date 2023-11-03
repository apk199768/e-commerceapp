import { TestBed } from '@angular/core/testing';

import { ApkShopFormService } from './apk-shop-form.service';

describe('ApkShopFormService', () => {
  let service: ApkShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApkShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
