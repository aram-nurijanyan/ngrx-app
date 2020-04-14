import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  templateUrl: './show-message-popup.component.html',
  styleUrls: ['./show-message-popup.component.scss']
})
export class ShowMessagePopupComponent implements OnInit {

  title: string;
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
    this.message = this.data.message || '';
    this.title = this.data.title || '';
  }

}
