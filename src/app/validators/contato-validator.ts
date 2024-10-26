import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function contatoValidator(...fields: string[]): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const isAnyFieldFilled = fields.some(field => {
      const control = formGroup.get(field);
      return control && control.value;
    });
    return isAnyFieldFilled ? null : { atLeastOneFieldRequired: true };
  };
}