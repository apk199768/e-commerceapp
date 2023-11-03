import { FormControl, ValidationErrors } from "@angular/forms";

export class ApkValidators {
    static notOnlyWhiteSpaces(control:FormControl):ValidationErrors|null{
        if((control.value!=null)&&(control.value.trim().length==0)){
            return {'notOnlyWhiteSpaces':true}
        }

        return null;
       
    }
}
