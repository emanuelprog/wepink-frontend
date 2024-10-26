import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormularioService } from '../services/formulario.service';
import { lastValueFrom } from 'rxjs';

export function nisValidator(formularioService: FormularioService): AsyncValidatorFn {
  return async (control: AbstractControl): Promise<ValidationErrors | null> => {
    const nis = control.value;
    if (!nis) {
      return null;
    }

    if (nis.trim() === '') {
      return null;
    }

    if (nis.length < 11) {
      return { invalidNis: 'NIS inválido' };
    }

    try {
      const response = await lastValueFrom(formularioService.validaNis(nis));
      return response.status === 200 ? { nisExists: 'NIS já cadastrado' } : null;
    } catch (error) {
      console.error('Erro ao validar NIS:', error);
      return { validationError: 'Erro ao validar NIS' };
    }
  };
}
