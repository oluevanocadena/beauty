import { FormControl, ValidationErrors, Validators } from "@angular/forms";
import { Injectable } from '@angular/core';

function whitespaceValidator(form: FormControl): ValidationErrors {
  return form?.value?.toString().startsWith(" ") ? { whitespace: true } : null;
}

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  public Required = [Validators.required, whitespaceValidator];
  public DiscountCode = [Validators.required, Validators.minLength(6), Validators.pattern("^[A-Za-z0-9_]*[A-Za-z0-9][A-Za-z0-9_-]*$")];
  public CheckboxRequired = [Validators.requiredTrue];
  public Email = [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")];
  public Phone = [Validators.required, Validators.pattern(/^\+\d{1,4}\d{10}$/)];
  public Password = [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_])(?=.{8,})\S+$/)];
  public Time = [Validators.required, Validators.pattern("^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM|am|pm)$")];
  public Price = [Validators.required, Validators.pattern("^([0-9]*[1-9][0-9]*(\.[0-9]{1,2}))$|^([0-9]*[0-9][0-9]*(\.[0-9]{1,2}))$|^[1-9][0-9]*$")];
  public PriceFourDecimal = [Validators.required, Validators.pattern("^([0-9]*[1-9][0-9]*(\.[0-9]{1,4}))$|^([0-9]*[0-9][0-9]*(\.[0-9]{1,4}))$|^[1-9][0-9]*$")];
  public PriceZero = [Validators.required, Validators.pattern("^(?=1*[0-9])[0-9]*[.,]?[0-9]{1,2}$")];
  public Percentage = [Validators.required, Validators.pattern("^([1-9]|([1-9][0-9])|100)$")];
  public ZeroOrMore = [Validators.required, Validators.pattern("^[0-9][0-9]*$")];
  public OneWord = [Validators.required, Validators.pattern("^[A-Za-z]*$")];
  public SATRfc = [Validators.required, Validators.pattern('^([a-zA-ZÑ&]{3,4})?(?:-?)?(\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01]))?(?:-?)?([a-zA-Z\\d]{2})([A\\d])$')];
  public Curp = [Validators.required, Validators.pattern('^[A-Za-z]{4}[0-9]{6}[HMhm]{1}[A-Za-z]{2}[BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz]{3}([A-Za-z]{2})?([0-9]{2})?$')];
  public NSS = [Validators.required, Validators.minLength(11), Validators.maxLength(11)];
  public ZipCode = [Validators.required, Validators.minLength(4), Validators.maxLength(5), Validators.pattern(/^[0-9]{4,6}$/)];
}
