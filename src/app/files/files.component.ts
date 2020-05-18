import { Component, OnInit } from '@angular/core';

import { File } from '../file';
import { FileService } from '../file.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  constructor(private fileService: FileService, private messageService: MessageService) { }

  selectedFile: File;

  files: File[];

  ngOnInit(): void {
    this.getFiles();
  }

  onSelect(file: File): void {
    this.selectedFile = file;
    this.messageService.add(`FileService: Selected file id=${file.id}`);
  }

  // getFiles(): void {
  //   this.files = this.fileService.getFiles();
  // }
  getFiles(): void {
    this.fileService.getFiles()
      .subscribe(files => this.files = files)
  }

}


// skapa message för att kunna anvnäda vid navigering eller när en fil är markerad
// https://angular.io/tutorial/toh-pt4#show-messages
