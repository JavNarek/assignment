import { Injectable } from '@angular/core';
import { Type } from 'src/app/app.component';

export interface ValidFile {
  inValidMessages: string[]
	invalidData: string[]
  empty:boolean
}

@Injectable({
  providedIn: 'root'
})


export class ValidationService {

  constructor() { }

  prepareDataAndValidateFile(csvData:any, config:any):ValidFile {
    const validityData: ValidFile = {
			inValidMessages: [],
			invalidData: [],
      empty:true
		};

    if(csvData.length){
      validityData.empty = false
    }

    csvData.forEach((row:string[], rowIndex:number) => {
      
      if(rowIndex<config.startRow){
        return
      }

      if (rowIndex !== 0 && row.length !== config.headers.length) {
				validityData.inValidMessages.push(
					'Number of fields mismatch: expected ' + config.headers.length + ' fields' +
					' but parsed ' + row.length + '. In the row ' + rowIndex
				);
        return
			}

      row.forEach((columnValue: any, columnIndex:number) => {
        const valueConfig = config.headers[columnIndex];

        if (!valueConfig) {
					return;
				}

        if (valueConfig.required && !String(columnValue).length) {
					validityData.inValidMessages.push(
            String(valueConfig.name + ' is required in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
					);
          validityData.invalidData.push(columnValue)
				} 

        if(valueConfig.type===Type.Integer){
          const num = +String(columnValue).split(',').join('')
          if(!(Number(num)=== num)){
            validityData.inValidMessages.push(
              String(valueConfig.name + ' is not integer in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
            );
            validityData.invalidData.push(columnValue)
          };
        }

        if(valueConfig.type===Type.Date){
          if(!(columnValue instanceof Date)){
            validityData.inValidMessages.push(
              String(valueConfig.name + ' is not date in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
            );
            validityData.invalidData.push(columnValue)
          };
        }

        if(valueConfig.type===Type.Text){
          const regexp =/^[a-zA-Z ]*$/
          if(!(String(columnValue).match(regexp))){
            validityData.inValidMessages.push(
              String(valueConfig.name + ' is not text in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
            );
            validityData.invalidData.push(columnValue)
          }
        }

        if(valueConfig.type===Type.Float){
          const regexp =/^[+-]?\d+(\.\d+)?$/
          if(!(String(columnValue).match(regexp))){
            validityData.inValidMessages.push(
              String(valueConfig.name + ' is not float in the ' + (rowIndex + 1) + ' row / ' + (columnIndex + 1) + ' column')
            );
            validityData.invalidData.push(columnValue)
          }
        }

      });
    });
    return validityData
  }



}
