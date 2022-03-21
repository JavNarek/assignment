import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileService } from 'src/services/file.service';
import { ValidationService } from 'src/services/validation.service';

export enum Type {
  Date,
  Email, 
  Integer,
  Float,
  Text,
  Percentage
}

export interface Headers {
  name: string
  required?:boolean
  type?:Type
}
export  interface CSVconfig{
  headers: Headers[]
  startRow: number
}

export interface CombinedData{
  message: string
  cellData:any
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isEmpty=false
  file = new FormControl('')
  CSVConfig:CSVconfig= {
    headers: [
      { name: 'No'},
      { name: 'Police number',  required: true, type:Type.Integer },
      { name: 'Branch', required: true, type:Type.Text },
      { name: 'Category', type:Type.Text  },
      { name: 'Nature of risk / Activity', type:Type.Text},
      { name: 'Effective Date',required: true, type:Type.Date },
      { name: 'Date deadline ', required: true , type:Type.Date},
      { name: 'Transaction date / seized', type:Type.Date  },
      { name: 'Subscriber', type:Type.Text  },
      { name: 'Insured' , type:Type.Text},
      { name: 'Location' , type:Type.Text},
      { name: 'Sum insured', type:Type.Integer},
      { name: 'Prime HT', type:Type.Integer},
      { name: 'Comission paid', required: true, type:Type.Float},
      { name: 'Part ASSIGNOR CoInS', required: true, type:Type.Percentage},
    ],
    startRow:5
  };

  invalidData!  :CombinedData[] | []

  constructor(
    private fileService: FileService,
    private validationService: ValidationService
    ) {}

  onUploaderChange(event: any) {
    this.fileService.excelToArray(event).then(data=>{
      let validateData = this.validationService.prepareDataAndValidateFile(data,this.CSVConfig) 
      this.invalidData = this.combineData(validateData.inValidMessages,validateData.invalidData)
      this.isEmpty=validateData.empty
      this.file.reset()
    })  
  }

  combineData(messages:string[], cells:any[]): CombinedData[]{
    let combinedData: any[]=[]
    if(messages.length === cells.length){
      messages.forEach((message, index)=>{
        combinedData.push(
          {
            message:message,
            cellData:cells[index]
          }
        )
      })
    }
    return combinedData
  }

  ngOnInit(): void {
  }
}
