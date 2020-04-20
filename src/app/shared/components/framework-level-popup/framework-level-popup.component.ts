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
  viewMode: boolean;
  nameFormControl: FormControl;
  descriptionFormControl: FormControl;
  frameworkLevel: FrameworkLevelModel;
  parentId: string;
  level: number;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<FrameworkLevelPopupComponent>) {}

  ngOnInit() {
    this.viewMode = this.data.viewMode;
    this.parentId = this.data.parentId;
    this.level = this.data.level+1 || 0;
    this.frameworkLevel = this.data.frameworkLevel
      ? this.data.frameworkLevel
      : { name: "", description: "", level: this.level };
    this.nameFormControl = new FormControl({
      value: this.frameworkLevel.name,
      disabled: this.viewMode
    }, [
      Validators.required,
    ]);
    this.descriptionFormControl = new FormControl({
      value: this.frameworkLevel.description,
      disabled: this.viewMode
    });
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

  edit() {
    this.viewMode = false;
    this.nameFormControl.enable();
    this.descriptionFormControl.enable();
  }
}
