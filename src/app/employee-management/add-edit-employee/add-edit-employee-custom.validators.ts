import {
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
export function dateValidation(date :any): any {
  return (group: FormGroup): ValidationErrors => {
    const dateOfBirth = group.controls['dateOfBirth'];
    const dateOfJoining = group.controls['dateOfJoining'];
    if (dateOfBirth.value) {
      const dob = date.transform(dateOfBirth.value, 'yyyy');
      if ((new Date()).getFullYear() - dob < 17) {
        dateOfBirth.setErrors({minAge: true});
      } else {
        dateOfBirth.setErrors(null);
      }
      if (dateOfJoining.value) {
        const doj = date.transform(dateOfJoining.value, 'yyyy');
        if (doj - dob > 17) {
          dateOfJoining.setErrors(null);
        } else {
          dateOfJoining.setErrors({minJoin: true});
        }
      }
    }
    return {};
  };
}

