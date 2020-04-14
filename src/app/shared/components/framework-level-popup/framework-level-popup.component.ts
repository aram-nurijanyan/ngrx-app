import { Component, Inject, OnInit } from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { FormControl, Validators } from "@angular/forms";
import { FrameworkLevelModel } from "../../models/framework-level.model";

@Component({
  selector: "app-framework-level-popup",
  templateUrl: "./framework-level-popup.component.html",
  styleUrls: ["./framework-level-popup.component.scss"],
})
export class FrameworkLevelPopupComponent implements OnInit {
  title: string;
  nameFormControl: FormControl;
  descriptionFormControl: FormControl;
  frameworkLevel: FrameworkLevelModel;
  parentId: string;
  level: number;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<FrameworkLevelPopupComponent>) {}

  ngOnInit() {
    this.title = this.data.title || "";
    this.parentId = this.data.parentId;
    this.level = this.data.level+1 || 0;
    this.frameworkLevel = this.data.frameworkLevel
      ? this.data.frameworkLevel
      : { name: "", description: "", level: this.level };
    this.nameFormControl = new FormControl(this.frameworkLevel.name, [
      Validators.required,
    ]);
    this.descriptionFormControl = new FormControl(
      this.frameworkLevel.description
    );
  }

  confirm() {
    if (this.nameFormControl.valid) {
      if(this.parentId) {
        this.frameworkLevel.parentId = this.parentId
      }
      this.frameworkLevel.name = this.nameFormControl.value;
      this.frameworkLevel.description = this.descriptionFormControl.value;
      this.dialogRef.close(this.frameworkLevel);
    }
  }
}
