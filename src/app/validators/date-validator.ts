import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';

export function dateValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    const inputDateValue = control.value;
    const inputDate = new Date(inputDateValue + 'T00:00:00');
    const currentDate = new Date();

    const currentDateNormalized = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    if (inputDate > currentDateNormalized) {
        return of({ invalidDate: true });
    } else {
        return of(null);
    }
  };
}
